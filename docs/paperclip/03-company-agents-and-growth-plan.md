# iPrep Company, Paperclip Agents, And Growth Plan

## Company Context

iPrep is the company and product. iPrep focuses on interview practice, interview analytics, communication improvement, and personalized suggestions that help job seekers prepare with more confidence.

The product goal is to help users:

- Practice realistic interviews with AI tutors.
- Review transcripts, scores, and feedback after each session.
- Understand communication, technical, confidence, and problem-solving gaps.
- Get improvement suggestions and next-practice recommendations.
- Keep local-first privacy while still having a path to Pro and Cloud features later.

## Paperclip Working Rule

Paperclip agents should not build the product by default.

The founder will build the product. Paperclip should mostly act as a verification, review, planning, strategy, and decision-support system. Paperclip should write code only when the founder explicitly asks for code, implementation, scaffolding, or file changes.

Default Paperclip behavior:

- Ask clarifying questions before changing architecture or implementation.
- Verify whether work matches the iPrep goal, architecture, API, local data model, and roadmap.
- Review plans, docs, implementation decisions, release readiness, marketing strategy, and business decisions.
- Track records, metrics, assumptions, experiments, and outcomes.
- Create strategies, plans, checklists, and decision memos.
- Help the founder think clearly, but do not take ownership away from the founder.

Explicit code rule:

```text
Do not write or modify code unless the founder asks for code or implementation.
If the founder asks for review, analysis, planning, or verification, stay in that mode.
```

## Operating Model

iPrep should run as a founder-led, AI-assisted company.

| Area | Owner | Paperclip Role |
| --- | --- | --- |
| Product building | Founder | Review, verify, suggest improvements, write code only when asked. |
| Architecture | Founder | Challenge assumptions, check consistency, produce decision notes. |
| Engineering quality | Founder | Review implementation, tests, release readiness, and risk. |
| Marketing | Founder + Paperclip | Create strategy, content plans, campaigns, and tracking sheets. |
| Sales | Founder + Paperclip | Define user segments, outreach scripts, qualification, and follow-up plans. |
| Customer understanding | Founder + Paperclip | Turn feedback into themes, issues, roadmap input, and support docs. |
| Business decisions | Founder | Prepare options, tradeoffs, pricing models, and recommendation memos. |

## Phase-Based Company Plan

| Phase | Focus | Paperclip Contribution |
| --- | --- | --- |
| Phase 1 | Working prototype and npm publish | Verify scope, review build progress, maintain launch checklist. |
| Phase 2 | Advertising and cost optimization | Create ad strategy, track spend, compare channels, monitor provider costs. |
| Phase 3 | Monetization strategy | Model pricing, define upgrade moments, plan Razorpay/billing requirements. |
| Phase 4 | Customer acquisition | Build acquisition plans, outreach scripts, content calendar, and funnel tracking. |
| Phase 5 | Scale and reliability | Identify bottlenecks, suggest human hires, create process docs. |

## Agents To Use First

These are short role definitions. Each can later be expanded into a detailed agent prompt, skill, or operating checklist.

| Agent | Main Responsibility |
| --- | --- |
| Product Verification Agent | Checks if features match iPrep's interview practice, analytics, and improvement-suggestion goals. |
| Architecture Review Agent | Verifies that implementation matches the approved architecture, API contracts, local data strategy, and provider model. |
| Code Review Agent | Reviews code for bugs, regressions, missing tests, security risks, and maintainability when asked. |
| QA And Release Agent | Maintains test plans, npm publish checklist, smoke tests, and release readiness records. |
| Documentation Agent | Keeps product, architecture, CLI, API, and user docs consistent and readable. |
| Cost Optimization Agent | Tracks provider cost, local-first savings, free-tier usage, and paid API risk. |
| Marketing Strategy Agent | Creates positioning, content plans, campaign ideas, and launch narratives for job seekers. |
| Customer Acquisition Agent | Plans SEO, community, outreach, referral, and paid acquisition experiments. |
| Sales Strategy Agent | Creates lead segments, outreach scripts, qualification notes, and follow-up playbooks. |
| Analytics And Records Agent | Tracks metrics, experiments, customer feedback, decisions, assumptions, and outcomes. |
| Monetization Agent | Designs pricing tiers, upgrade triggers, billing requirements, and paid feature packaging. |
| Customer Support Agent | Turns issues into FAQs, troubleshooting docs, product fixes, and support templates. |
| Business Decision Agent | Creates decision memos with options, tradeoffs, risks, and recommended next actions. |

## Suggested Agent Responsibilities

### Product Verification Agent

- Verify whether each feature helps interview practice or improvement.
- Check if the user journey reaches first analysis quickly.
- Flag features that distract from the prototype goal.

### Architecture Review Agent

- Compare implementation against `docs/paperclip/02-architecture-and-tech-stack.md`.
- Check API route consistency with the Postman collection.
- Review local data strategy and provider fallback assumptions.

### Code Review Agent

- Review only when the founder asks for review.
- Prioritize bugs, broken flows, missing tests, and security issues.
- Avoid rewriting code unless explicitly asked.

### QA And Release Agent

- Maintain `npm install -g iprep` readiness checklist.
- Track smoke tests for CLI, server, frontend, DB, providers, and exports.
- Verify no local user data or secrets enter npm packages.

### Documentation Agent

- Keep docs aligned across architecture, CLI plan, demo app, Postman, and Paperclip docs.
- Create user-facing setup and troubleshooting docs.
- Update changelog and release notes when requested.

### Cost Optimization Agent

- Track provider usage assumptions and estimated costs.
- Prefer BYOK, CLI, free tier, and local model flows.
- Suggest limits and warnings before paid provider costs grow.

### Marketing Strategy Agent

- Define positioning for iPrep as interview practice plus analytics.
- Create content topics, launch posts, demo scripts, and landing page ideas.
- Keep messaging focused on job seeker outcomes.

### Customer Acquisition Agent

- Identify high-intent user segments.
- Plan SEO, communities, campus outreach, LinkedIn, YouTube, and small paid tests.
- Track cost per install, activation, completed interview, and paid conversion.

### Sales Strategy Agent

- Build outreach scripts for colleges, bootcamps, placement cells, and communities.
- Create partnership notes and follow-up templates.
- Help convert early interest into demos and feedback calls.

### Analytics And Records Agent

- Maintain experiment logs and decision records.
- Track activation funnel from install to first completed analysis.
- Summarize customer feedback into themes and roadmap inputs.

### Monetization Agent

- Compare Free Local, Pro Local, and Cloud packaging.
- Suggest pricing, upgrade triggers, and fair usage limits.
- Prepare billing and Razorpay requirements when the founder is ready.

### Customer Support Agent

- Convert repeated user problems into docs.
- Prepare support templates for install, keys, providers, CLIs, sessions, and exports.
- Track support issues that should become product fixes.

### Business Decision Agent

- Create short decision memos.
- List options, tradeoffs, risks, and recommended next steps.
- Help the founder decide without taking the decision away.

## Phase 1: Prototype And npm Publish

Primary objective:

```text
npm install -g iprep
iprep init
iprep doctor
iprep start
```

Paperclip's role:

- Verify whether the prototype scope is still tight.
- Review progress against the architecture and CLI plan.
- Maintain release checklist and risk list.
- Help test and review when asked.
- Avoid implementation unless explicitly requested.

Required outcomes:

- Local app starts reliably.
- User can complete an interview practice flow.
- Analysis report is generated.
- Data persists locally.
- Provider setup is understandable.
- npm package can be tested on a clean machine.

## Phase 2: Advertising And Cost Optimization

Paperclip's role:

- Create advertising strategy.
- Track channel experiments and results.
- Maintain cost records.
- Compare provider cost risks.
- Suggest budget allocation based on actual activation data.

Initial channels:

- SEO pages for interview prep topics.
- YouTube demo videos.
- LinkedIn posts for job seekers.
- Reddit, Discord, and community posts where allowed.
- Google Search ads for high-intent keywords.
- Campus, bootcamp, and placement-cell communities in India.

Metrics:

- Cost per website visit.
- Cost per npm install.
- Cost per first successful `iprep start`.
- Cost per completed interview.
- Cost per generated analysis.
- Cost per paid upgrade.

## Phase 3: Monetization Strategy

Recommended starting tiers:

| Tier | Price | Value |
| --- | --- | --- |
| Free Local | Free | Local app, BYOK, local history, basic exports. |
| Pro Local | Rs 149/month | Better reports, advanced analysis templates, reminders, tutor packs, priority updates. |
| Cloud | Rs 499/month | Sync, hosted providers, cloud backup, multi-device access, managed convenience. |

Paperclip's role:

- Model pricing options.
- Define upgrade moments.
- Track user willingness to pay.
- Draft billing requirements.
- Compare what belongs in Free, Pro, and Cloud.

## Phase 4: Customer Acquisition Strategy

High-intent segments:

- Final-year students.
- Bootcamp graduates.
- Engineers preparing for service or product company interviews.
- Candidates preparing for HR and behavioral rounds.
- Users applying to international remote jobs.
- Colleges, placement cells, and coding communities.

Paperclip's role:

- Create acquisition plans.
- Prepare outreach scripts.
- Track funnel data.
- Summarize customer conversations.
- Suggest which channels to double down on.

Activation target:

The user should reach first analysis as quickly as possible. Acquisition is only useful if iPrep gets users to a completed interview and an insight they trust.

## When To Hire Humans

Hire humans only when a bottleneck is proven.

| Bottleneck | First Human Hire |
| --- | --- |
| Product clarity or visual quality is weak | Product designer or product advisor |
| Local install support grows | Developer support contractor |
| Security concerns increase | Security reviewer |
| Ads start producing qualified users | Growth marketer |
| Paid users need fast help | Support specialist |
| Cloud tier becomes real | Backend/cloud engineer |
| Partnerships become promising | Sales or partnerships contractor |

## Weekly Operating Rhythm

Use a simple weekly cadence:

1. Monday: choose one product or growth milestone.
2. Tuesday to Thursday: founder builds, tests, and gathers feedback.
3. Friday: Paperclip helps review progress, metrics, blockers, and next decisions.
4. Weekend: update docs, records, content, and next-week plan.

Each week should produce at least one of:

- A working product improvement.
- A verified release candidate.
- A user-facing demo.
- A customer conversation summary.
- A measurable growth experiment.
- A decision record that clarifies the next step.

