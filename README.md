# AVAMAE Web Application

A modern, responsive React web application built based on Adobe XD designs. This application features a clean, professional design with three main pages: Home, About Us, and Contact Us.

## Features

- **Responsive Design**: Optimized for both desktop and mobile devices
- **Single Page Application (SPA)**: Built with React Router for smooth navigation
- **Interactive Carousel**: Home page features a dynamic carousel powered by Swiper.js
- **Contact Form**: Fully functional contact form with validation and API integration
- **Modern UI/UX**: Clean, professional design with smooth animations and transitions
- **API Integration**: Connects to external REST endpoints for dynamic content

## Pages

### Home Page (`/`)
- Hero carousel with dynamic content from API
- Company information section
- Call-to-action buttons
- Responsive grid layout

### About Us (`/about-us`)
- Company information and description
- Professional office imagery
- Clean, readable typography

### Contact Us (`/contact-us`)
- Interactive contact form with validation
- Dynamic phone number fields
- Form submission to external API
- Success/error handling

## Technology Stack

- **React 18.2.0**: Latest version with modern hooks
- **React Router 6**: Client-side routing
- **Swiper.js**: Carousel functionality
- **CSS3**: Modern styling with CSS variables
- **Responsive Design**: Mobile-first approach

## API Endpoints

The application integrates with the following external APIs:

- **Carousel Data**: `GET https://interview-assessment.api.avamae.co.uk/api/v1/overlays`
- **Contact Form**: `POST https://interview-assessment.api.avamae.co.uk/api/v1/contact-us/submit`

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd avamae-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `build` folder.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   ├── Header.css      # Header styles
│   ├── Footer.js       # Footer component
│   └── Footer.css      # Footer styles
├── pages/              # Page components
│   ├── HomePage.js     # Home page with carousel
│   ├── HomePage.css    # Home page styles
│   ├── AboutPage.js    # About us page
│   ├── AboutPage.css   # About page styles
│   ├── ContactPage.js  # Contact form page
│   └── ContactPage.css # Contact page styles
├── App.js              # Main application component
├── App.css             # Global styles and CSS variables
├── index.js            # Application entry point
└── index.css           # Base styles
```

## Features in Detail

### Responsive Navigation
- Sticky header with company logo
- Mobile-friendly hamburger menu
- Active page highlighting
- Sign-in button (non-functional as per requirements)

### Hero Carousel
- Dynamic content loading from API
- Smooth transitions and animations
- Navigation arrows and pagination dots
- Autoplay functionality
- Responsive image handling

### Contact Form
- Real-time validation
- Dynamic phone number fields
- Character count for messages
- Form submission handling
- Loading states and error handling
- Success/error feedback

### Design Elements
- Custom logo with overlapping shapes
- Abstract ribbon graphic on contact page
- Consistent color scheme using CSS variables
- Modern typography and spacing
- Smooth hover effects and transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Lazy loading of components
- Optimized CSS with CSS variables
- Efficient state management
- Responsive image handling
- Minimal bundle size

## Customization

The application uses CSS variables for easy theming:

```css
:root {
  --primary-blue: #0066cc;
  --secondary-blue: #4da6ff;
  --accent-orange: #ff6b35;
  --accent-green: #4caf50;
  --accent-purple: #9c27b0;
  /* ... more variables */
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to AVAMAE Software Solutions Ltd.

## Support

For technical support or questions, please contact the development team. 