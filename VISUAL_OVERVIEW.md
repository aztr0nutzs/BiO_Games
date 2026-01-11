# 🎮 BiO GAMES - Visual Overview

## Screen Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  boot.html (1.5 seconds)                                     │
│  ⚡ BiO GAMES ⚡                                             │
│  [Loading spinner] [Progress bar]                           │
│                    ↓                                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  bio_lobby3.html (Main Menu)                                │
│  ⚡ BiO GAMES ⚡                                             │
│  Next Gen Gaming Platform                                   │
│                                                               │
│  ┌──────────────────────────────┐                          │
│  │   🎮 Knxt 4 Online           │                          │
│  │   🏆 Ranked Queue            │                          │
│  │   🛍️ Bio Store              │                          │
│  └──────────────────────────────┘                          │
│                                                               │
│  Version 1.0.0 | Status: ONLINE                            │
│                                                               │
├───┬─────────────────────┬─────────────────────┬────────────┤
│   │                     │                     │            │
│   ↓                     ↓                     ↓            │
│ knxt4.html          ranked.html           store.html     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen 1: Boot Screen (boot.html)

```
┌─────────────────────────────────────┐
│                                       │
│        ⚡ BiO GAMES ⚡              │
│                                       │
│         Initializing...              │
│                                       │
│            [  ⟳  ]                   │ (Spinner)
│      ▰▰▰▰▰▰▰░░░░░░░░░░            │ (Progress bar)
│                                       │
│      (Auto-transitions in 1.5s)     │
│                                       │
└─────────────────────────────────────┘
```

**Colors:**
- Background: Dark gradient (#050510 → #0a0a15)
- Text: Cyan (#0ff)
- Accents: Green progress bar

---

## Screen 2: Lobby Screen (bio_lobby3.html)

```
┌─────────────────────────────────────┐
│                                       │
│    ⚡ BiO GAMES ⚡                  │
│  Next Gen Gaming Platform           │
│                                       │
│  ┌───────────────────────────────┐  │
│  │    🎮 Knxt 4 Online           │◄─┼─ Hover: Glow effect
│  └───────────────────────────────┘  │
│                                       │
│  ┌───────────────────────────────┐  │
│  │    🏆 Ranked Queue            │  │
│  └───────────────────────────────┘  │
│                                       │
│  ┌───────────────────────────────┐  │
│  │    🛍️ Bio Store              │  │
│  └───────────────────────────────┘  │
│                                       │
│   Version 1.0.0 | Status: 🟢 ONLINE │
│                                       │
└─────────────────────────────────────┘
```

**Colors:**
- Button border: Cyan (#0ff)
- Button background: rgba(0, 255, 255, 0.1)
- Button hover: rgba(0, 255, 255, 0.3) + glow
- Text: Cyan (#0ff)

---

## Screen 3: Knxt 4 Game (screens/knxt4.html)

```
┌──────────────────────────────────┐
│   ⚡ KNXT 4 ONLINE ⚡           │
│                                    │
│  🎮 You (Local)   🤖 AI Opponent  │
│      ●                 ●          │ (Magenta)   (Green)
│                                    │
│  Your turn - Click column          │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  ○  ○  ○  ○  ○  ○  ○       │ │
│  │  ○  ○  ○  ○  ○  ○  ○       │ │
│  │  ○  ○  ●  ○  ○  ○  ○       │ │ Pieces in grid
│  │  ○  ●  ○  ○  ●  ○  ○       │ │ ● = Filled
│  │  ●  ○  ○  ●  ○  ●  ●       │ │ ○ = Empty
│  │  ●  ●  ○  ●  ●  ○  ●       │ │
│  └──────────────────────────────┘ │
│                                    │
│  [  New Game  ] [Back to Lobby]   │
│                                    │
└──────────────────────────────────┘
```

**Colors:**
- Player pieces: Magenta (#f0f)
- AI pieces: Green (#0f0)
- Empty cells: Dark blue (#001a1a)
- Cell borders: Cyan (#0ff)

**Game Logic:**
- 6 rows × 7 columns
- Gravity physics (pieces fall down)
- Win detection (4 in a row)
- AI opponent with strategy

---

## Screen 4: Ranked Queue (screens/ranked.html)

```
┌──────────────────────────────────┐
│     🏆 RANKED QUEUE             │
│                                    │
│  ┌────────────────────────────┐  │
│  │           🥈               │  │ Rank tier
│  │                            │  │
│  │  Current Tier: Silver II   │  │
│  │  ELO Rating: 1,250         │  │
│  │  Win Rate: 52%             │  │
│  │  Total Games: 48           │  │
│  └────────────────────────────┘  │
│                                    │
│  ┌────────────────────────────┐  │ (When queuing)
│  │  ⏳ Searching...           │  │
│  │  Wait: 2:15                │  │
│  └────────────────────────────┘  │
│                                    │
│  [Join Ranked Queue]              │
│  [Back to Lobby]                  │
│                                    │
│  💡 Next Tier: Gold V (1500 ELO) │
│                                    │
└──────────────────────────────────┘
```

**Colors:**
- Stats panel: rgba(0, 255, 255, 0.1) border
- ELO text: Green (#0f0)
- Searching animation: Pulsing with glow
- Text: Cyan (#0ff)

**Features:**
- Player tier with emoji
- ELO rating display
- Win rate percentage
- Queue join/leave toggle
- Animated search status
- Match simulation (3-5s)

---

## Screen 5: Bio Store (screens/store.html)

```
┌──────────────────────────────────┐
│      🛍️ BIO STORE              │
│                                    │
│  ┌────────────────────────────┐  │
│  │ 💰 Bio Coins │ 💎 Bio Gems │ │
│  │      0       │      0      │  │ Currency display
│  │ ⭐ Battle Pass: Free       │  │
│  └────────────────────────────┘  │
│                                    │
│  🌟 Featured Items                │
│  ┌──────────┬──────────┐         │
│  │ 🎨       │ 🌊       │         │
│  │ Golden   │ Aqua     │         │
│  │ Theme    │ Theme    │         │
│  │ 500 💎  │ 500 💎  │         │
│  │ [Buy]    │ [Buy]    │         │
│  └──────────┴──────────┘         │
│                                    │
│  💰 Currency Packs               │
│  ┌──────────┬──────────┐         │
│  │ 💎       │ 💎💎     │         │
│  │ Starter  │ Pro Pack │         │
│  │ $4.99    │ $9.99    │         │
│  │ [Buy]    │ [Buy]    │         │
│  └──────────┴──────────┘         │
│                                    │
│  [Back to Lobby]                  │
│                                    │
└──────────────────────────────────┘
```

**Colors:**
- Item cards: rgba(0, 255, 255, 0.1) background
- Item borders: Cyan (#0ff)
- Prices: Green (#0f0)
- Coming Soon: Greyed out
- Text: Cyan (#0ff)

**Features:**
- Currency display
- Featured items grid
- Currency packs
- Coming soon items
- Purchase notifications

---

## Color Palette

```
Primary Colors:
┌──────────────────────────────┐
│ Cyan        #0ff             │ ← Main accent, buttons, text
│ Dark Black  #050510          │ ← Background (top)
│ Dark Gray   #0a0a15          │ ← Background (bottom)
└──────────────────────────────┘

Secondary Colors:
┌──────────────────────────────┐
│ Magenta     #f0f             │ ← Player 1 pieces
│ Green       #0f0             │ ← Player 2/AI, success
│ Dark Cyan   #088             │ ← Subtitle text
│ Dark Blue   #001a1a          │ ← Game board cells
└──────────────────────────────┘
```

---

## Animation Effects

```
1. Boot Screen
   [Spinner] - Rotates continuously
   [Progress Bar] - Slides from left to right

2. Lobby Screen
   [Title] - Glowing pulse effect
   [Buttons] - Scale + glow on hover

3. Knxt 4
   [Board] - Cells scale on hover
   [Pieces] - Display in grid

4. Ranked Queue
   [Status] - Pulsing animation when queuing
   [Wait Time] - Updates every 3 seconds

5. Store
   [Items] - Scale + shadow on hover
```

---

## Responsive Design

```
Mobile (Portrait):
┌────────────────────┐
│      Header        │
├────────────────────┤
│                    │
│    Game Content    │
│    (Full Width)    │
│                    │
├────────────────────┤
│    Buttons         │
│   (Full Width)     │
└────────────────────┘

Tablet (Landscape):
┌────────────────────────────────────┐
│           Header                    │
├────────────────┬────────────────────┤
│                │                    │
│  Game Content  │  Stats/Info Panel  │
│                │                    │
├────────────────┴────────────────────┤
│          Buttons (Centered)         │
└────────────────────────────────────┘
```

---

## Summary

✅ **Professional Design** - Polished UI with consistent branding
✅ **Smooth Animations** - Engaging visual feedback
✅ **Full Functionality** - All features implemented
✅ **Mobile Optimized** - Works on all screen sizes
✅ **Cyan Theme** - Modern neon aesthetic

Your BiO Games app is now visually stunning and fully functional! 🎮✨


