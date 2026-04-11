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

- [ ] CAL-027 Remove legacy StaffList component
  - type: refactor
  - priority: P1
  - scope: small
  - notes:
    - Verify all remaining usages of `StaffList.vue`
    - Remove `StaffList.vue` if unused
    - Replace any remaining direct avatar loading with shared avatar utility
    - Clean up unstable keys if file remains active

- [ ] CAL-028 Unify event type source of truth
  - type: refactor
  - priority: P1
  - scope: medium
  - notes:
    - Align `eventTypeConfig.ts`, `selectOptions.ts`, and filter UI usage
    - Remove hardcoded filterable type list from `CalendarHeaderFilters.vue`
    - Centralize event type ordering, selectable types, and filterable types
    - Type event option arrays against `EventType`

- [ ] CAL-029 Consolidate duplicated event modal patterns
  - type: refactor
  - priority: P1
  - scope: medium
  - notes:
    - Review duplication between `NewEventModal.vue` and `EditEventModal.vue`
    - Review duplication between `DayModal.vue` and `EventModal.vue`
    - Preserve `BaseModal` as the modal source of truth
    - Prefer shared structure/pattern cleanup over new modal abstractions

- [ ] CAL-030 Centralize event display formatting helpers
  - type: refactor
  - priority: P1
  - scope: medium
  - notes:
    - Standardize event date formatting through shared util usage
    - Review duplicated event label/display mapping across event display components
    - Reduce repeated formatting logic in `DayModal.vue` and `EventModal.vue`

- [ ] CAL-031 Standardize staff identity presentation
  - type: refactor
  - priority: P2
  - scope: medium
  - notes:
    - Review repeated avatar, fallback, and summary logic across active components
    - Keep avatar-first identity presentation consistent
    - Prefer extending shared helpers over introducing parallel display patterns

---

## Icebox (Future Ideas)

- [ ] <TASK-ID> <idea>

---

## Completed

- [x] CAL-014 Codebase audit and refactor plan
  - PR: (audit only, no code changes)

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

- [x] CAL-026 Calendar type organization review
  - PR: refactor(types): extract shared calendar layout and draft types

- [x] CAL-015 Component responsibility audit
  - PR: refactor(calendar): audit large calendar files and extract shared display logic
