# Plan: iPrep Demo App (docs/demo-app)

## Context

The user wants a fully interactive HTML/CSS/JS demo app inside `docs/demo-app/` that mirrors the planned iPrep architecture. It will serve as a living Figma-style reference — all screens, mock data, and mock API calls — so design and UX can be validated before the real React app is built.

No existing demo-app folder. No CSS/design files in the project. Three files is the target: `index.html`, `style.css`, `app.js`, plus `mock-data.json`.

---

## File Structure

```
docs/demo-app/
├── index.html          # SPA shell: sidebar + main content area
├── style.css           # Full design system (CSS custom properties → components)
├── app.js              # Router, MockAPI class, view renderers, state machine
└── mock-data.json      # All mock data (tutors, packages, sessions, analysis, providers)
```

---

## Design System

### Color Palette (CSS custom properties)
```css
--bg-primary:    #07070F   /* near-black, deep space */
--bg-surface:    #0E0E20   /* card background */
--bg-elevated:   #15152B   /* elevated card / modal */
--bg-border:     #1E1E3A   /* subtle borders */
--accent-purple: #7C3AED
--accent-blue:   #3B82F6
--accent-grad:   linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)
--text-primary:  #F1F5F9
--text-muted:    #64748B
--success:       #10B981
--warning:       #F59E0B
--error:         #EF4444
--glow-purple:   0 0 30px rgba(124,58,237,0.35)
```

### Typography
- Font: `Inter` (Google Fonts CDN)
- Sizes: 12px muted labels → 14px body → 16px subheading → 20px heading → 28px hero

### Components
- Glass cards: `background: rgba(14,14,32,0.8); backdrop-filter: blur(20px); border: 1px solid var(--bg-border)`
- Gradient buttons: `background: var(--accent-grad); box-shadow: var(--glow-purple)`
- Score rings: SVG `<circle>` with animated `stroke-dashoffset`
- Voice waveform: CSS `@keyframes` bars animating up/down
- Status badges: small colored dots + label
- Sidebar: fixed left, 240px, collapsible on small screens

---

## Pages / Views

### 1. Dashboard (`#dashboard`)
- Header: "Good morning, Kundalik 👋" + date
- Stats row: 4 cards — Total Sessions, Avg Score, Best Category, Study Streak
- Quick Start CTA: big gradient card "Start Interview →"
- Recent Sessions: last 3 sessions with tutor avatar, package tag, score badge, date
- Provider status mini-widget in sidebar bottom

### 2. New Interview (`#new-interview`) — 2-step wizard
- **Step 1 — Package**: 6 cards in 2×3 grid, each with icon + name + description + difficulty badge + "Pro" tag if applicable. Click to select (highlighted border).
- **Step 2 — Tutor**: 3 large cards — Alex / Priya / Morgan with avatar initials, specialty, personality tags. Click to select. "Start Session →" button.

### 3. Interview Session (`#session`)
- Top bar: package name, elapsed timer (animated), "End Interview" button (red)
- Center: animated voice waveform (5–7 bars pulsing) + tutor name + status ("Listening…" / "Speaking…" / "Thinking…")
- Bottom transcript feed: scrolling chat bubbles — tutor questions + user answers (mock)
- Floating mic toggle button (bottom center)
- Live question counter: "Question 3 of 8"

### 4. Analysis Results (`#analysis`)
- Header: session title + "Analyzed by Gemini 2.0 Flash" badge
- Score section: 5 animated radial rings (Communication, Technical, Problem Solving, Confidence, Overall) with numeric value
- Strengths panel: green tags list
- Improvements panel: amber tags list
- Answer-by-answer feedback: collapsible accordion (question → user answer → AI feedback → score chip)
- Full report: scrollable markdown-rendered section
- Export button (mock)

### 5. History (`#history`)
- Search bar + filter chips (All / Behavioral / Technical / DSA / HR / PM / System Design)
- Table: Date | Package | Tutor | Duration | Score | Status | Actions
- Row hover: subtle highlight, View + Delete action icons
- Empty state if no sessions match filter

### 6. Settings (`#settings`)
- Tabs: Providers | API Keys | Preferences
- **Providers tab**: list of all 8 providers with status dot (✅ / ❌ / ⚠️), version if detected, install hint if missing
- **API Keys tab**: BYOK form — 4 provider key inputs (Deepgram, Anthropic, Gemini, OpenAI) with show/hide toggle + Save
- **Preferences tab**: Default tutor dropdown, default package dropdown, theme toggle (dark/light placeholder)

---

## Mock Data (mock-data.json)

```json
{
  "tutors": [
    { "slug": "alex", "name": "Alex", "specialty": "Technical & DSA",
      "personality": ["Direct", "Challenging", "No-nonsense"],
      "voice": "aura-asteria-en", "isPro": false },
    { "slug": "priya", "name": "Priya", "specialty": "Behavioral & HR",
      "personality": ["Warm", "Supportive", "Structured"],
      "voice": "aura-luna-en", "isPro": false },
    { "slug": "morgan", "name": "Morgan", "specialty": "System Design & PM",
      "personality": ["Methodical", "Strategic", "Thorough"],
      "voice": "aura-zeus-en", "isPro": true }
  ],
  "packages": [ behavioral, technical, dsa, hr, pm, system-design objects ],
  "sessions": [ 8 mock session objects with transcripts ],
  "analysis": [ matching analysis objects with full scores + feedback ],
  "providers": {
    "deepgramAgent": { "status": "active", "version": "2.0" },
    "claudeCLI": { "status": "active", "version": "1.2.3" },
    "geminiFree": { "status": "active" },
    "geminiCLI": { "status": "inactive" },
    "codexCLI": { "status": "inactive" },
    "ollama": { "status": "warning", "note": "Not running" },
    "claudeAPI": { "status": "inactive", "note": "Key not set" },
    "openaiAPI": { "status": "inactive", "note": "Key not set" }
  }
}
```

---

## app.js Architecture

```
MockAPI class
  .getTutors()      → Promise<tutors[]> with 200ms delay
  .getPackages()    → Promise<packages[]>
  .getSessions()    → Promise<sessions[]>
  .getAnalysis(id)  → Promise<analysis>
  .getProviders()   → Promise<providers>
  .startSession(pkg, tutor) → Promise<{sessionId}>
  .endSession(id)   → Promise<{status}>

Router (hash-based)
  window.location.hash → render matching view
  history.pushState → navigate between views
  ViewState object  → currentView, selectedPackage, selectedTutor, activeSession

Views (render functions)
  renderDashboard()
  renderNewInterview()  → step 1 + step 2
  renderSession()       → starts fake waveform animation timer
  renderAnalysis(id)
  renderHistory()
  renderSettings()

Animations
  initWaveform()    → setInterval → toggle CSS classes on bars
  animateScoreRings() → requestAnimationFrame → increment stroke-dashoffset
  simulateTyping()  → append transcript lines on a timer during session
```

---

## Critical Files to Create

| File | Size estimate | Notes |
|------|--------------|-------|
| `docs/demo-app/index.html` | ~80 lines | Shell, sidebar, main div, script/link tags |
| `docs/demo-app/style.css` | ~600 lines | Full design system + all component styles |
| `docs/demo-app/app.js` | ~800 lines | Router + MockAPI + all view render functions |
| `docs/demo-app/mock-data.json` | ~200 lines | Realistic data for all entities |

---

## Verification

1. Open `docs/demo-app/index.html` directly in browser (file://)
2. Navigate all 6 views via sidebar
3. Run through: Dashboard → New Interview (pick package + tutor) → Session (see waveform) → End → Analysis (see animated rings)
4. Check History filter chips
5. Check Settings provider status dots
6. All mock API calls should show brief loading spinner then render data
