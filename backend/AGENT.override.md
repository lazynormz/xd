# AGENT.override.md

This file overrides and extends the root `AGENT.md` for the backend only.

## Scope
Applies to everything inside `backend/`.

---

## Backend stack
The backend is:
- ASP.NET Core 10 Web API
- EF Core
- SQLite currently
- planned future migration to PostgreSQL

Specific architectural and coding patterns are defined through Obsidian documentation and must be fetched through the `obsidian-vault` MCP server before doing backend work.

---

## Mandatory first step
Before any backend coding task:
1. Query `obsidian-vault`
2. Fetch the latest backend-relevant rules
3. Follow those rules before editing code

This is required, not optional.

Relevant topics include:
- backend architecture patterns
- code organization
- endpoint patterns
- service/domain patterns
- EF Core guidance
- database migration guidance
- testing rules
- auth and permission rules
- naming and folder conventions

Do not invent backend patterns if the Obsidian docs define them.

### Required backend agent workflow
For non-trivial backend tasks, use:
- `obsidian-researcher` to fetch the latest relevant project guidance and conventions before implementation
- `backend-worker` for backend implementation
- `reviewer` for correctness, security, and test coverage review

Skip this only for trivial edits such as small renames, comments, or narrowly scoped mechanical changes.

Keep ownership clear across agents:
- `obsidian-researcher` is read-only
- `backend-worker` owns backend code changes
- `reviewer` reviews for correctness, security, contract drift, and missing tests

---

## Backend responsibilities
The backend is the source of truth for:
- authentication
- authorization
- validation
- business logic
- persistence
- data integrity
- security-sensitive enforcement
- API contracts

Do not move real enforcement into the frontend.

---

## Backend implementation rules

### Architecture
- Follow the backend architecture defined in Obsidian docs.
- Keep transport concerns separate from domain or application behavior.
- Do not place core business logic directly in controllers/endpoints unless the documented architecture explicitly says to.
- Keep responsibilities clear and localized.

### Endpoints and contracts
- Keep request and response contracts explicit.
- Do not leak internal-only fields.
- Do not expose secrets, internal flags, or sensitive metadata.
- Avoid casual breaking API changes.

### Auth and permissions
- Every endpoint and mutation must be evaluated for auth and permission impact.
- Check who can access what, under which conditions.
- Do not trust the client to determine access.
- Backend permission enforcement is mandatory.

### Validation
- Validate incoming data consistently using the project’s documented backend approach.
- Reject invalid or inconsistent input early.
- Be explicit with nullable fields, required data, and invalid state transitions.

### EF Core and database usage
- Follow documented EF Core patterns from Obsidian.
- Keep queries intentional and readable.
- Avoid accidental overfetching and N+1 patterns.
- Only load the data actually needed.
- Be mindful of performance for list endpoints and common queries.

### SQLite now, PostgreSQL later
The current database is SQLite, but the design should not get trapped there.

When making database-related changes:
- prefer portable EF Core usage where practical
- avoid SQLite-only assumptions unless unavoidable
- think about future PostgreSQL migration
- be careful with type choices, SQL-specific behavior, and migration patterns

### Migrations and schema changes
- Keep migrations reviewable.
- Avoid destructive changes unless clearly required.
- Think about defaults, nullability, indexing, and future compatibility.
- Do not introduce schema changes casually.

### Logging and errors
- Log enough to debug, but never leak secrets or private data.
- Fail safely.
- Return useful errors without overexposing internals.
- Do not swallow exceptions silently.

---

## Reuse guidance
The platform may support recurring concepts like:
- requests
- ratings
- reviews
- media attachments
- ownership and visibility rules

Prefer reusable patterns when the reuse is obvious.

Do not over-engineer “super generic” backend models before the actual need is present.

Build the current feature cleanly while keeping future games/movies/clips expansion in mind.

---

## Testing expectations
Backend strictness is high.

Add or update tests when changing:
- endpoint behavior
- business logic
- validation
- auth/permission behavior
- serialization or contracts
- database behavior where appropriate

Prioritize tests for:
- authorization paths
- invalid input
- edge cases
- regressions
- state transitions
- data integrity

Do not claim backend behavior works unless it has been validated appropriately.

---

## What to avoid
- skipping Obsidian/MCP lookup
- fat controllers
- scattered permission logic
- business logic mixed into the wrong layer
- backend shaped only around one frontend screen
- silent contract drift
- SQLite-only design decisions that make PostgreSQL migration harder
- unnecessary dependencies
- unrelated refactors

---

## Backend output checklist
When done, call out:
- files/endpoints/services touched
- auth or permission implications
- contract changes
- migration or schema impact
- tests added or updated
- any SQLite/PostgreSQL compatibility considerations
