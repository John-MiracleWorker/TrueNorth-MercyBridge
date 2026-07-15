# MercyBridge

A standalone web application for Christian bill assistance and community support. Built with React 18, TypeScript, Vite, Tailwind CSS, and Supabase.

## Overview

MercyBridge connects Christians facing financial hardship with sponsors who can help. Users can request assistance for bills, utilities, and essential needs. Sponsors can browse needs, contribute, and track their giving.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Backend:** Supabase (shared with TrueNorth)
- **Auth:** Supabase Auth (shared with TrueNorth)
- **Payments:** Stripe
- **Deployment:** Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and use the shared project's current browser-safe publishable key:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
VITE_TRUENORTH_URL=https://www.find-true-north.net
```

TrueNorth is the canonical owner of the shared Supabase migrations and Edge Functions. See
[`supabase/README.md`](supabase/README.md) before making backend changes.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
  components/          # React components
    MercyBridgeLayout.tsx   # Main app layout
    RoleGate.tsx            # Role-based access control
    AIReviewQueue.tsx
    AdminReviewQueue.tsx
    BillUpload.tsx
    ContributionVerifyModal.tsx
    MessageThread.tsx
    PaymentInstructions.tsx
    PaymentModal.tsx
    ProofUploadModal.tsx
    StripeProvider.tsx
  pages/               # Page components
    MercyBridgeLanding.tsx
    BrowseNeeds.tsx
    NeedDetail.tsx
    RequestHelp.tsx
    MercyBridgeAdmin.tsx
    RequesterDashboard.tsx
    SponsorDashboard.tsx
    StewardshipCoach.tsx
  services/            # API services
    mercybridgeApi.ts
  types/               # TypeScript types
    mercybridge.ts
  contexts/             # React contexts
    SafeAuthProvider.tsx
    ThemeContext.tsx
  lib/                  # Utilities
    query-client.ts
    logger.ts
    utils.ts
  integrations/
    supabase/
      client.ts
      types.ts
```

## Deployment

Deployed to Cloudflare Pages at `mercybridge.find-true-north.net`.

## Shared Backend

MercyBridge shares the same Supabase project as TrueNorth. Both apps use the same auth system, so users can sign in once and access both platforms.

## License

SEE LICENSE IN LICENSE
