# AGENT.override.md

This file overrides and extends the root `AGENT.md` for the frontend only.

## Scope
Applies to everything inside `frontend/`.

---

## Frontend stack
The frontend is:
- React
- TypeScript
- shadcn/ui

Specific architecture, folder structure, data-fetching, and frontend conventions are defined through Obsidian documentation and must be fetched through the `obsidian-vault` MCP server before doing frontend work.

---

## Mandatory first step
Before any frontend coding task:
1. Query `obsidian-vault`
2. Fetch the latest frontend-relevant rules
3. Follow those rules before editing code

This is required, not optional.

Relevant topics include:
- React conventions
- frontend architecture
- component structure
- routing patterns
- state/data-fetching patterns
- styling conventions
- form handling
- testing expectations
- accessibility rules
- API client patterns

Do not guess when the Obsidian docs define the project pattern.

### Required frontend agent workflow
For non-trivial frontend tasks, use:
- `obsidian-researcher` to fetch the latest relevant project guidance and conventions before implementation
- `frontend-worker` for frontend implementation
- `reviewer` for correctness, security, and test coverage review

Skip this only for trivial edits such as small renames, comments, or narrowly scoped mechanical changes.

Keep ownership clear across agents:
- `obsidian-researcher` is read-only
- `frontend-worker` owns frontend code changes
- `reviewer` reviews for correctness, security, UI regressions, and missing tests

---

## Frontend responsibilities
The frontend is responsible for:
- rendering authenticated UX clearly
- presenting server data safely
- guiding users through workflows
- handling client state cleanly
- reflecting permission state in the UI
- building reusable UI patterns where sensible

The frontend is **not** the source of truth for:
- authorization
- business-rule enforcement
- trust decisions
- security-critical validation

That belongs to the backend.

---

## Frontend implementation rules

### Architecture
- Follow the frontend architecture defined in Obsidian docs.
- Respect the documented folder/component/hook structure.
- Do not introduce a second architecture inside the same app.
- Keep page composition, view logic, and reusable UI concerns cleanly separated where the documented patterns expect that.

### TypeScript
- Use TypeScript properly and keep types explicit where it matters.
- Avoid loose typing where project conventions expect stronger typing.
- Keep client-side contracts aligned with backend responses.

### shadcn/ui usage
- Prefer consistent use of shadcn/ui components and patterns where appropriate.
- Do not build random one-off UI patterns when a shared shadcn-based pattern already exists or should exist.
- Extend UI consistently rather than fragmenting the design language.

### Components
- Keep components focused and readable.
- Avoid giant page components that do everything.
- Extract reusable UI or hooks when the reuse is real.
- Do not hide core business logic in presentation components.

### Auth-aware UX
- Assume the product is private and authenticated by default.
- Handle loading, empty, error, and unauthorized states clearly.
- Do not show controls that imply permissions the backend may reject.
- Reflect permission state in the UI, but do not treat it as enforcement.

### Forms and user actions
For things like requests, ratings, reviews, and uploads:
- validate input consistently
- show useful errors
- avoid accidental duplicate submissions
- keep mutation flows resilient
- follow the documented project approach for forms and mutations

### Data fetching and API usage
- Follow the documented project pattern for API calls and server-state handling.
- Avoid ad hoc fetch logic scattered across components.
- Keep loading and stale-state handling intentional.
- Do not hardcode backend assumptions in random places.

### Accessibility and usability
- Use semantic HTML where possible.
- Keep keyboard access intact.
- Label controls properly.
- Make errors understandable.
- Avoid inaccessible custom controls unless necessary.

### Client-side security mindset
- Never put secrets in client code.
- Never rely on frontend checks as real security.
- Be careful with user-generated content and media rendering.
- Avoid unsafe HTML rendering unless explicitly required and properly handled.
- Treat URLs, uploads, and embedded media carefully.

---

## Reuse guidance
This product is likely to reuse UI patterns across:
- games
- movies
- ratings
- reviews
- clips/media
- future content pages

Prefer reusable patterns when the reuse is obvious.

Do not over-abstract too early. Do not build a massive generic UI system for hypothetical future features before real reuse shows up.

Build the current feature cleanly, but avoid painting the app into a corner.

---

## Testing expectations
Frontend strictness is high.

Add or update tests when changing:
- page behavior
- component behavior
- hooks
- form flows
- auth-aware UI states
- error/loading/empty states
- reusable interactive UI

Prioritize tests for:
- critical user flows
- permission-sensitive UI
- regressions
- state handling
- meaningful reusable behavior

Do not claim frontend behavior works unless it has been validated appropriately.

---

## What to avoid
- skipping Obsidian/MCP lookup
- giant components
- inconsistent UI patterns
- random non-shadcn one-offs without reason
- duplicated data-fetching logic
- client-only “security”
- hardcoded API assumptions scattered across the app
- unnecessary dependencies
- unrelated refactors

---

## Frontend output checklist
When done, call out:
- pages/components/hooks touched
- API assumptions made
- loading/error/auth states handled
- tests added or updated
- anything the backend must support for the UI to work
