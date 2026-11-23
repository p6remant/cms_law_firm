---
phase: { N }
plan: { M }
wave: { W }
depends_on: []
files_modified: []
autonomous: true
user_setup: []

must_haves:
  truths: []
  artifacts: []
---

# Plan {N}.{M}: {Descriptive Name}

<objective>
{What this plan accomplishes}

Purpose: {Why this matters}
Output: {What artifacts will be created}
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- .gsd/ARCHITECTURE.md
- {relevant source files}
</context>

<tasks>

<task type="auto">
  <name>{Clear task name}</name>
  <files>{exact/file/paths.ext}</files>
  <action>
    {Specific instructions}
    AVOID: {common mistake} because {reason}
  </action>
  <verify>{command or check}</verify>
  <done>{measurable criteria}</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] {Must-have 1}
- [ ] {Must-have 2}
</verification>

<success_criteria>

- [ ] All tasks verified
- [ ] Must-haves confirmed
      </success_criteria>
