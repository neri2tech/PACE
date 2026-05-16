# PACE: Progress & Academic Completion Engine

PACE is a high-performance, real-time academic tracking platform designed to drive student excellence. It empowers educators with real-time analytics, automated intervention triggers, and a unified command center for institutional management.

## 🚀 Core Features

- **Real-time Heatmaps**: Instant visibility into student performance categories (On Track, Slowing Down, Stagnant).
- **Automated Interventions**: Seamlessly push learning resources and personalized notes to students based on performance data.
- **Institutional Branding**: Fully customizable dashboard banners for school identity.
- **Multi-Role Access Control**: Tailored experiences for Superadmins, Teachers, and Students.
- **AI-Powered Insights**: Integrated Gemini AI assistant for platform navigation and educational support.

## 🛠 Tech Stack

- **Frontend**: React.js + Vite (for lightning-fast HMR and build times).
- **Styling**: Vanilla CSS with a custom modern design system (Glassmorphism, Vibrant Gradients).
- **Backend/DB**: Firebase (Auth, Firestore, Storage).
- **AI**: Google Gemini API integration.

## 🏃 Getting Started

### Prerequisites

- Node.js (v18+)
- Firebase Account & Project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/neri2tech/PACE.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file and add your Firebase and Gemini API keys.

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Security & Roles

- **Superadmin**: Full institutional control, branding settings, and teacher management.
- **Teacher**: Command center for student performance tracking and interventions.
- **Student**: Personalized portal for progress tracking and accessing assigned resources.

---
Built with ❤️ for Educational Excellence.

