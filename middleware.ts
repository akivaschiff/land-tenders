import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/flow/signup', req.url));
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL('/flow/signup', req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/flow/signup', req.url));
  }
}

export const config = {
  matcher: ['/flow/tenders'],
};
