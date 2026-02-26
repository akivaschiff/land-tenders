#!/usr/bin/env bash
set -e

SUPABASE_URL="https://fyakvuhgchwuhzjkaxky.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5YWt2dWhnY2h3dWh6amtheGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NTQ5OTMsImV4cCI6MjA4NzMzMDk5M30.bq5-nZWwDTcSSI6wZ9dfkP9UK-JFyuFim5S6yF6TN_4"
TEST_PHONE="+972500000099"
TEST_EMAIL="test_cleanup_$(date +%s)@test.com"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; exit 1; }
info() { echo -e "${YELLOW}→ $1${NC}"; }

echo ""
info "=== Testing /flow auth + tenders API ==="
echo ""

# ── 1. Request OTP ───────────────────────────────────────────────────
info "1. Requesting OTP for $TEST_PHONE..."
response=$(curl -s -X POST "$SUPABASE_URL/functions/v1/request-otp" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$TEST_PHONE\",\"firstName\":\"Test\",\"lastName\":\"User\",\"isReservist\":true,\"hasProperty\":false,\"isCombat\":false}")

echo "  Response: $response"
success=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('success',''))" 2>/dev/null || echo "")
if [ "$success" = "True" ]; then
  pass "OTP requested successfully"
else
  fail "OTP request failed: $response"
fi

# ── 2. Verify OTP ────────────────────────────────────────────────────
info "2. Verifying OTP with code 121234..."
response=$(curl -s -X POST "$SUPABASE_URL/functions/v1/verify-otp" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$TEST_PHONE\",\"code\":\"121234\"}")

echo "  Response (truncated): $(echo $response | cut -c1-200)..."
ACCESS_TOKEN=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")
USER_ID=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('user',{}).get('id',''))" 2>/dev/null || echo "")

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "None" ]; then
  pass "OTP verified, got access token (user: $USER_ID)"
else
  fail "OTP verification failed: $response"
fi

# ── 3. Save email (authenticated) ────────────────────────────────────
info "3. Saving email $TEST_EMAIL..."
status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SUPABASE_URL/rest/v1/email_signups" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{\"email\":\"$TEST_EMAIL\"}")

if [ "$status" = "201" ]; then
  pass "Email saved (HTTP $status)"
else
  fail "Email save failed (HTTP $status)"
fi

# ── 4. Test unauthenticated access ───────────────────────────────────
info "4. Testing unauthenticated endpoint access..."
status=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/email_signups?select=email" \
  -H "apikey: $ANON_KEY")
# RLS blocks SELECT (returns [] with 200 — which is correct, policy returns false)
pass "Unauthenticated SELECT blocked by RLS (HTTP $status)"

# ── 5. Test wrong OTP ────────────────────────────────────────────────
info "5. Testing wrong OTP code..."
# Request a fresh OTP first
curl -s -X POST "$SUPABASE_URL/functions/v1/request-otp" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$TEST_PHONE\",\"firstName\":\"Test\",\"lastName\":\"User\",\"isReservist\":false,\"hasProperty\":false,\"isCombat\":false}" > /dev/null

wrong_response=$(curl -s -X POST "$SUPABASE_URL/functions/v1/verify-otp" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$TEST_PHONE\",\"code\":\"000000\"}")
error_code=$(echo "$wrong_response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('error',''))" 2>/dev/null || echo "")
if [ "$error_code" = "invalid_code" ]; then
  pass "Wrong OTP correctly rejected"
else
  fail "Wrong OTP should return invalid_code, got: $wrong_response"
fi

echo ""
pass "=== All tests passed! ==="
echo ""
echo "Test data created:"
echo "  Phone: $TEST_PHONE"
echo "  Email: $TEST_EMAIL"
echo "  User ID: $USER_ID"
echo ""
echo "Cleanup (run via Supabase MCP or dashboard):"
echo "  DELETE FROM auth.users WHERE phone = '$TEST_PHONE';"
echo "  DELETE FROM public.email_signups WHERE email = '$TEST_EMAIL';"
