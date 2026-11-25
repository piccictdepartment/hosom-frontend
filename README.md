# HOSOM frontend

Next.js frontend for the Hope School of Ministry E-Learning and Academic Management System. The public site and role-specific workspaces follow the merged HOSOM UI prototype.

## Run with the backend

1. Start the Express backend on `http://localhost:4000` (see the backend README and Postman testing guide).
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:4000`.
3. Install dependencies with `npm ci`.
4. Start Next.js with `npm run dev` and open the local URL shown by Next.js.
5. Use **Portal login** with an account created in the backend database. Login, current-user hydration, logout and account security/session screens call the backend API.

## Demo workspaces and integration status

Credential-free demo access remains available for reviewing the interface. Those demo workspaces use illustrative records and in-memory React state. They are not authenticated server sessions and do not persist records to MySQL. The portal screens for student registration, programme/course administration, enrolment, materials, assignments, finance, results, announcements and reports still need to be connected domain-by-domain to the backend APIs. Do not use demo mode for real institutional records or treat demo role routes as access control.

## Interface structure

- `app/` contains public pages and role/section App Router routes.
- `components/` contains the public UI, role dashboards, learning pages, management pages and account pages.
- `lib/api.ts` contains the shared backend API client, role mapping and response/error handling.
- `lib/demo-data.ts` and `lib/workflows.ts` provide illustrative data and demo workflow state.
- `public/demo/` contains sample course documents and media from the UI prototype.

## Backend contract

The Express backend is separate. Its Phase 1 API and SRS mapping are documented in the backend project's `docs/api-requirements-mapping.md`. The API base URL is read from `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:4000` for local development. Configure the backend's `CORS_ORIGINS` to include the exact frontend origin.
