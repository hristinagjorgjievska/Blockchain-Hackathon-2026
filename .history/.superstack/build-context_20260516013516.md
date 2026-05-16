# Build Context

Project: Safe City MK

Stack:
- Frontend: Vite, React, TypeScript, Tailwind
- Backend: Node HTTP server
- Blockchain: Solana devnet transfer + Memo instruction

Current milestones:
- Split frontend and backend workspaces.
- Added backend violation lookup API.
- Added encrypted backend-generated payment memo intents.
- Added plate verification status placeholders for future camera model integration.
- Added Supabase persistence for payment intents/receipts and server-side Solana receipt verification.
- Added Serbian frontend translation.
- Added admin API/UI for review queues, status updates, payments, audit logs, memo decrypt, and camera ticket creation.

Next milestones:
- Add government registry adapter for authoritative plate validation.
- Decide final payment privacy model before mainnet/payment-rail integration.
- Deploy frontend/backend and configure production secrets.
- Replace local token auth with managed operator auth before production launch.
