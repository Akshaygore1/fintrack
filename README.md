# FinTrack - Privacy-First Personal Finance Tracker

**Track your finances, privately.**

FinTrack is a 100% local, privacy-first personal finance tracker built for people who care about data ownership. Import bank statements, auto-categorize transactions, and visualize spending — all without your data ever leaving your device.

## 🌟 Key Features

- **🔒 100% Private** - All data stored in browser localStorage. Zero server communication, zero tracking.
- **📊 Smart CSV Import** - Drag & drop any bank statement. Intelligent auto-detection maps columns automatically.
- **🏷️ Auto-Categorization** - 13+ pre-built categories optimized for common merchants (Swiggy, Zomato, Amazon, etc.)
- **🎨 Custom Categories** - Create unlimited categories with custom keywords and colors
- **📈 Interactive Dashboard** - Beautiful charts showing spending trends, top merchants, and category breakdowns
- **💾 Export Anytime** - Download categorized transactions as CSV. Your data, your control.
- **🌐 Works Offline** - Once loaded, works completely offline. No internet required.
- **🚀 Free Forever** - No account, no subscription, no hidden costs

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Routing**: React Router 7
- **Charts**: Recharts
- **Icons**: Phosphor Icons
- **Storage**: Browser localStorage (no backend)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Modern web browser with localStorage support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fintrack.git
cd fintrack

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
bun run build

# Preview production build
npm run preview
```

## 📝 Usage

1. **Import Transactions** - Upload your bank statement CSV file
2. **Map Columns** - App auto-detects Date, Description, and Amount columns
3. **Review & Categorize** - Transactions are automatically categorized based on merchant names
4. **Analyze** - View your dashboard with spending insights, trends, and breakdowns
5. **Customize** - Create custom categories and keywords in Settings
6. **Export** - Download your categorized data anytime

## 🔐 Privacy & Security

- **No Backend** - FinTrack has no server, database, or API calls
- **Local Storage** - All data lives in your browser's localStorage
- **No Tracking** - No analytics, no telemetry, no third-party scripts
- **Open Source** - Audit the code yourself
- **No Account Required** - Start using immediately, no sign-up needed

## 🏦 Supported Banks

FinTrack works with CSV exports from most banks including:
- HDFC Bank
- ICICI Bank
- State Bank of India (SBI)
- Axis Bank
- Kotak Mahindra Bank
- And many more...

If auto-detection doesn't work perfectly, you can manually map columns.

## 📦 Project Structure

```
fintrack/
├── src/
│   ├── components/
│   │   ├── landing/       # Landing page components
│   │   ├── dashboard/     # Dashboard charts & widgets
│   │   ├── transactions/  # Transaction table & filters
│   │   ├── upload/        # CSV upload & mapping UI
│   │   ├── settings/      # Category management
│   │   ├── layout/        # App layout & sidebar
│   │   └── ui/            # Reusable UI components (shadcn)
│   ├── pages/             # Route pages
│   ├── lib/               # Utilities & helpers
│   ├── hooks/             # React hooks
│   ├── types/             # TypeScript types
│   └── constants/         # App constants
├── public/                # Static assets
└── e2e/                   # Playwright tests
```

## 🧪 Testing

```bash
# Run E2E tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vite.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Charts powered by [Recharts](https://recharts.org/)

## 📧 Support

For questions, issues, or feature requests, please [open an issue](https://github.com/yourusername/fintrack/issues).

---

**Built with ❤️ for privacy-conscious individuals**
