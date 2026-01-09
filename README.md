# RentBase MVP

**The "Carfax for Rentals" in Africa** 🏠

RentBase helps renters in Ghana verify agents, generate legal contracts, and protect their deposits.

## Features

### 🔍 Agent Checker (FREE)
Search any agent's phone number to see their reviews and trust score before you engage.

### 📜 Pocket Lawyer (GH₵ 40)
Generate professional tenancy agreements instantly. Share drafts via WhatsApp for landlord approval.

### 🛡️ Deposit Shield (GH₵ 25)
Document property conditions before moving in with timestamped photos and get a legal PDF report.

## Tech Stack

- **Framework:** Nuxt 3 (SSR)
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Auth:** Phone OTP (SMS)
- **Payments:** Paystack
- **Styling:** TailwindCSS
- **PDF:** jsPDF

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `NUXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NUXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NUXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - Paystack public key
- `PAYSTACK_SECRET_KEY` - Paystack secret key

### 3. Setup Supabase Database

Run the SQL migration in your Supabase SQL editor (see `database/schema.sql`).

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
rentbase/
├── pages/
│   ├── index.vue                    # Home (Agent Search)
│   ├── contract/
│   │   ├── new.vue                  # Contract Form
│   │   └── preview/[id].vue         # Public Draft Preview
│   └── deposit/
│       └── new.vue                  # Photo Upload & Report
├── components/
│   ├── AuthModal.vue                # Phone OTP Modal
│   ├── AgentSearchBar.vue
│   ├── TrustScoreBadge.vue
│   ├── ContractForm.vue
│   ├── PhotoUploader.vue
│   └── PaystackButton.vue
├── composables/
│   ├── useAuth.ts
│   ├── usePaystack.ts
│   └── useContractGenerator.ts
├── server/
│   └── api/
│       └── paystack/
│           └── webhook.post.ts
├── utils/
│   ├── formatPhone.ts
│   ├── generatePDF.ts
│   └── generateReportPDF.ts
└── types/
    └── index.ts
```

## Database Schema

See `database/schema.sql` for the complete Supabase schema including:
- Profiles (linked to auth.users)
- Reviews (agent ratings)
- Transactions (Paystack ledger)
- Contracts (tenancy agreements)
- Condition Reports (deposit shield)

## License

MIT
