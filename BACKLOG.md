# Backlog

## Active (Ready / In Progress)

- [ ] (none)

---

## Planned (Not Started)

- [ ] CAL-010 Centralize event-type color system
  - type: refactor
  - priority: P2
  - scope: medium
  - notes:
    - Event-type colors are only partially centralized today
    - Move remaining color logic into shared tokens

- [ ] CAL-013 Utils barrel exports
  - type: refactor
  - priority: P3
  - scope: small
  - notes:
    - Add barrel exports for `@/features/calendar/utils`
    - Standardize imports across components
    - Dedicated cleanup pass

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

- [ ] CAL-017 Types robustness review
  - type: refactor
  - priority: P2
  - scope: medium
  - notes:
    - Improve type structure and safety
    - Remove weak or redundant typing patterns

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

- [ ] CAL-021 Improve disabled form section visibility
  - type: UX
  - priority: P2
  - scope: small
  - notes:
    - Hide form sections when not relevant to selected event type
    - Avoid showing disabled fields that feel broken

- [ ] CAL-022 Indicate multi-staff membership on spanning calendar events
  - type: UX
  - priority: P2
  - scope: small
  - notes:
    - Add visual cue for events with multiple staff
    - Keep it compact and non-cluttered

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

---

## Icebox (Future Ideas)

- [ ] <TASK-ID> <idea>

---

## Completed

- [x] CAL-001 Cross-year event display bug
  - PR: fix/cross-year-event-display

- [x] CAL-002 Staff gradient identity system
  - PR: refactor(identity): stabilize staff gradient assignment across calendar views

- [x] CAL-003 Avatar loading duplication
  - PR: refactor(avatars): centralize staff avatar loading

- [x] CAL-004 Event editing flow
  - PR: feat(events): add reusable event editing flow across calendar modals

- [x] CAL-005 EventModal full staff list

- [x] CAL-006 Holiday chip refinement

- [x] CAL-007 Comp Day color differentiation
  - PR: refactor(events): improve comp day color differentiation

- [x] CAL-008 Delete confirmation flow
  - PR: feat(event-modal): add styled delete confirmation state

- [x] CAL-009 Modal styling tokenization
  - PR: refactor(modals): extract BaseModal styling into shared tokens

- [x] CAL-011 Display event details in modal views
  - PR: refactor(modals): display event details in EventModal and DayModal

- [x] CAL-012 Clear expired event lanes during week layout
  - PR: fix(layout): clear expired event lanes during week layout

- [x] CAL-016 TypeScript type-check cleanup
  - PR: fix(types): resolve TypeScript errors across calendar components
