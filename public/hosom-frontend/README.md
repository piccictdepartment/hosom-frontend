# HOSOM frontend

Next.js frontend for the Hope School of Ministry E-Learning and Academic Management System. The public site and all role-specific workspaces follow the merged HOSOM UI prototype.

## Run

```bash
npm ci
npm run dev
```

Open the local URL shown by Next.js. Use **Portal login** to enter any of the ten demo workspaces without credentials. Choose a role from the selector or open a workspace directly.

## Interface structure

- `app/` contains public pages and role/section App Router routes.
- `components/` contains the public UI, role dashboards, learning pages, management pages, account pages and in-memory workflow views.
- `lib/demo-data.ts` defines the role navigation and common illustrative records.
- `lib/workflows.ts` defines seed records and a reducer for interactive workflow handoffs.
- `lib/*-routing.ts` assigns each role section to a dedicated screen.
- `public/demo/` contains sample course documents and media from the UI prototype.

The public site includes About, Programmes, the 20-module curriculum and a four-step application form. Student and Lecturer areas include course learning, library/materials, timetable/live classes, attendance, profiles, reports and academic records. Management roles include department-specific catalogues, registers, oversight, reporting and system administration views.

## In-memory demonstration

The frontend does not use `localStorage`, `sessionStorage`, or IndexedDB. Workflow state exists only in React memory and resets on refresh. Where a screen uses local component state, leaving that screen also resets its draft.

The cross-role demo processes include:

- Application → Secretariat selection/admission → Head of Programs approval → Secretariat publication/enrolment.
- Lecturer assessment authoring → exam approval/scheduling → student submission → lecturer marking → Head of Programs review → Secretariat publication → student result.
- Lecturer resource drafting/publication → student access and completion.
- Student sample payment → Finance confirmation → updated fee balance and receipt view.
- Requisition submission → Head of HOSOM forwarding → Director approval → Finance sample payment initiation.
- Staff announcements, events and selected communication previews.

These are interface demonstrations. Credential-free demo access is intentionally enabled for implementation review. The frontend does not authenticate users, save uploads, deliver messages, transfer funds or enforce server permissions. Do not use this preview with real private records or expose it as a production system. Those responsibilities belong to the separate backend. Role routes are previews, not access control.

## Backend integration

Keep authentication and API contracts at a service boundary. Replace demo reads and reducer actions with requests to the independent backend, and enforce roles and record scope there. Integrate by domain: accounts and academic catalogue, enrolment, learning resources, assessments and results, then finance and communications. Uploaded media should use backend-managed storage.
# hosom-frontend
