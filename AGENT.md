# AGENTS.md

## Purpose
This repository contains a private, authenticated platform for a friend group.

The platform is expected to grow over time and support features such as:
- game requests and played-game ratings
- movie suggestions and ratings
- ratings and reviews for other content types
- clip/media hosting
- future authenticated community features

This project should be treated as a long-term codebase, not a throwaway prototype.

---

## Repository structure
This repository is divided into:
- `backend/`
- `frontend/`

More specific rules for each area are defined in their local `AGENTS.override.md` files.

---

## Core principles
When making changes anywhere in this repository, optimize for:

1. **Security first**
   - Treat all input as untrusted.
   - Protect private user data and private media.
   - Do not expose secrets, tokens, internal metadata, or sensitive implementation details.
   - Default to least privilege.

2. **Authenticated and private by default**
   - Assume meaningful features are for authenticated users.
   - Access control matters as much as authentication.
   - Do not assume content is public unless documentation explicitly says so.

3. **Backend as source of truth**
   - Authentication, authorization, validation, and business rules must be enforced on the backend.
   - The frontend may reflect permission state, but must never be treated as enforcement.

4. **Incremental growth**
   - The platform will expand feature-by-feature.
   - Prefer designs that allow future features without requiring major rewrites.
   - Reuse patterns when reuse is clearly likely.
   - Do not over-abstract before the need is real.

5. **Consistency over novelty**
   - Follow existing project patterns.
   - Keep code understandable and maintainable.
   - Avoid cleverness that increases long-term complexity.

---

## Mandatory MCP usage
For any and all coding tasks, the MCP server `obsidian-vault` **must always be used before doing anything else**.

Agents must fetch the latest relevant rules, conventions, and how-to guidance from `obsidian-vault` before making code changes.

This includes, where relevant:
- architecture rules
- coding conventions
- naming rules
- testing expectations
- folder and file placement rules
- workflow guidance
- feature-specific patterns
- auth/security rules
- frontend/backend implementation guidance

Do not guess when `obsidian-vault` can answer it.

If local code and fetched Obsidian documentation conflict, prefer the documented project rules unless following them would clearly introduce a security, correctness, or data-loss issue.

---

## Non-negotiables
These rules apply repo-wide unless more specific local docs strengthen them:

- Always use `obsidian-vault` MCP first before any coding task.
- Treat the Obsidian documentation fetched through MCP as the main source of truth for project conventions and patterns.
- Do not casually change authentication, authorization, or security-sensitive behavior.
- Do not add dependencies unless they are necessary and justified.
- Do not make unrelated refactors while doing feature work.
- Add or update tests when behavior changes.
- Keep diffs focused and reviewable.
- Do not hardcode secrets, credentials, tokens, or environment-specific values.
- Keep database-related changes compatible with the future move from SQLite to PostgreSQL where practical.

---

## General implementation rules

### Before changing code
- Read the relevant local context first.
- Fetch relevant rules from `obsidian-vault` first.
- Follow existing patterns unless the Obsidian docs define a better or newer pattern.
- Prefer extending existing flows over creating parallel ones.

### Security
- Never trust user input.
- Never trust client-provided ownership or permission claims.
- Be careful with uploads, media, and user-generated content.
- Prefer explicit checks over implicit assumptions.
- Avoid leaking sensitive information through logs, errors, or API responses.

### Architecture
- Keep responsibilities separated.
- Avoid putting business rules in the wrong layer.
- Avoid giant files that mix unrelated concerns.
- Prefer simple, boring, maintainable solutions.

### API and data
- Keep contracts explicit.
- Avoid casual breaking changes.
- Use stable and consistent naming.
- Think about pagination, filtering, sorting, timestamps, IDs, and nullability intentionally.

### Testing and validation
- Validate behavior before claiming it works.
- Add or update tests for meaningful behavior changes.
- Be especially careful around auth, permissions, and data integrity.
- If validation could not be run, say so clearly.

### Change hygiene
- Keep changes focused.
- Avoid side quests.
- Do not rewrite large areas without a strong reason.
- Leave the touched code cleaner than you found it.

---

## Product design guidance
This product will likely contain recurring concepts across features, such as:
- requests/submissions
- ratings
- reviews or notes
- ownership
- visibility
- media or attachments
- list/detail views
- filtering and sorting

Prefer reusable patterns when those similarities are obvious.

Do not jump straight into broad generic frameworks or over-engineered abstractions before they are justified by real usage.

---

## What to avoid
- skipping MCP/Obsidian lookup
- hidden magic
- silent breaking changes
- frontend-only permission enforcement
- unnecessary new dependencies
- unrelated refactors mixed into feature work
- code shaped around one very specific case when obvious reuse is nearby
- over-generalizing too early

---

## Output expectations
When finishing work, include:
- what changed
- which assumptions were made
- any auth/security-sensitive areas touched
- validation or tests performed
- anything still missing, risky, or blocked