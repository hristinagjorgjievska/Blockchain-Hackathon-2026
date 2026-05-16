# Safe City MK — Anti-Phishing Traffic Fine Portal

A Solana blockchain application that hardens North Macedonia's **Safe City** traffic
enforcement system against the wave of phishing SMS scams targeting drivers.

Built for Blockchain Hackathon 2026.

## The problem

Citizens receive SMS messages claiming a traffic violation. Scammers exploit this by
sending near-identical fake messages containing **malicious links** that lead to
credential- and payment-stealing sites.

A *legitimate* message looks like this:

> Safe City MK: Детектиран е сообраќаен прекршок за вашето возило на 15.05.2026 во
> 18:42 часот. … Безбедносен код: **SC-8F3A2B91C7D4** … Не отворајте линкови од
> непознати испраќачи.

## The solution — anti-phishing by design

The core insight: **the legitimate flow never contains a link.**

1. The official SMS carries only a **security code** — never a URL.
2. The citizen opens the official portal **manually**, typing the address themselves.
3. They enter the code to see the violation, the evidence, and the fine.
4. They pay the fine either through an official non-crypto payment route or
   **on the Solana blockchain** — transparently and verifiably.

Because there is never a link to click, any phishing SMS with a link is *self-evidently*
fake. The app teaches this model and reinforces it throughout the UI.

## How the blockchain is used

Paying with crypto is a **real Solana transaction** (devnet):

- A SOL transfer from the citizen's wallet to the Safe City treasury account
  `CRQ3vWquPewjJhfvuJFVWiW1qkwoSD94W694SjkU6JuM`.
- A **Memo instruction** that stores an encrypted payment payload on-chain.
- The confirmed transaction signature becomes an **immutable, publicly verifiable
  receipt** — anyone can check it on Solana Explorer.

No custom on-chain program is needed: the app uses Solana's native System and Memo
programs, which keeps it reliable and trustless. The memo payload is encrypted by the
backend with AES-256-GCM before the wallet signs. Each violation record also carries a
**SHA-256 fingerprint**, displayed in the app for integrity verification.

## Features

- Single security-code entry that mirrors the SMS flow exactly
- Transparent violation evidence — traffic-camera capture, ANPR plate recognition,
  and a location map (all rendered as self-contained SVG)
- Full violation details and a transparent fine breakdown
- Real Macedonian fine prices in EUR, converted to MKD, with the 50% early-payment
  deduction for the first 8 days
- Non-crypto payment path backed by the backend/database
- On-chain fine payment via a Solana wallet, with an explorer-verifiable receipt and
  encrypted memo
- Prominent anti-phishing education, including a legitimate-vs-scam SMS comparison
- Macedonian, English, and Serbian Cyrillic (toggle)
- Responsive, designed mobile-first — people open this on their phone

## Tech stack

- React 18 + TypeScript + Vite 6
- Tailwind CSS
- `@solana/web3.js` + Solana Wallet Adapter + SPL Memo
- Node HTTP backend
- Supabase REST database
- Solana **devnet**

## Running locally

```bash
npm install
npm run dev:backend
```

In another terminal:

```bash
npm run dev:frontend
```

Then open the printed frontend URL (default http://localhost:5173). The Vite dev
server proxies `/api` to the backend at http://127.0.0.1:8787.

Production build: `npm run build`, then `npm run preview`.

## Supabase setup

The backend reads `.env.local` / `.env` and is already configured for the provided
Supabase project URL and publishable key. Apply the schema first:

1. Open the Supabase SQL editor.
2. Run [`backend/supabase/schema.sql`](backend/supabase/schema.sql).
3. Seed the demo violations:

```bash
npm run db:seed
```

Until the tables exist, the backend intentionally falls back to the bundled demo
records and an ignored local payment store under `backend/.data/` so the app remains
usable during local development. `/api/health` reports whether the Supabase tables are
ready.

## Demo security codes

The portal can read from Supabase through the backend. Four demonstration records are
also bundled and can be seeded to Supabase. Enter any of these codes — the first one
matches the example SMS:

| Code | Violation |
|------|-----------|
| `SC-8F3A2B91C7D4` | Speeding — Партизанска, Скопје |
| `SC-2E7D9A4F1B60` | Running a red light — Бул. Илинден |
| `SC-5C1B8E3A9F22` | Expired registration — Бул. Кузман Ј. Питу |
| `SC-9A4D2F8E1C36` | Illegal parking — Плоштад Македонија |
| `SC-A1B2C3D4E5F6` | Speeding up to 20 km/h over — Бул. Србија |
| `SC-B7C8D9E0F1A2` | Speeding 30-50 km/h over — Бул. Борис Трајковски |
| `SC-C3D4E5F6A7B8` | Speeding more than 50 km/h over — Бул. Александар Македонски |
| `SC-D9E8F7A6B5C4` | Obstructing illegal parking — Ул. Димитрие Чуповски |
| `SC-E1F2A3B4C5D6` | Disabled-space illegal parking — Кеј 13 Ноември |

(They are also listed under "Демо кодови" on the home screen.)

## Paying a fine (devnet)

To exercise the real on-chain payment:

1. Install a Solana wallet — e.g. [Phantom](https://phantom.app).
2. Switch the wallet to **Devnet** (Settings → Developer Settings).
3. Fund it with free devnet SOL from <https://faucet.solana.com>.
4. Open a violation, connect the wallet, and click **Pay**.
5. Approve the transaction; the app shows the confirmed signature and a link to
   verify it on Solana Explorer.

Fines use a demo devnet rate (1 SOL = 100,000 MKD) so payable amounts stay tiny.

## Project structure

```
frontend/
  src/
    data/violations.ts   demo violation records + real pricing rules
    i18n/                Macedonian/English/Serbian Cyrillic strings + language context
    solana/              devnet config, wallet provider, fine payment
    lib/                 API client, hashing, formatting, local payment cache
    components/          header, evidence SVGs, panels, icons
    pages/               Home, ViolationView
backend/
  src/                   API server, Supabase adapter, pricing, encrypted memos
  supabase/schema.sql    database schema and prototype RLS policies
```

## Scope notes (honest disclosure)

- This is a **hackathon prototype**, not an official government service.
- Violation records are served by the backend from Supabase once the schema is applied
  and seeded. In production they would come from the official Safe City case-management
  system; the security code acts as the citizen's bearer token to retrieve their own
  record.
- Evidence imagery is generated (stylized SVG) to illustrate the concept while
  rendering the *specific* violation data (plate, speed, time, location).
- Crypto payment is genuinely on-chain and verifiable, running on Solana devnet.
- Non-crypto payment is a backend/database record in this prototype; production would
  connect the same route to an official card or bank processor.
