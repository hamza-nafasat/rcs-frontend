# Frontend Cleanup — 3 Phase Plan

Bringing `frontend/` fully in line with [CLAUDE.md](./CLAUDE.md).

---

## ⚠️ The one rule that overrides everything

> **The UI must be pixel-identical before and after every phase.**
> Same layout, same spacing, same colors, same fonts, same animations, same responsive
> breakpoints. A user must not be able to tell any of this work happened.

This is a **readability refactor only**. Nothing here is allowed to become a redesign.

### Forbidden in all three phases

| Never | Why |
|---|---|
| Change any Tailwind class that affects appearance | padding, margin, gap, width, height, color, font, radius, shadow, breakpoint |
| Change a design token value in `index.css` | shifts colors app-wide |
| Add or remove a DOM element that carries a `className` | changes layout |
| Change flex/grid **child count** | direct children drive `flex`/`grid` layout |
| "Improve" spacing, alignment, or wording while you're in the file | out of scope |
| Change component props that alter rendering | `size`, `rounded`, `color`, `variant` |

### Allowed

- Moving, renaming, deleting files; rewiring imports
- Renaming variables, functions, components
- Removing an element that has **no** `className`, **no** style, and is not a flex/grid child
- Swapping `<div>` → `<section>`/`<article>`/`<header>` (both are `display: block`; no CSS in this
  project targets element names except `html` and `button:hover`)
- Extracting code into functions/files that render the identical tree

### How to verify each phase

```bash
# 1. Before starting the phase — capture the baseline
git checkout -b cleanup/phase-N
npm run dev          # screenshot every route at 375px, 768px, 1440px

# 2. After the phase
npm run build        # must succeed
npm run lint         # must pass
npm run dev          # re-screenshot the same routes, compare

# 3. Prove no styling was touched — this diff must be EMPTY
git diff -U0 | grep -E '^[+-].*className=' | grep -vE '^\+\+\+|^---'
```

The `className` grep is the strongest guard: in Phases 1 and 2 it should return **nothing except
lines that moved verbatim**. Phase 3 is the only phase where `className` changes are expected, and
each one must be justified class-for-class.

Every phase ends on a **working, committed, deployable** codebase.

---

# Phase 1 — Structure & Naming

**Files move. File contents do not change (except import paths).**

Lowest risk of the three: no JSX is edited, so the rendered DOM cannot change.

## 1.1 Create the missing folders

```
src/components/global/              cross-module components
src/pages/<role>/<module>/modals/   module-only modals   (20 modules, none have one)
src/pages/<role>/<module>/utils/    module helpers + data (only auth has one)
```

## 1.2 Delete duplication — 18 byte-identical files

**`client/messages/` is a byte-for-byte copy of `admin/messages/` — all 10 files.**

- Move the 9 shared components to `components/global/messages/`
- Move the shared page body to `components/global/messages/MessagesView.jsx`
- `admin/messages/AdminMessages.jsx` and `client/messages/ClientMessages.jsx` become thin pages that
  render `<MessagesView type="admin" />` / `type="client"` — the same pattern `AuthLayout` and
  `Dashboard` already use
- **Zero UI change**: the rendered tree is the same component with the same props

**`user/dashboard/components/scorecard/` shares 7 identical files with `admin/pipeline/components/scorecard/`**

- Move to `components/global/scorecard/`:
  `CategoryScores` · `ScoreRadar` · `ScorecardSection` · `StageSelector` ·
  `InlineLocationMap` · `LocationAssignModal` · `scorecardData.js`
- Delete both copies, point all importers at `global/`
- ⚠️ `ApplicantScorecardDrawer` (188 / 191 / 159 lines) and the 4-way `ScoreRadar` split are **not**
  identical — leave them alone here, they are Phase 3

**`client/fdd/components/ClientFddTable.jsx` is identical to `admin/fdd/components/FddTable.jsx`**
→ move to `components/global/FddTable.jsx`, delete both copies.

## 1.3 Fix folder names

- `client/franchisee/component/` → `client/franchisee/components/`

## 1.4 Move modals into `<module>/modals/`

| From | To |
|---|---|
| `admin/moderators/components/AddEditModeratorModal.jsx` | `admin/moderators/modals/ModeratorAddEditModal.jsx` |
| `admin/moderators/components/ManageAccountsModal.jsx` | `admin/moderators/modals/ModeratorManageAccountsModal.jsx` |
| `admin/fdd/components/AddFddModal.jsx` | `admin/fdd/modals/FddAddModal.jsx` |
| `admin/client-management/components/AddEditClientModal.jsx` | `admin/client-management/modals/ClientAddEditModal.jsx` |
| `admin/client-management/components/ClientDetailsModal.jsx` | `admin/client-management/modals/ClientDetailsModal.jsx` |
| `client/moderators/components/ClientAddEditModeratorModal.jsx` | `client/moderators/modals/ModeratorAddEditModal.jsx` |
| `client/moderators/components/ClientManageAccountsModal.jsx` | `client/moderators/modals/ModeratorManageAccountsModal.jsx` |
| `client/fdd/components/ClientAddFddModal.jsx` | `client/fdd/modals/FddAddModal.jsx` |
| `scorecard/AdminLocationAssignModal.jsx` ×2 | `components/global/scorecard/LocationAssignModal.jsx` |

## 1.5 Move static data to `<module>/utils/data.js`

**Existing `data/` folders** (3): `admin/dashboard/data/` · `client/dashboard/data/` ·
`client/pipeline/data/` → each becomes `<module>/utils/data.js`

**Data files sitting in `components/`** (3):
`client-management/components/clientsData.js` · `pipeline/components/pipelineApplicants.js` ·
`admin/notifications/notificationTypes.jsx`

**Mock arrays inlined in page files** (11 pages, 14 arrays) — move each into its module's
`utils/data.js` and import it:

`AdminDashboard.jsx` (3 arrays, ~174 lines) · `Moderators.jsx` · `FDD.jsx` · `ClientManagement.jsx` ·
`Support.jsx` · `Messages.jsx` ×2 · `ClientDashboard.jsx` · `ClientModerator.jsx` · `ClientFDD.jsx` ·
`Report.jsx`

> Static data is **never shared between modules** — even when two modules' data looks identical,
> each keeps its own copy (CLAUDE.md §1.2).

## 1.6 Rename files — 65 total

**Pages keep the role prefix** when the module exists for 2+ roles; **components never do.**

### Page renames

| From | To | Reason |
|---|---|---|
| `admin/moderators/Moderators.jsx` | `AdminModerators.jsx` | module spans admin+client |
| `client/moderators/ClientModerator.jsx` | `ClientModerators.jsx` | plural, matches folder |
| `admin/fdd/FDD.jsx` | `AdminFdd.jsx` | `Fdd` casing matches `FddTable` |
| `client/fdd/ClientFDD.jsx` | `ClientFdd.jsx` | |
| `admin/pipeline/Pipeline.jsx` | `AdminPipeline.jsx` | module spans admin+client |
| `client/pipeline/Pipeline.jsx` | `ClientPipeline.jsx` | |
| `admin/pipeline/ApplicantDetailPage.jsx` | `AdminApplicantDetailPage.jsx` | |
| `admin/support/Support.jsx` | `AdminSupport.jsx` | module spans admin+client |
| `admin/messages/Messages.jsx` | `AdminMessages.jsx` | |
| `client/messages/Messages.jsx` | `ClientMessages.jsx` | |
| `admin/notifications/Notification.jsx` | `Notifications.jsx` | matches folder; admin-only |
| `client/franchisee/ClientFranchisee.jsx` | `Franchisee.jsx` | client-only module → no prefix |
| `client/reports/Report.jsx` | `Reports.jsx` | matches folder; client-only |

Already correct: `AdminDashboard` · `ClientDashboard` · `UserDashboard` · `ClientSupport` ·
`ClientApplicantDetailPage` · `ClientManagement` · `ViewAllActivity` · `Settings` · all `auth/` pages

### Component renames — drop the role prefix, add the module prefix

**`client/fdd/components/`** → `ClientFddFilter` → `FddFilter` · `ClientFddHeading` → `FddHeading`

**`client/moderators/components/`** → `ClientModeratorFilter` → `ModeratorFilter` ·
`ClientModeratorHeading` → `ModeratorHeading` · `ClientModeratorTable` → `ModeratorTable` ·
`ClientUserList` → `ModeratorUserList` · `ClientUserListItem` → `ModeratorUserListItem`

**`admin/moderators/components/`** → `UserList` → `ModeratorUserList` ·
`UserListItem` → `ModeratorUserListItem` · `InvitationByEmail` → `ModeratorInvitationByEmail`

**`client/franchisee/components/`** → `ClientFranchiseeFilter` → `FranchiseeFilter` ·
`ClientFranchiseeTable` → `FranchiseeTable` · `FranchiseeHeading` ✓

**`admin/pipeline/components/`** → `FranchisePipelineFilter` → `PipelineFilter` ·
`FranchisePipelineHeading` → `PipelineHeading` · `FranchisePipelineTable` → `PipelineTable` ·
`AdminPipelineStageOverview` → `PipelineStageOverview` (⚠️ a `PipelineStageOverview.jsx` already
exists in this folder — check which one the route actually renders and **delete the dead one**)

**`client/pipeline/components/`** → `ClientPipelineStageOverview` → `PipelineStageOverview` ·
`ClientApplicantStageOverview` → `PipelineApplicantStageOverview` ·
`ClientApplicantScorecardDrawer` → `PipelineApplicantScorecardDrawer`

**`user/dashboard/components/`** → `UserApplicantScorecardSection` → `DashboardApplicantScorecardSection` ·
`UserFranchisePipelineTable` → `DashboardPipelineTable` ·
`UserPipelineStageOverview` → `DashboardPipelineStageOverview` ·
`AdminDocumentRequestCard` → `DashboardDocumentRequestCard` (an `Admin*` file under `pages/user/`) ·
`UploadedDocumentsSection` → `DashboardUploadedDocumentsSection`

**`shared/auth/components/`** — add the `Auth` module prefix: `BackLink` → `AuthBackLink` ·
`FormSection` → `AuthFormSection` · `ApplicationNotice` → `AuthApplicationNotice` ·
`ApplicationFields` → `AuthApplicationFields` · `CreateAccountForm` → `AuthCreateAccountForm` ·
`LocationAssign` → `AuthLocationAssign`

### ⚠️ Confirm before starting: generic components

`BarChart` · `LineChart` · `MultiLineChart` · `DonutChart` · `StatsCard` · `DashboardHeading`
are generic and appear in 2+ modules. **Recommendation: promote them to `components/global/`
rather than giving them a module prefix** — `DashboardBarChart` reads worse than
`global/BarChart`. But note the two `StatsCard.jsx` have **different props** (`comparison` vs
`Badge`) and the two `BarChart.jsx` differ (57 vs 100 lines), so promoting means merging — which
belongs in Phase 3. **Decide this before Phase 1 starts.**

## Phase 1 — done when

- [ ] `components/global/` exists and holds the messages, scorecard and FddTable trees
- [ ] 18 duplicate files deleted; no file has a twin with the same MD5
- [ ] Every module has `components/`, `modals/` (if it has modals) and `utils/` (if it has data)
- [ ] No file name starts with a role that contradicts its folder
- [ ] No static data left inside a page file or a `components/` folder
- [ ] `npm run build` and `npm run lint` pass
- [ ] `git diff -U0 | grep className` shows **only verbatim moved lines**
- [ ] Screenshots identical at 375 / 768 / 1440

---

# Phase 2 — File Hygiene

**File contents get cleaned. The rendered DOM stays equivalent.**

Medium risk: JSX is edited, so every change needs the "does this element carry a class?" check.

## 2.1 Lift big config out of component bodies

9 files hold a `columns` array inside the component. Move each to a
`buildColumns({ onEdit, onView, onDelete })` function **above** the component — identical output,
the component body shrinks by ~110 lines.

`ClientTable` (101) · `ModeratorTable` (63) · `ClientModeratorTable` (63) · `SupportTable` (75) ·
`FddTable` (34) · `ClientFddTable` (34) · `ClientFranchiseeTable` (98) · `FranchisePipelineTable` (17) ·
`RecentApplicants` (17)

## 2.2 Split oversized files

| File | Lines | Approach |
|---|---|---|
| `auth/components/AuthLocationAssign.jsx` | **1187** | split canvas drawing / map rendering / form controls into `auth/utils/` + sub-components |
| `global/scorecard/LocationAssignModal.jsx` | **1101** | same shape as above |
| `settings/components/ProfileSetting.jsx` | 452 | split per settings card |
| `AdminDashboard.jsx` | 299 → ~125 | mostly solved by Phase 1.5 (data moves out) |

Target: **under ~150 lines** per component (CLAUDE.md §5). 32 files are over today.

## 2.3 Remove unnecessary wrappers — strictly

**Only remove an element when all three are true:** no `className`, no `style`, not a direct child
of a flex/grid container. Anything else stays.

Worst offenders (div count / semantic count):
`AuthLocationAssign` 35/1 · `LocationAssignModal` 25/1 · `DashboardUploadedDocumentsSection` 23/**0** ·
`ProfileSetting` 15/3 · `DashboardNotFound` 14/**0** · `ClientDetailsModal` 12/6

## 2.4 Apply semantic tags

Use the CLAUDE.md §3 table. `<div>` → `<section>`/`<article>`/`<header>`/`<footer>` is safe:
both are `display: block`, and no CSS in this project targets element names.
**Keep `<div>` for pure layout** — flex rows, grid cells, positioning contexts.

## 2.5 Remove debug leftovers — 19 sites in 11 files

`console.log` ×16 · `console.error` ×2 · `alert()` ×1

⚠️ `AdminPipelineStageOverview.jsx:30` uses `alert()` — that **is** visible UI. Removing it changes
behavior. Replace with the real notification path or leave a `TODO` and flag it; do not silently drop it.

## 2.6 Use shared primitives for raw controls

`reports/components/DateField.jsx` and `messages/.../MessageWrite.jsx` use raw `<input>` →
switch to `Input`, **passing whatever classes reproduce the current look exactly**.
Leave the map/canvas files alone — their inputs are genuinely special.

## Phase 2 — done when

- [ ] No `columns` array inside a component body
- [ ] No component over ~150 lines (or an explicit note saying why)
- [ ] Every removed element verified to have carried no class and no layout role
- [ ] No `console.log` / `console.error`; the `alert()` decision made explicitly
- [ ] `npm run build` and `npm run lint` pass
- [ ] Screenshots identical at 375 / 768 / 1440

---

# Phase 3 — Shared APIs & State

**The riskiest phase — this is the only one that touches `className` on purpose.**
Do it last, on its own branch, one component at a time.

## 3.1 `Button` — replace `type="icon"` with `variant`

This single change resolves **three** problems:

| Problem | Count |
|---|---|
| `!` overrides at call sites (§7.1) | **55** in 15 files |
| `type="icon"` overloading the HTML `type` prop (§4.3) | **33** in 18 files |
| Invalid `type` silently submitting forms (§9) | 1 real bug |

**The bug:** `CreateAccountForm.jsx:64` renders `<Button type="icon">Back to Login</Button>` inside
`<form onSubmit={handleSubmit}>`. `type="icon"` is invalid HTML, so the browser falls back to
`submit` — the button navigates **and** submits.

**Method — two passes, never one.** The variant vocabulary is defined in CLAUDE.md §7.1.

**Pass 3.1a — mechanical, provably zero-change.**
`type="icon"` → `variant="bare"` at all 33 sites; `type` becomes a real HTML type.
`BASE` keeps its `py-4`, so every existing `py-0!` / `py-2!` override lands exactly as today.

- Computed classes identical, apart from the stray literal `"false"` the old `&&` appended —
  a class matching no CSS rule
- **This pass alone fixes the form-submit bug**
- The 55 `!` overrides still work untouched — they are removed in Pass b, not here

**Pass 3.1b — one variant at a time, screenshot after each.**
Replace the repeated `className` + `textClassName` pairs with the semantic variants:

| Variant | Call sites | Where |
|---|---|---|
| `menuItem` | **11** | `ClientTable` · `ModeratorTable` · `SupportTable` · `ClientFranchiseeTable` · `ClientModeratorTable` |
| `menuTrigger` | **5** | the `⋯` button in the same 5 tables |
| `menuItemDanger` | **4** | the Delete row in 4 of those tables |

That is **20 of 35 sites**. The remaining 15 stay `bare` + `className` — modal close buttons,
quick-action tiles, "View all" links. They are one-offs; do not invent variants for them.

Take each call site's **current** string as the source of truth:
- `item-center` is a typo for `items-center` and generates no CSS — fix in Pass b, not Pass a
- Some strings repeat a class (`text-sm`, `transition`) or hold both `text-gray-700` **and**
  `text-red-600`. Preserve whichever wins **today**; do not tidy a conflict, because Tailwind's
  output order decides it, not the string order

**Only after Pass b** may `BASE` drop `py-4` — and only once no caller relies on it. Three sites
(`NotificationBell`, `AuthCreateAccountForm`, `ConsultantCard`) pass no `className` at all and
depend on that `py-4` for their height.

## 3.2 Merge near-duplicate components

These differ, so merging **can** change UI. Diff each pair, decide which behavior is correct, and
confirm the other's screens still render identically.

| Component | Copies | Lines | Note |
|---|---|---|---|
| `ScoreRadar` | 4 | 102 / 102 / 88 / 88 | two distinct variants |
| `ScorecardSection` | 4 | 55 / 39 / 35 / 35 | |
| `ApplicantScorecardDrawer` | 3 | 191 / 188 / 159 | |
| `StatsCard` | 2 | 27 / 22 | **different props** — `comparison` vs `Badge` |
| `BarChart` | 2 | 100 / 57 | |
| `DashboardHeading` | 2 | 12 / 12 | identical — safe merge |

Merged results go to `components/global/`.

## 3.3 Context → Redux Toolkit

`src/store/store.js` is **empty** and `@reduxjs/toolkit` / `react-redux` are **not installed**.
`src/context/NotificationsContext` is live in `Dashboard.jsx`, `NotificationBell.jsx`, `Notifications.jsx`.

1. `npm i @reduxjs/toolkit react-redux`
2. Build `store/store.js` + `store/notificationsSlice.js` with the **same** state shape and actions
3. Swap the 3 consumers from `useNotifications()` to `useSelector`/`useDispatch`
4. Delete `src/context/`

Behavior must be identical — the notification bell count, the list, and the read/unread states all
render exactly as before.

## Phase 3 — done when

- [ ] `Button` has a `variant` prop; `type` only ever `submit`/`button`/`reset`
- [ ] Zero `!` overrides at call sites
- [ ] The `CreateAccountForm` double-submit bug is gone
- [ ] No component name exists twice in the app (§1.4)
- [ ] `src/context/` deleted; RTK store live
- [ ] `npm run build` and `npm run lint` pass
- [ ] Screenshots identical at 375 / 768 / 1440 — **every route, both roles**

---

# Summary

| Phase | Theme | Risk | Main output |
|---|---|---|---|
| **1** | Structure & Naming | 🟢 Low — files move, contents don't | 18 files deleted · 65 renamed · folders correct |
| **2** | File Hygiene | 🟡 Medium — JSX edited, DOM equivalent | 9 column arrays lifted · 32 files shrunk · 19 logs gone |
| **3** | Shared APIs & State | 🔴 High — `className` changes on purpose | 55 `!` + 33 `type="icon"` gone · 1 bug fixed · RTK live |

After all three, the codebase matches CLAUDE.md end to end — **and the UI is byte-for-byte what it
is today.**
