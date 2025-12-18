# Tami - Government Land Tender Platform

A modern, user-friendly Next.js application that helps individuals connect with government land tenders for purchasing lots for personal house construction.

## Design Philosophy

The design embraces a warm, optimistic, and down-to-earth aesthetic that makes the typically intimidating process of government land tenders feel simple and approachable:

- **Color Palette**: Bright, earthy tones including terracotta, sunny amber, fresh sage green, and sky blue
- **Typography**: Friendly geometric fonts (Outfit for headings, Inter for body text)
- **Visual Language**: Organic shapes, subtle topographic patterns, and flowing layouts that evoke land and earth
- **Animations**: Gentle, welcoming micro-interactions that guide users through the process

## Features

### Current Implementation

1. **Hero Landing Page**
   - Welcoming cover with organic shapes and bright colors
   - Clear call-to-action to start the journey
   - Trust indicators showing platform statistics
   - Feature highlights with icon cards

2. **User Information Modal**
   - Collects user identification number
   - Date of birth input with automatic age calculation
   - Sex selection (Male/Female)
   - Marital status (Single/Married)
   - Military service information (Reservist, Combat Unit)
   - Form validation and smooth animations

3. **Results Page (Placeholder)**
   - Displays user profile summary
   - Ready for tender results integration
   - Personalized pricing calculations to be implemented

### Upcoming Features

- Display government tender data
- Filter and sort tenders by location, price, and lot size
- Personalized price calculations based on user profile
- Detailed tender information with maps and images
- Save and compare favorite lots
- Direct links to official tender applications

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI**: Custom components with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000` (or the next available port).

## Project Structure

```
tami/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Hero landing page
│   ├── globals.css        # Global styles and Tailwind config
│   └── results/           # Results page
│       └── page.tsx       # Results display (placeholder)
├── components/            # React components
│   └── UserInfoModal.tsx # User information dialog
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── next.config.js        # Next.js configuration
```

## Design System

### Colors

- **Terracotta** (Primary): Warm, earthy orange-red
- **Amber**: Sunny, optimistic yellow-orange
- **Sage**: Fresh, calming green
- **Sky**: Bright, hopeful blue

### Components

- `btn-primary`: Primary action button with gradient hover effect
- `btn-secondary`: Secondary button with outline style
- `input-field`: Form input with focus states
- `card-container`: Content card with backdrop blur
- `organic-blob`: Decorative organic shapes

### Animations

- `animate-float`: Gentle floating motion for decorative elements
- `animate-slide-up`: Entrance animation from bottom
- `animate-fade-in`: Simple fade-in effect
- `animate-scale-in`: Scale entrance animation

## User Flow

1. **Landing**: User arrives at the hero page
2. **Information Collection**: User clicks "Start Your Journey" and fills in the modal
3. **Results**: User is redirected to the results page with personalized tender matches
4. **Details** (Coming Soon): User can view detailed information about each tender

## Data Structure

### User Data
```typescript
{
  idNumber: string;
  birthDate: string;
  age: number;
  sex: 'male' | 'female';
  maritalStatus: 'single' | 'married';
  isReservist: boolean;
  isCombatUnit: boolean;
}
```

### Tender Data (To Be Implemented)
```typescript
{
  id: string;
  location: string;
  numberOfLots: number;
  sizeRange: { min: number; max: number }; // in square meters
  priceRange: { min: number; max: number }; // base prices
  developmentCostRange: { min: number; max: number };
  deadlineDate: string;
  tenderUrl: string;
}
```

## Price Calculation Logic (To Be Implemented)

Prices are adjusted based on:
- **Marital Status**: Different base rates for single vs. married
- **Military Service**: Discounts for army reservists
- **Combat Units**: Additional discounts for combat unit members

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

## Author

Built with Claude Code
