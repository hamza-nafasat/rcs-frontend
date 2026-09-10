# RCS Frontend Code Rules

# 1. Naming

The most important section. Names are the map of the codebase.

## 1.1 Folder structure

```
src/
  pages/
    <role>/                     admin | client | user | public
      <module>/                 auth, moderators, fdd, pipeline, client-management, …
        <Page>.jsx              page files, directly inside the module folder
        components/             components used ONLY by this module
        modals/                 modals used ONLY by this module
        utils/                  helper functions for this module
        utils/data.js           static data for this module

  components/
    shared/                     small primitives — Button, Input, Select, Checkbox, Badge, Breadcrumb
    global/                     larger components used by 2+ modules
    modals/                     modals used by 2+ modules
    layouts/                    app shell — Dashboard, Header, Sidebar

  store/                        Redux Toolkit — all app state
  utils/                        helpers used by 2+ modules
  assets/
```

- `public/` holds pages that need no login — `auth`, and anything else public-facing.
- Feature/module folders are **kebab-case**: `client-management`, `view-all-activity`.
- The components folder is **always `components/`**, never `component/`.

## 1.2 Where does this file go?

**The single question that decides everything: is it used by one module, or more than one?**

| What you are adding                                                  | Where it goes                                            |
| -------------------------------------------------------------------- | -------------------------------------------------------- |
| Page                                                                 | `pages/<role>/<module>/<Page>.jsx`                       |
| Component used by **one** module                                     | `pages/<role>/<module>/components/`                      |
| Small primitive — button, input, select, checkbox, badge, breadcrumb | `components/shared/`                                     |
| Larger component used by **2+** modules                              | `components/global/`                                     |
| Modal used by **one** module                                         | `pages/<role>/<module>/modals/`                          |
| Modal used by **2+** modules                                         | `components/modals/`                                     |
| Helper used by **one** module                                        | `pages/<role>/<module>/utils/`                           |
| Helper used by **2+** modules                                        | `src/utils/`                                             |
| Static data                                                          | `pages/<role>/<module>/utils/data.js` — **never shared** |
| App state                                                            | `src/store/` — **never `src/context/`**                  |

Two rules have no exceptions:

- **Static data is never shared between modules.** Each module keeps its own `utils/data.js`, even
  if the contents look similar. Modules must be able to change their data independently.
- **State lives in Redux Toolkit under `src/store/`.** Do not add React Context providers.

## 1.3 File names

**Module components carry the module name. They never carry the role name.**

The folder path already says which role you are in, so repeating it is noise. The module name, on the
other hand, tells a reader at a glance which module a component belongs to once it is open in a tab.

| File             | Formula                      | Example                                        |
| ---------------- | ---------------------------- | ---------------------------------------------- |
| Page             | `<Page>.jsx`                 | `auth/SignIn.jsx`, `moderators/Moderators.jsx` |
| Module component | `<Module><Part>.jsx`         | `auth/components/AuthHeading.jsx`              |
| Heading          | `<Module>Heading.jsx`        | `ModeratorHeading.jsx`                         |
| Filter           | `<Module>Filter.jsx`         | `ModeratorFilter.jsx`                          |
| Table            | `<Module>Table.jsx`          | `ModeratorTable.jsx`                           |
| Module modal     | `<Module><Purpose>Modal.jsx` | `modals/ModeratorAddEditModal.jsx`             |
| Shared primitive | plain noun, no prefix        | `components/shared/Button.jsx`                 |
| Static data      | `utils/data.js`              | `auth/utils/data.js`                           |

```
✅ pages/client/moderators/components/ModeratorTable.jsx     module prefix, no role
❌ pages/client/moderators/components/ClientModeratorTable.jsx   role prefix — forbidden
❌ pages/admin/pipeline/components/FranchisePipelineFilter.jsx   folder is already pipeline/
❌ pages/public/auth/components/BackLink.jsx                     missing module prefix → AuthBackLink
```

- **Page files are the one exception to the no-role-prefix rule.** When the same module exists for
  more than one role, the page file keeps the role prefix so import names stay unique and match the
  filename: `admin/dashboard/AdminDashboard.jsx`, `client/dashboard/ClientDashboard.jsx`,
  `user/dashboard/UserDashboard.jsx`. **Components inside those modules still drop it** —
  `components/DashboardHeading.jsx`, never `components/AdminDashboardHeading.jsx`.
- **The page file name matches its folder** where the module has only one page and one role:
  `notifications/` → `Notifications.jsx`, not `Notification.jsx`.
- One component per file. The file name is the component name.
- **Never put a role name in a file that lives under a different role.** A file called
  `AdminLocationAssignModal.jsx` must not sit inside `pages/user/`.

## 1.4 One name = one thing

**A component name is unique across the whole app.** Before creating a file, search for the name.

- If a component with that name exists and does the same job → **reuse it**.
- If it exists and does a _different_ job → **one of the two is misnamed**. Rename it to say what it
  actually is (`DashboardStatsCard` vs `PipelineStatsCard`, or better: one `StatsCard` with props).
- Two components with the same name in the same folder means one is dead code. Delete it.

## 1.5 Identifiers inside files

| Kind                              | Convention               | Example                                           |
| --------------------------------- | ------------------------ | ------------------------------------------------- |
| Config, lookup maps, option lists | `SCREAMING_SNAKE_CASE`   | `STATUS_STYLES`, `ROLES`, `PIPELINE_STAGES`       |
| Seed / mock data, style objects   | `camelCase`              | `initialModerators`, `initialFilters`, `cardData` |
| Handler inside a component        | `handleX`                | `handleSubmit`, `handleAddClient`                 |
| Prop that receives a handler      | `onX`                    | `onClose`, `onAddModerator`                       |
| Boolean                           | reads as a question      | `isOpen`, `hasMore`, `isDragging`                 |
| Narrowed list                     | `filteredX` / `visibleX` | `filteredClients`, `visibleMembers`               |

---

# 2. Markup — no unnecessary elements

**Every element must earn its place.** Before adding a wrapper, ask: does it carry a layout class the
child could not take, or a real meaning? If not, delete it.

- **A component that always renders inside a container adds no wrapper of its own** — return a
  Fragment `<>...</>`. See `RecentActivity.jsx` (parent supplies `<Card>`) and `ClientManagement.jsx`.
- **Never wrap a child just to give it a class** it could accept via `className`.
- **Never nest a single-child div inside a single-child div.** Collapse into one element.
- Never wrap a single element in a Fragment.

```jsx
// ✅ parent supplies the box
const RecentActivity = ({ activities }) => (
  <>
    <section className="mb-5 flex items-center justify-between">…</section>
    <section>…</section>
  </>
);

// ❌ wrapper that does nothing
const RecentActivity = ({ activities }) => (
  <div>
    <div className="mb-5 flex items-center justify-between">…</div>
  </div>
);
```

---

# 3. Semantic HTML

Use a semantic tag **when it describes what the content is**. Use `<div>` for pure layout — a flex
row, a grid cell, a positioning context. Do not rename every `div` to `section`.

| Tag                     | Use for                                               | Example here                                       |
| ----------------------- | ----------------------------------------------------- | -------------------------------------------------- |
| `<article>`             | Self-contained, independently meaningful block        | Page root, `StatsCard.jsx`                         |
| `<section>`             | A distinct region of a page or card                   | Dashboard regions, filter rows, form-control roots |
| `<main>`                | The one primary content area — exactly one per screen | `AuthLayout.jsx`, `Dashboard.jsx`                  |
| `<header>` / `<footer>` | Heading block / action row of a card or form          | `CreateAccountForm.jsx`                            |
| `<aside>`               | Tangential or dismissible side content                | `ApplicationNotice.jsx`                            |
| `<form>`                | Anything submitted — always with `onSubmit`           | Auth forms, add/edit modals                        |
| `<label>`               | Every form control, always                            | `Input`, `Select`, `SegmentedControl`              |
| `<table>`               | Real tabular data only                                | `LeadsPerClient.jsx`                               |
| `<div>`                 | Pure layout                                           | Avatar+name rows, overlay backdrops                |

**Headings follow a real hierarchy, never chosen for size:** `h1` page title (one per page, inside
the `*Heading` component) → `h2` card / modal title → `h3` section inside a card.
Body text is `<p>`, inline text is `<span>`. Never a `div` for text.

---

# 4. Components

## 4.1 When to create one

**Before creating a component, search for the name first** — the codebase already contains
duplicates, and adding another makes it worse.

- **Used in 2+ files, same meaning** → its own file in the narrowest shared scope
  (`components/shared/` if app-wide, the feature's `components/` if feature-wide).
- **Used only inside one file** → a local `const` in that file. `StatusPill` in `LeadsPerClient.jsx`
  and `getHealthColor` in `ClientTable.jsx` are used twice each, in one file, and stay there.
  Do **not** promote them "just in case".
- **Used once** → inline it. Never create a component for a single piece of markup.
- **Never split a page into components just to shorten the file.** Split on a real boundary:
  heading, filters, table, modal, a repeated row.
- **Extend an existing shared component before creating a variant of it.** Add a prop — never
  `Input2` or `PrimaryButton`.

Same markup ≠ same component. Share when the **meaning** is the same; two things that merely look
alike today will drift apart tomorrow.

## 4.2 What already exists — use it, don't rebuild it

**`components/shared/`** — small primitives:
`Button` · `Input` · `Select` · `Card` · `Badge` · `Avatar` · `Dropdown` · `ProgressBar` ·
`FileUpload` · `SegmentedControl` · `Toggle` · `Table` · `Breadcrumb`

**`components/modals/`** — cross-module modals: `DeleteModal` · `MakeRequestModal`

**`components/global/`** — larger components shared by 2+ modules. Put a component here when it
outgrows "primitive" but is still used from more than one module.

A raw `<button>` is acceptable only for a small icon-only control inside another component
(a modal's X). Everything else uses the shared primitive.

**Promotion path:** a component starts in its module's `components/`. The moment a second module
needs it, move it up — to `components/shared/` if it's a primitive, `components/global/` otherwise —
and delete the copy. Never copy a component into a second module.

## 4.3 Props

```jsx
const ComponentName = ({ heading, items = [], className = "", onAction }) => {
  …
  return ( … );
};

export default ComponentName;
```

- Arrow function assigned to a `const`; `export default` on the last line.
- **Destructure props in the signature with defaults.** Never `props.x`.
- **One prop = one meaning.** Never make a prop do two jobs — `variant` controls appearance,
  `type` is the HTML button type. (See §7.1: `Button` currently violates this.)
- **Call optional callbacks with `?.`** — `onAddModerator?.(formData)`.
- **Every reusable component accepts `className`** for its outer element.
- **Spread `...rest` onto the underlying native element** in form primitives, so `name`, `value`,
  `required`, `disabled`, `min` pass through without new props.
- The component owns its internal structure; the **caller owns its outer spacing**. Never bake
  `mt-*` into a shared component.

## 4.4 The page composition every page follows

```jsx
const Feature = () => {
  const [filters, setFilters] = useState(initialFilters);
  const options = [...new Set(rows.map((row) => row.field))]; // will come from backend later
  const filteredRows = rows.filter(/* … */);

  return (
    <article className="flex flex-col gap-4">
      <FeatureHeading heading="…" subheading="…" />
      <FeatureFilter filters={filters} setFilters={setFilters} options={options} />
      <FeatureTable rows={filteredRows} />
    </article>
  );
};
```

---

# 5. File layout and size

**Every file reads top to bottom in the same order:**

```
1. imports
2. module constants (STATUS_STYLES, ROLES, initialFilters, tableStyles)
3. local helpers (getHealthColor, StatusPill)
4. the component
5. export default
```

- **Keep components under ~150 lines.** Past that, something inside wants to be extracted.
- **Big configuration objects live above the component, not inside it.** A `columns` array for
  `DataTable` goes in a `buildColumns({ onEdit, onView, onDelete })` function above the component —
  or its own file when it exceeds ~60 lines. A component body should read as _logic + JSX_, not as
  a wall of config.
- Module constants sit outside the component so they aren't rebuilt on every render.

---

# 6. State and data flow

## 6.1 App state — Redux Toolkit only

- **Shared/app-wide state lives in `src/store/` using Redux Toolkit.**
- **Do not add React Context providers.** `src/context/` is being removed — see §11.
- `useState` stays the right tool for state that belongs to a single component or page:
  filters, form values, which modal is open, expand/collapse.

## 6.2 Page and component state

- **The page owns the state.** It passes `filters` + `setFilters` down to the filter component, and
  the already-filtered list down to the table.
- **Derive during render. Never mirror derived data into state, never `useEffect` to sync it.**
  `filteredModerators`, `stages`, `scores`, `visibleMembers` are plain `const`s in the render body.
- Option lists come from the data: `[...new Set(rows.map(...))]`, marked
  `// these lists will come from the backend later`.
- **Updates are immutable and use the functional form:**
  `setItems((prev) => prev.map(…))`, `setFilters((prev) => ({ ...prev, [name]: value }))`.
- **One change handler per form**, reading `e.target.name` / `e.target.value` — not one per field.
  `Select` deliberately emits a synthetic `{ target: { name, value } }` so it works with the same
  handler as a native input. Keep that contract for any new control.
- `useEffect` is for real side effects only. Always guard, then clean up exactly what you added:

```jsx
useEffect(() => {
  if (!open) return;
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [open]);
```

- **No `console.log` or `alert()` in committed code.**

---

# 7. Styling

## 7.1 Variants, not `!` overrides

**A `!` in a call-site className is a smell, not a technique.** It means the shared component's
defaults are wrong. Fix the component.

```jsx
// ❌ fighting the component's baked-in padding
<Button className="w-full py-0! px-0! rounded-none!" textClassName="flex px-3 py-2 …" />

// ✅ the component offers the variant
<Button variant="menu-item">Edit</Button>
```

Note: writing a class later in the string does **not** override an earlier one — Tailwind decides by
CSS source order. That is exactly why `!` spread through this codebase. The fix is variants, not
longer class strings.

### The `Button` variant vocabulary

`Button` takes a **`variant`** for appearance. `type` goes back to meaning only what HTML means by it:
`button` (default), `submit`, or `reset`.

| variant | What it is | Owns |
|---|---|---|
| `primary` *(default)* | Filled orange CTA | `bg-(--color-primary) text-white` |
| `bare` | No fill — the caller styles it | nothing |
| `menuTrigger` | The `⋯` button that opens a `Dropdown` | its own padding + width |
| `menuItem` | A row inside a `Dropdown` | row padding, hover, text style |
| `menuItemDanger` | A destructive row inside a `Dropdown` | `menuItem` + top border + red text |

Five variants, covering 20 of the 35 current call sites. The rest — modal close buttons, the
quick-action tiles, the "View all" link — stay `bare` plus a `className`, because they are genuinely
one-offs. **Do not add a variant for a look that appears once.**

```jsx
const BASE = "inline-flex items-center justify-center py-4 gap-2 rounded-xl cursor-pointer";

const VARIANT_CLASSES = {
  primary: "bg-(--color-primary) text-white",
  bare: "",
  menuTrigger: "w-full py-2! px-3!",
  menuItem: "w-full py-0! px-0!",
  menuItemDanger: "w-full py-0! px-0! border-t border-gray-300 rounded-none!",
};

const VARIANT_TEXT_CLASSES = {
  menuItem:
    "flex w-full px-3 py-2 items-center h-full gap-2 text-sm text-gray-700 transition hover:bg-gray-100",
  menuItemDanger:
    "flex w-full px-3 py-2 items-center h-full gap-2 text-left text-sm text-red-600 transition hover:bg-red-50",
};
```

### Migrating without changing a single pixel

Do it in **two passes**, never one.

**Pass 1 — mechanical, provably zero-change.** Rename `type="icon"` → `variant="bare"` at all 33
sites and make `type` a real HTML type. Nothing else moves: `BASE` keeps its `py-4`, so every
existing `py-0!` / `py-2!` override lands exactly as it does today. This pass alone fixes the
form-submit bug, and the computed class string is identical apart from the stray literal `"false"`
that the old `&&` expression appended — a class that matches no CSS rule.

**Pass 2 — one variant at a time, screenshot after each.** Replace the repeated `className` +
`textClassName` pairs with `menuTrigger`, `menuItem`, `menuItemDanger`. Each variant must reproduce
the call site's computed classes exactly; take the current string as the source of truth, not what
it "should" be.

Two things you will notice while doing this — both safe, both deliberate:
- `item-center` in the current strings is a **typo** for `items-center` and generates no CSS.
  Fixing it changes nothing visually. Fix it in Pass 2, not Pass 1.
- Some strings carry a class twice (`text-sm`, `transition`) or carry both `text-gray-700` and
  `text-red-600`. Preserve the winner as it renders **today**; do not "tidy" a conflict, because
  which one wins is decided by Tailwind's output order, not by the string.

Only after Pass 2 may `BASE` drop `py-4` — and only once no caller relies on it. Three call sites
(`NotificationBell`, `AuthCreateAccountForm`, `ConsultantCard`) pass **no** `className` at all and
depend on that `py-4` for their height.

## 7.2 Everything else

- **Tailwind utilities only.** No CSS modules, no styled-components. New global CSS only for a design
  token or keyframe in `src/index.css`.
- **Use the design tokens in `src/index.css` instead of raw colors:**
  - text — `text-tertiary` (headings), `text-secondary`, `text-muted`, `text-primary`, `text-remove`,
    `text-cancel`, `text-info`
  - type — `heading-xl`, `heading-lg`, `card-heading`, `card-subheading`
  - surface / border — `bg-muted`, `bg-active`, `bg-moderator`, `color-border`, `border-cancel`
  - Use a raw gray or hex only when no token fits. If it recurs, add a token.
- **Inline `style` only for values that come from data** — `style={{ color: card.valueColor }}`,
  ``style={{ width: `${value}%` }}``. Never for static styling.
- **Mobile-first**: base → `sm:` → `md:` → `lg:` → `xl:`.
- **Shape language**: `rounded-xl` for controls and inner boxes, `rounded-2xl` for cards and modals,
  `rounded-full` for pills, dots, avatars.
- **Overflow safety**: `min-w-0` on flex children holding text, `truncate` on that text, `shrink-0`
  on icons, avatars, badges, pills.
- **Variant styles go in a lookup map at the top of the file, with a fallback** — never a ternary chain:

```jsx
const STATUS_STYLES = {
  Active: { pill: "bg-green-50 text-green-700", dot: "bg-green-500" },
  Pending: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Inactive: { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

const { pill, dot } = STATUS_STYLES[row.status] ?? STATUS_STYLES.Inactive;
```

---

# 8. Modals

- **First line:** `if (!isOpen) return null;`
- **Props contract:** `isOpen`, `onClose`, `onSubmit` (or `onConfirm`), `initialData`, `mode`.
- **One component handles add and edit**, switched by `mode === "edit"` — not two components.
- **The trigger owns the open state.** `ModeratorHeading` holds `isModalOpen`, renders the modal,
  and calls the parent's `onAddModerator` on submit.
- **For row actions, store the row and derive open state:**
  `const [memberToRemove, setMemberToRemove] = useState(null)` → `isOpen={Boolean(memberToRemove)}`.
- **Reuse `DeleteModal`** for every destructive confirmation. Never hand-roll a confirm dialog.
- Overlay is always `fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4`;
  panel is `w-full max-w-<n> rounded-2xl bg-white p-6 shadow-xl`.

---

# 9. Accessibility

- Every input has a `<label>` — the shared form components handle this, so use them.
- **Set `type` on every button**; `type="button"` unless it submits. An invalid `type` makes the
  browser fall back to `submit`, which silently submits the surrounding form.
- Icon-only buttons get `aria-label`.
- Custom widgets carry their ARIA. `Select` uses `aria-haspopup`, `aria-expanded`, `role="listbox"`,
  `role="option"`, `aria-selected` — match this for any new custom control.
- Decorative images get `alt=""`; meaningful images get real alt text.
- Dismissible overlays close on **both** click-outside and `Escape`.
- Motion respects `prefers-reduced-motion`.

---

# 10. Comments and imports

- **Section markers in longer JSX only** — `{/* Heading */}`, `{/* Actions */}`. Skip them in short
  components; they are navigation aids, not decoration.
- **Explain the non-obvious, never the obvious.** Good examples already in the code:
  `// Emits an event-like object so callers can keep using e.target.name/value`,
  `// these lists will come from the backend later`.
- No commented-out code.
- **Import order:** `react` → `react-router-dom` → third-party (`lucide-react`, `@tanstack/*`) →
  `components/shared` + `components/modals` → local `./components/*` → data / utils / assets.
- Relative paths only — no aliases are configured. No barrel (`index.js`) files.
- Icons come from `lucide-react` with an explicit size: `<Plus size={18} />`.

---

# 11. Known deviations — fix these when you touch the file

The rules above describe the target. These are the places that don't meet it yet.
Do not copy these patterns; correct them when you're already in the file.

**Structure**

- `src/context/` still exists (`NotificationsContext`) and is used by `Dashboard.jsx`,
  `NotificationBell.jsx` and `Notifications`. Move it into `src/store/` as an RTK slice, then delete
  the folder. `src/store/store.js` is currently empty and `@reduxjs/toolkit` is not yet installed.
- No `components/global/` folder exists yet — create it when the first cross-module component
  outgrows `components/shared/`.
- Modals still live in module `components/` folders. Move module-only modals into the module's
  `modals/` folder: `moderators/components/AddEditModeratorModal.jsx` → `moderators/modals/ModeratorAddEditModal.jsx`.
- Static data sits in three different places — `dashboard/data/activityData.js`,
  `client-management/components/clientsData.js`, `pipeline/components/pipelineApplicants.js`.
  All should be `<module>/utils/data.js`.
- `client/franchisee/component/` is singular — rename to `components/`.
- Several pages hold their mock data inline in the page file (`AdminDashboard.jsx`, `Moderators.jsx`,
  `FDD.jsx`). Move it to the module's `utils/data.js`.

**Duplication** — 19 file pairs are byte-identical:

- `admin/messages/**` and `client/messages/**` — the entire tree, including `Messages.jsx`
- `admin/pipeline/components/scorecard/**` and `user/dashboard/components/scorecard/**`
- `admin/fdd/components/FddTable.jsx` and `client/fdd/components/ClientFddTable.jsx`
  → Move to `components/global/` and delete the copies.

**Naming**

- `client/**` uses `Client*` role prefixes throughout (`ClientModeratorTable`, `ClientFddHeading`) — drop them.
- `admin/pipeline/components/` mixes four conventions: `FranchisePipelineFilter`,
  `PipelineStageOverview`, `AdminPipelineStageOverview`, `StatsCard`.
- `AdminInlineLocationMap.jsx` and `AdminLocationAssignModal.jsx` sit inside `user/dashboard/`.
- Auth components are missing the module prefix: `BackLink`, `FormSection`, `ApplicationNotice`,
  `ApplicationFields`, `LocationAssign` → `AuthBackLink`, `AuthFormSection`, …
- `notifications/Notification.jsx` — should be `Notifications.jsx`.
- Two different `StatsCard.jsx` with different props (`comparison` vs `Badge`).
- `PipelineStageOverview` and `AdminPipelineStageOverview` in the same folder.

**Styling**

- 55 `!` overrides at call sites and 33 `type="icon"` props — both resolved by §7.1.
- `CreateAccountForm.jsx` has a `type="icon"` button inside a `<form>`, so "Back to Login"
  submits the form as well as navigating.

**Size**

- `public/auth/components/LocationAssign.jsx` is 1187 lines.
- `ModeratorTable.jsx` / `ClientTable.jsx` hold ~110-line `columns` arrays inside the component body.
- `console.log` in `admin/fdd/FDD.jsx`; `alert()` in `AdminPipelineStageOverview.jsx`.

---

# 12. Before you finish

- [ ] File is in the right folder per the §1.2 table (one module vs 2+)
- [ ] Filename carries the module prefix and no role prefix (§1.3)
- [ ] Searched for the component name — it doesn't already exist
- [ ] Removed every wrapper not carrying a layout class or a meaning
- [ ] Heading levels descend properly, never picked for font size
- [ ] Derived values computed in render, not stored in state
- [ ] No `!` in a call-site className; no `console.log`
- [ ] `type` set on every button; `aria-label` on icon-only buttons
- [ ] `min-w-0` + `truncate` + `shrink-0` where text can overflow
- [ ] Component under ~150 lines, big config lifted above it
- [ ] `npm run lint` passes
