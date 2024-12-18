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
  - Weapon Strength
  - Survivor Strength
  - Monster Toughness
  - Survivor Luck
  - Monster Luck
- Critical wound threshold calculation
- Automatic luck comparison

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
