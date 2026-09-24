# Batch Countdown Timer — Implementation Plan

## Overview
Single-page vanilla HTML/CSS/JS countdown timer for 4 daily batches (9AM–9PM), updating every second.

---

## Implemented Features

| Feature | Details |
|---------|---------|
| **Batch Schedule** | 4 fixed windows: 9–12, 12–15, 15–18, 18–21 |
| **Current Batch Detection** | Auto-detects from local time; loops to Batch 1 (tomorrow) after 9PM |
| **Countdown Target** | Time remaining until *current batch ends* |
| **Update Frequency** | Every 1000ms via `setInterval` |
| **Display Format** | `Batch N: HH:MM AM/PM – HH:MM AM/PM` + `HH:MM:SS` timer |
| **Visual Feedback** | Scale + color flash on each second tick |

---

## Technical Stack
- **Single file**: `index.html` (6.3 KB)
- **No dependencies** — runs offline in any browser
- **Embedded CSS/JS** — no external requests

---

## Code Structure
```
index.html
├── HTML (semantic, accessible)
├── CSS (embedded)
│   ├── Dark gradient background
│   ├── Glassmorphism container
│   ├── Monospace timer digits
│   ├── Blinking separators
│   └── Tick animation (0.1s scale)
└── JS (embedded)
    ├── BATCHES config array
    ├── getCurrentBatch() — time-window logic
    ├── getBatchEndTime() — handles next-day wrap
    ├── formatTimeRange() — 12h AM/PM formatting
    └── updateCountdown() — DOM updates + tick trigger
```

---

## Responsive Breakpoints
- **Desktop**: 4rem digits, 60px padding
- **Mobile (<600px)**: 2.5rem digits, 20px padding, stacked layout

---

## Future Enhancement Ideas
1. **Timezone support** — currently uses local browser time
2. **Audio alerts** — optional beep at batch transitions
3. **Persisted settings** — custom batch times via localStorage
4. **PWA manifest** — installable offline app
5. **Keyboard shortcuts** — space to pause, R to reset

---

## File Location
`C:\timmer\index.html` — open in any browser to test.