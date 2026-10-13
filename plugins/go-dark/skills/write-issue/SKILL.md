---
name: write-issue
description: Use when creating or drafting a GitHub issue, turning a bug, idea, request or audit finding into an issue, or checking whether an existing issue is ready to plan or build from.
---

# Write an issue

## Overview

An issue is a specification. Someone who has never seen the conversation must
be able to plan or build from it without guessing: the problem is concrete,
every decision says who made it and when, the scope is stated, and "done" can
be measured.

## Before writing

1. Read the project's context: `CLAUDE.md`, its constraints and decision
   records, the issue templates, and two or three recent issues. Match their
   labels and voice.
2. Gather facts from the code, not memory: the file and line of a bug, the
   numbers (sizes, timings, counts), the decision records that apply.
3. Put the product questions only the owner can answer to them — with
   two to four options, the recommended one first (in Claude Code, the
   AskUserQuestion tool) — before writing.

## The title

A plain sentence naming the outcome and its key constraint:
"Let people attach photos, audio, video and documents in messages, with a size
limit per media type". A bug names the symptom and the fix: "The landing page
search does nothing — make search work".

## The body, in this order

Use the sections that apply; never leave an empty one.

1. **Summary** — the real problem: who tries what, what happens, why it
   matters. A bug names the exact file and line; a technical issue gives
   numbers ("first-load JS grew 172.96 → 177.25 kB gzip").
2. **Why it happens** — technical issues only: the root cause, citing the
   decision record behind it.
3. **What to build** — checkboxes grouped by layer (Data, Enforcement, UI,
   Housekeeping). Each item concrete and testable. Specifications as tables.
   Rejected options carry their reason ("PDF only: Office files can carry
   macros").
4. **Decide first** — open questions as unticked boxes. Once settled, rename
   the section **Decided (name, YYYY-MM-DD)** and tick each with its answer.
5. **Verify / Done when** — measurable acceptance: exact numbers, exact
   behaviour, named tests, and a check on staging.
6. **Not in this ticket** — what is out of scope, and the issue that covers it.
7. **Docs** — which reference documents must change.
8. **Notes** — where it came from ("raised in #41's audit"), timing.
9. **How to ship** — a pull request into the default branch through its
   template, with its checks passing; link the guide.

## What every issue respects

- The project's real limits (users' devices and data, hosting memory, privacy
  law, schedulers that run late), named and linked.
- Rules enforced by the server and storage, never only the browser.
- Failure designed for: "decided when the file is read, whatever any job has
  done"; a designed empty state, never a bare "no results".
- Exact copy for anything people will read ("This video expired on 12 Nov
  2026").
- Absolute dates. Decision records, guides and other issues linked by number.

## Before publishing

Show the draft and ask before creating it on GitHub: creating an issue is
outward-facing. Create it with `gh issue create --title … --body-file …` and
the matching labels.
