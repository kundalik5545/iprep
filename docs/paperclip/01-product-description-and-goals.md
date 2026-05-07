# iPrep Product Description And Goals For Paperclip

## What I Want To Achieve

iPrep is my company and product. I want to turn the current iPrep planning and demo work into a real, usable, publishable AI interview preparation product. The first user-facing product should help job seekers practice interviews locally, get useful feedback, and improve without needing a complex SaaS account or expensive hosted infrastructure on day one.

The immediate goal is to create a working prototype that can be installed and run through npm. Users should be able to install the package, initialize the app, start a local server, open the browser UI, run an interview practice session, and receive an analysis report.

## Instruction For Paperclip

Paperclip should use this document as goal context, not as permission to start building immediately.

Before doing any implementation, scaffolding, code changes, architecture changes, or package setup, Paperclip must ask me for the architecture details I already have in mind. I will provide those details separately. After I share my architecture, Paperclip should compare it with this goal document and then propose a build plan.

Paperclip should first ask questions like:

- What architecture do you already have in mind?
- Which parts should be local-first and which parts can become cloud later?
- Which tech stack decisions are fixed and which are open?
- What should be included in the first npm-published prototype?
- What should be deferred until after the prototype works?

Do not begin implementation until I confirm the architecture direction.

## Target User

The first target user is a job seeker in India preparing for technical, behavioral, HR, DSA, product, or system design interviews.

This user needs:

- A low-cost way to practice repeatedly.
- A guided interview flow with AI tutors.
- Feedback that is specific, structured, and actionable.
- Local-first privacy for transcripts, resumes, notes, and API keys.
- A simple install path that does not require cloud setup.

## Product Promise

iPrep should feel like a personal interview prep operating system:

- Practice interviews with AI tutors.
- Store notes, uploaded docs, transcripts, and session history.
- Analyze answers for communication, technical strength, confidence, and gaps.
- Suggest what to practice next.
- Work locally first, then unlock paid cloud convenience later.

## Phase 1 Goal: Working Prototype Published On npm

The first commercial milestone is not a perfect SaaS platform. It is a working npm-distributed prototype that proves the full loop:

1. Install with npm.
2. Run `iprep init`.
3. Run `iprep doctor`.
4. Run `iprep start`.
5. Open the local browser UI.
6. Select a package and tutor.
7. Complete a mock interview.
8. End the session.
9. Generate and view analysis.
10. Save session history locally.

This validates the product experience before spending heavily on infrastructure, ads, or team growth.

## Core Success Criteria

The prototype is successful when:

- A fresh user can install and start it in under 5 minutes.
- The app works locally from npm without manual code checkout.
- The UI covers dashboard, new interview, live session, analysis, history, files, communication, chat, and settings.
- At least one analysis provider works reliably.
- Provider status and BYOK setup are understandable.
- Session data persists locally.
- The app has enough polish to share publicly and use in demos.

## Product Principles

- Local-first before cloud-first.
- Cheapest provider path before paid API calls.
- BYOK before platform-owned AI spend.
- npm distribution before heavy SaaS infrastructure.
- A real working vertical slice before adding many features.
- Clear learning outcomes before decorative product complexity.

## What To Avoid Early

- Building cloud auth before the local product works.
- Spending on ads before onboarding and retention are measurable.
- Supporting too many providers before one provider path is stable.
- Adding enterprise features before individual job seekers love the core loop.
- Overbuilding billing before there is real demand.

## Near-Term Roadmap

| Stage | Goal | Output |
| --- | --- | --- |
| Prototype | Prove the interview loop | Local app, mock or real provider, analysis report |
| npm Launch | Make it installable | Published npm package and quickstart docs |
| Cost Control | Reduce operating risk | BYOK, CLI providers, free-tier-first fallback |
| Acquisition | Find first users | Content, communities, small ad tests, demo videos |
| Monetization | Convert serious users | Pro and Cloud pricing tiers |
| Scale | Improve retention | Better analytics, exports, reminders, cloud sync |
