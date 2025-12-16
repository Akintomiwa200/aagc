# AAGC Church Portal

> A modern, full-featured church management and community engagement platform built with Next.js and React.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Components](#components)
- [Customization](#customization)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

AAGC (Apostolic Army Global Church) Portal is a comprehensive digital platform designed to enhance church community engagement, streamline administrative tasks, and provide an immersive online experience for members and visitors. The platform features a modern, responsive design with smooth animations and intuitive user interfaces.

### Purpose

This portal serves as a central hub for:
- **Worship Services**: Live streaming and sermon archives
- **Community Building**: Events, ministries, and small groups
- **Digital Giving**: Secure online donations
- **Member Management**: First-timer registration and follow-up
- **Communication**: Announcements, prayer requests, and updates

## ✨ Features

### 🏠 Hero Section with Image Slider
- Auto-playing background image carousel
- Engaging call-to-action buttons
- Real-time statistics dashboard
- Responsive design with mobile optimization

### 📅 Event Management
- Featured event showcases
- Event registration and RSVP
- Calendar integration
- Location mapping

### 🎙️ Sermon Library
- Video/audio sermon playback
- Downloadable content
- Series organization
- Search and filter functionality

### 💝 Online Giving
- Secure donation processing
- Multiple giving options
- Real-time giving statistics
- SSL-encrypted transactions

### 📝 First Timer Registration
- Comprehensive registration form
- Form validation
- Interest tracking
- Prayer request submission
- Automated follow-up system

### 🎨 Modern UI/UX
- Clean, professional design
- Smooth animations and transitions
- Mobile-first responsive layout
- Accessibility compliant
- Dark mode support (optional)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 3+
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Type Safety**: TypeScript

### Components
- **shadcn/ui**: Accessible component library
- **Custom Components**: Purpose-built church components

### Development Tools
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/aagc-portal.git
   cd aagc-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_CHURCH_NAME="AAGC"
   # Add your API keys and configuration here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
aagc-portal/
├── app/
│   ├── page.tsx                 # Home page with hero slider
│   ├── join/
│   │   └── page.tsx            # First timer registration
│   ├── events/
│   │   └── page.tsx            # Events listing
│   ├── sermons/
│   │   └── page.tsx            # Sermon library
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── sections/
│   │   ├── Navbar.tsx          # Navigation component
│   │   ├── HeroSection.tsx     # Hero with slider
│   │   ├── EventsSection.tsx   # Events display
│   │   ├── SermonsSection.tsx  # Sermon library
│   │   ├── GivingSection.tsx   # Giving portal
│   │   ├── ChurchDetails.tsx   # Church info
│   │   └── Footer.tsx          # Footer component
│   └── forms/
│       └── FirstTimerForm.tsx  # Registration form
├── lib/
│   └── utils.ts                # Utility functions
├── public/
│   ├── images/                 # Image assets
│   └── fonts/                  # Custom fonts
├── styles/
│   └── globals.css             # Global styles
├── tailwind.config.ts          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies
```

## 🧩 Components

### Core Components

#### Navbar
Responsive navigation with mobile menu support
```tsx
import Navbar from '@/components/sections/Navbar';

<Navbar />
```

#### Hero Section
Auto-playing image slider with CTA buttons
```tsx
import HeroSection from '@/components/sections/HeroSection';

<HeroSection />
```

#### Events Section
Display upcoming church events
```tsx
import EventsSection from '@/components/sections/EventsSection';

<EventsSection />
```

#### Sermons Section
Sermon library with playback
```tsx
import SermonsSection from '@/components/sections/SermonsSection';

<SermonsSection />
```

#### Giving Section
Secure online giving portal
```tsx
import GivingSection from '@/components/sections/GivingSection';

<GivingSection />
```

#### First Timer Form
Comprehensive registration form
```tsx
import FirstTimerForm from '@/components/forms/FirstTimerForm';

<FirstTimerForm />
```

## 🎨 Customization

### Branding

1. **Update church information** in `app/layout.tsx`:
   ```tsx
   export const metadata = {
     title: 'Your Church Name',
     description: 'Your church description',
   }
   ```

2. **Change color scheme** in `tailwind.config.ts`:
   ```ts
   theme: {
     extend: {
       colors: {
         primary: '#10B981', // Your primary color
         secondary: '#3B82F6', // Your secondary color
       }
     }
   }
   ```

3. **Replace images**:
   - Add your church images to `/public/images/`
   - Update image paths in components

### Content

- **Hero Section**: Edit content in `components/sections/HeroSection.tsx`
- **Events**: Update event data in `components/sections/EventsSection.tsx`
- **Sermons**: Modify sermon list in `components/sections/SermonsSection.tsx`
- **Footer**: Customize links and info in `components/sections/Footer.tsx`

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

```bash
npm run build
vercel --prod
```

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- **Netlify**: Full Next.js support
- **AWS Amplify**: Serverless deployment
- **Digital Ocean**: Docker deployment
- **Self-hosted**: PM2 or Docker

Build for production:
```bash
npm run build
npm start
```

## 🔐 Environment Variables

Create a `.env.local` file:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CHURCH_NAME="Your Church Name"
NEXT_PUBLIC_CHURCH_EMAIL=info@yourchurch.com
NEXT_PUBLIC_CHURCH_PHONE="+234 123 456 7890"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API Keys (if needed)
# STRIPE_PUBLIC_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Use TypeScript for type safety
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test responsive design on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: [Your Name]
- **Development**: [Your Team]
- **Design**: [Designer Name]

## 📞 Support

For questions or support:
- **Email**: support@yourchurch.com
- **Website**: https://yourchurch.com
- **GitHub Issues**: [Create an issue](https://github.com/your-org/aagc-portal/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

**Built with ❤️ for the Kingdom**

*Last Updated: December 2024*