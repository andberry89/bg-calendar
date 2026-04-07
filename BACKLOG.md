# Backlog

## Active (Ready / In Progress)

- [ ] (none)

---

## Planned (Not Started)

- [ ] CAL-014 Codebase audit and refactor plan
- [ ] CAL-015 Component responsibility audit
- [ ] CAL-018 Code comments and documentation pass
- [ ] CAL-019 File and folder organization review
- [ ] CAL-020 README documentation
- [ ] CAL-023 Automatic holiday and birthday event generation
- [ ] CAL-025 Audit click-outside directive usage

- [ ] CAL-017 Types robustness follow-ups
  - type: refactor
  - priority: P1
  - scope: large (split into sub-tasks)
  - notes:
    - Derived from completed audit pass
    - Split into smaller implementation tasks:

    **CAL-017A — Lane slot type tightening**
    - Normalize `CalendarEventLaneSlot` event shape
    - Reduce `AssignedCalendarEvent | CalendarEvent | null` unions
    - Evaluate removal of fallback slot creation in `CalendarDay.vue`

    **CAL-017B — Draft vs saved event boundary**
    - Remove derived fields (e.g. `class`) from draft state
    - Clarify ownership of `DraftCalendarEventInput`
    - Ensure form state only contains user-editable data

    **CAL-017C — Event identity audit**
    - Verify `CalendarEvent.id` is always present
    - Remove fallback key logic if no longer needed
    - Otherwise loosen type if required

    **CAL-017D — Date typing audit**
    - Evaluate `start` / `end` string assumptions
    - Consider stricter typing or documented format contract

    **CAL-017E — Local state/type cleanup**
    - Reduce non-null assertions
    - Improve component-level type narrowing

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
