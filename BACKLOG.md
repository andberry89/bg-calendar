# Backlog

## Active (Ready / In Progress)

- [ ] (none)

---

## Planned (Not Started)

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

---

## Icebox (Future Ideas)

- [ ] <TASK-ID> <idea>

---

## Completed

- [x] CAL-013 Utils barrel exports
  - PR: refactor(utils): add calendar utils barrel exports and standardize imports

- [x] CAL-014 Codebase audit and refactor plan
  - PR: (audit only, no code changes)

- [x] CAL-015 Component responsibility audit
  - PR: refactor(calendar): audit large calendar files and extract shared display logic

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

- [x] CAL-021 Improve disabled form section visibility
  - PR: feat(events): improve event form field visibility by type

- [x] CAL-022 Indicate multi-staff membership on spanning calendar events
  - PR: feat(events): add multi-staff indicator to event pills

- [x] CAL-024 Revisit event form field rules alignment
  - PR: refactor(events): align event form field visibility with event type config

- [x] CAL-026 Calendar type organization review
  - PR: refactor(types): extract shared calendar layout and draft types

- [x] CAL-027 Remove legacy StaffList component
  - PR: refactor(calendar): remove unused StaffList component

- [x] CAL-028 Unify event type source of truth
  - PR: refactor(events): use shared event type list across app

- [x] CAL-029 Consolidate duplicated event modal patterns
  - PR: refactor(modals): align event modal patterns

- [x] CAL-030 Centralize event display formatting helpers
  - PR: refactor(events): use shared date formatting in event details

- [x] CAL-031 Standardize staff identity presentation
  - PR: refactor(identity): standardize staff identity presentation across calendar

- [x] CAL-032 Clean up unstable Vue keys
  - PR: refactor(calendar): clean up remaining unstable Vue keys

- [x] CAL-033 Consolidate event display mapping
  - PR: refactor(events): consolidate shared event display mapping across calendar surfaces
