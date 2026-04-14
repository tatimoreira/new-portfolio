---
date: 2026-04-14
---
# 普通话 — Building a Mandarin Vocabulary Catalog for My Daughter

## The Why

In my first few months postpartum, I felt that familiar feeling many of us have: that we're not doing much more than breastfeeding and caring for the baby. Being a restless person, I decided to start an experiment: speaking to my daughter in Mandarin, a language I've been studying for over 10 years.

I began watching videos on how to foster bilingualism in babies at [mssiugi](https://www.youtube.com/@mssiugi/videos) and started writing a Google Doc to help me remember useful phrases. Things like *"you have mud on your knees"*, *"don't pick your nose"*, *"let's water the flowers"*. Real, situational language for a toddler's world. Phrases I could actually use at the playground, at bedtime, during a meltdown. 

The doc worked as a collection tool but was terrible for reference while teaching. I couldn't search it mid-conversation, it had no structure that matched how I actually use the vocabulary, and I had a growing list of phrases I needed to look up and hadn't researched yet.

So I built an app.

## Why It Lives in My Portfolio

I could have built this as a private, offline tool. A notes app would have done the job technically. But there's something meaningful about building real, functional software for a real personal need — and putting it on display.

A todo app demonstrates CRUD. This demonstrates the same fundamentals but with a story attached: a parent learning a language to be more present with her child. 

It also showcases decisions I'm proud of: a research queue that promotes entries to the catalog, an accordion UI to handle 36 categories without overwhelming the user, a PWA manifest so it works from my phone's home screen during an actual lesson. These are product decisions, not just technical ones.

## The Architecture

### Data storage: Turso (libsql)

The app is deployed on Vercel, which means no persistent filesystem. Local SQLite would reset on every deploy. The options were a hosted Postgres (Neon, Railway) or a hosted SQLite-compatible database.

I chose **Turso** — it's a distributed SQLite platform, free tier is generous, and the schema needed zero changes from the local SQLite I was already using during development. The whole migration was a connection string swap.

One thing worth documenting: the Prisma adapter for libsql (`@prisma/adapter-libsql`) was unreliable in this serverless context. After several failed deployments with HTTP 400 errors from the adapter layer, I bypassed Prisma entirely for the vocab queries and went directly to `@libsql/client` with raw SQL. The rest of the app (blog, etc.) still uses Prisma — just not these routes. Sometimes the pragmatic move is the right move.

### Schema

Three models:

**VocabCategory** — a named group with an emoji. *Greetings, Animals, Bedtime, Emotions*.

**VocabEntry** — the actual vocabulary. Hanzi, pinyin, Spanish translation, optional notes, and a foreign key to the category.

**VocabQueue** — phrases I need to research. Just a description and optional context (*"bedtime"*, *"at the park"*). When I look one up, I "complete" it: fill in the hanzi/pinyin/translation, assign a category, and it moves to the catalog. The queue item is deleted.

### Importing from the txt file

I had 161 entries spread across a messy document with inconsistent formatting. Rather than entering them manually, I wrote a one-time parser (`prisma/seed-mandarin.ts`) that reads the file, detects category headers versus entry blocks by analyzing Chinese character ranges, pinyin tone marks, and text length heuristics, and inserts everything into the database.

It's not perfect — some categories parsed ambiguously and needed cleanup in the UI — but it got me from zero to 161 entries in seconds instead of hours.

### The PWA

Adding `manifest.json` and a handful of `<meta>` tags is all it takes to make a web app installable on a phone's home screen. The app now shows up in my dock next to my other apps, opens without a browser chrome, and has the portfolio's mauve pink as the status bar color. When I'm at the playground and my daughter points at something, I can open it in one tap.

## UI Decisions

**Accordion categories.** With 36 categories and 161 entries the naive list is unscrollable. Categories start collapsed. Click to expand. Search auto-expands matching categories and filters in real time — hanzi, pinyin, and English all searchable from one input.

**Click to edit.** No separate edit page. Click a category name or an entry row and it expands into an inline form. Save or cancel. The URL tracks state via query params so nothing gets lost on a page transition.

**The research queue.** This is the feature I'm most happy with conceptually. When I'm mid-lesson and think *"how do I say 'be careful, that's sharp'?"* I jot it into the queue with a tap. Later I research it, fill in the translation, and complete it. It moves to the catalog. The friction of not knowing something in the moment doesn't interrupt the lesson.

**Reusable components.** `PillButton`, `VocabInput`, `InlineFormCard` — small atoms extracted from the repetitive patterns across the catalog and queue views. Both routes look consistent without duplicating styles.

## Next Steps

**Audio.** The most important thing missing. Reading pinyin and characters is useful for me, but hearing the correct pronunciation is what actually sticks — for her and for me. I want to add the ability to record myself saying each phrase. My voice, not a text-to-speech API, because she needs to recognize *how I say it*, not how a computer does.

**Flashcard mode.** A simple study interface — show the hanzi, ask for the translation, flip to reveal. Spaced repetition would be ideal eventually, but even a random shuffle through a category would be useful for drilling before a lesson.

**Print view.** A clean printable layout per category for offline reference or for grandparents who want to learn alongside her.

**Better category management.** Right now categories can't be merged or reordered. Some parsed ambiguously from the import (hello, "twist" with 23 entries). A drag-to-reorder and a merge-categories action would clean that up.

---

The app is live at [tatimoreira.me/mandarin](https://tatimoreira.me/mandarin). The code is the same codebase as this portfolio — same Remix app, same Vercel deployment, one more route.

She's almost three now. She speaks more Mandarin than I do now. We're doing alright.
