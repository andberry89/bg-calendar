# Backlog

## Active (Ready / In Progress)

- [ ] (none)

---

## Planned (Not Started)

- [ ] CAL-014 Codebase audit and refactor plan
  - type: refactor
  - priority: P1
  - scope: large
  - notes:
    - Full audit of codebase
    - Identify composables, utils, and component extraction opportunities
    - Review CalendarBody → CalendarDay → CalendarEvent flow
    - Produce actionable follow-up tasks
- [ ] CAL-015 Component responsibility audit
  - type: refactor
    - priority: P1
    - scope: medium
    - notes:
      - Review component size/responsibility
      - Focus on large components like CalendarBody.vue
      - Identify safe extraction opportunities
- [ ] CAL-018 Code comments and documentation pass
  - type: refactor
  - priority: P2
  - scope: medium
  - notes:
    - Add high-value comments (intent, edge cases)
    - Avoid redundant comments
- [ ] CAL-019 File and folder organization review
  - type: refactor
  - priority: P2
  - scope: medium
  - notes:
    - Improve structure and grouping
    - Plan before restructuring
- [ ] CAL-020 README documentation
  - type: docs
  - priority: P1
  - scope: medium
  - notes:
    - Project overview, architecture, setup, workflows
- [ ] CAL-023 Automatic holiday and birthday event generation
  - type: feature
  - priority: P2
  - scope: medium
  - notes:
    - Add a system for automatically creating holiday events
    - Add support for automatically creating birthday events
    - Define whether these are seeded, recurring, or generated at render time
    - Keep behavior configurable so auto-generated events can be distinguished from manual events
    - Avoid changing layout/lane behavior unless required
- [ ] CAL-025 Audit click-outside directive usage
- [ ] CAL-026 Calendar type organization review
  - type: refactor
  - priority: P2
  - scope: medium
  - notes:
    - Evaluate whether `types/calendar.ts` should remain a single file
    - Identify safe split points for event, assignment, modal, and form-related types
    - Decide whether barrel exports are appropriate for types
    - Avoid churn unless organization clearly improves maintainability and import clarity
    - Keep aligned with existing architecture and incremental refactor rules

- [ ] CAL-017 Types robustness follow-ups
  - type: refactor
  - priority: P1
  - scope: large (split into sub-tasks)
  - notes:
    - Derived from completed audit pass
    - Split into smaller implementation tasks:

---

## Icebox (Future Ideas)

- [ ] <TASK-ID> <idea>

---

## Completed

- [x] CAL-013 Utils barrel exports
  - PR: refactor(utils): add calendar utils barrel exports and standardize imports

- [x] CAL-021 Improve disabled form section visibility
  - PR: feat(events): improve event form field visibility by type

- [x] CAL-022 Indicate multi-staff membership on spanning calendar events
  - PR: feat(events): add multi-staff indicator to event pills

- [x] CAL-024 Revisit event form field rules alignment
  - PR: refactor(events): align event form field visibility with event type config

- [x] CAL-017 Types robustness audit
  - PR: refactor(types): audit calendar type system and define follow-up tasks

- [x] **CAL-017A — Lane slot type tightening**
  - PR: refactor(types): tighten calendar event lane slot typing

- [x] **CAL-017B — Draft vs saved event boundary**
  - PR: refactor(events): remove derived class from draft event state

- [x] **CAL-017C — Event identity audit**
  - PR: refactor(events): rely on event id for calendar event identity

- [x] **CAL-017D — Date typing audit**
  - PR: refactor(types): clarify calendar event date string contract

- [x] **CAL-017E — Local state/type cleanup**
  - PR: refactor(events): remove non-null assertion in CalendarDay modal
