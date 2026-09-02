# KDM Showdown Widget

A web application designed to help Kingdom Death: Monster players calculate hit and wound chances during showdowns. The app features a space-efficient interface optimized for mobile use during gameplay.

## Features

### Hit Calculator
- Input fields for:
  - Survivor Accuracy
  - Weapon Accuracy
  - Monster Evasion
- Toggle options for:
  - Blind Spot bonus (+1 accuracy)
  - Knocked Down status (hits on 3+)

### Wound Calculator
- Input fields for:
  - Survivor Strength
  - Weapon Strength
  - Monster Toughness
  - Survivor Luck
  - Monster Luck
- Critical wound threshold calculation
- Automatic luck comparison

### Dual Weapon Slots & Weapon Traits
- **Two Weapon Profiles per Survivor (`W1` & `W2`)**:
  - Independent Accuracy, Strength, and Weapon Traits for each slot.
  - Seamless toggle (`Weapon 1 | Weapon 2` or `W1 | W2`) in both Single View and 4-Player TV View.
- **Weapon Trait Keywords**:
  - **Deadly** (+1 Luck on wound attempts): Automatically calculates and lowers the critical wound target (e.g. 9+).
  - **Deadly 2** (+2 Luck on wound attempts): Lowers critical wound target (e.g. 8+).
  - **Sharp**: Displays rule reminder (*Add 1d10 strength to each wound attempt*).
  - **Savage**: Displays rule reminder (*On critical wound, inflict +1 wound / draw extra location*).
  - **Devastating**: Displays rule reminder (*Inflict 1 additional wound on successful wound*).
  - **Frail**: Displays rule reminder (*Roll of 1 to wound breaks weapon*).
  - **Paired**: Displays rule reminder (*Attack with both weapons / double speed*).
  - **Slow / Unwieldy**: Reminders for speed limit and knockdown on 1s.
- **Rule Reminders & Badges**:
  - Full rule reminder notes appear in Single View cards.
  - Trait badges display dynamically below the Crit badge in 4-Player TV view.
  - Interactive Trait Manager modal accessible directly in 4-Player TV view via `+Traits`.

### 4-Player TV View (Widescreen / SmartView)
- **4-Column Dashboard** optimized specifically for TV casting via SmartView to widescreen televisions
- Real-time **Hit**, **Wound**, and **Crit** roll badges for every player visible at a glance
- Shared top Monster control bar (Toughness, Evasion, Luck, Knocked Down toggle) that updates all 4 players concurrently
- Compact stat controls per player following the **Survivor &rarr; Weapon &rarr; Monster** convention
- Quick switch button (`4P TV` / `Single View`) in header and slide-up menu
- Direct single-click navigation to jump into any individual survivor's detailed card

### Mobile Portrait Optimization
- Responsive 3-column stat rows fitting Survivor, Weapon, and Monster stats side-by-side with zero cutoffs
- Side-by-side compact checkboxes for Blind Spot and Knocked Down
- Critical wound calculations and weapon rule reminder notes fully visible above navigation dots
- Smooth overflow scroll safety for smaller smartphone screens

### Session Persistence & Reset Controls
- **Automatic Auto-Save via Cookies & LocalStorage**:
  - Automatically saves all 4 survivors' stats, dual weapon profiles, active traits, and viewing preferences in real time.
  - Data persists indefinitely across browser tabs, device sleep, and page reloads.
  - Set with 1-year persistent cookies and client-side storage with backward-compatible schema migration.
- **Reset Controls**:
  - **Reset Survivors**: One-click wipe to reset all 4 survivors and weapons back to defaults for a new campaign.
  - **Reset Monster**: Instant reset of monster Toughness, Evasion, Luck, and Knocked Down status for a fresh showdown.

### Interface
- Unified navigation and results display
- Touch-friendly controls with plus/minus buttons
- Real-time calculation updates
- Dark theme designed to match KDM's aesthetic
- Full viewport layout with no scrolling required
- Responsive design for all screen sizes

## Live Demo

The application is deployed and available at: [kdm-showdown-widget.vercel.app](https://kdm-showdown-widget.vercel.app)

## Technology Stack

- Next.js 14.0
- React 18
- Tailwind CSS
- Lucide Icons
- ShadcnUI Components
- Deployed on Vercel

## Development

To run this project locally:

1. Clone the repository:
```bash
git clone https://github.com/Zakko2/kdmShowdownWidget.git
cd kdmShowdownWidget
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. The top display shows both your required hit and wound rolls
2. Click on either display to switch between hit and wound calculators
3. Use the plus/minus buttons to adjust stats
4. Toggle checkboxes for special conditions
5. All calculations update automatically
6. Critical wound thresholds are shown when viewing wound calculator

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built for the Kingdom Death: Monster community
- Inspired by the need for quick calculations during showdowns
- Thanks to the KDM community for feedback and suggestions

## Disclaimer

This is a fan-made tool and is not officially affiliated with Kingdom Death: Monster.
