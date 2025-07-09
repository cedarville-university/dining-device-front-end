# dining-device-front-end

A Progressive Web App (PWA) for showcasing dynamic menus, built with Vue.js, TypeScript, and Vite. This application integrates directly with the Pioneer Food Services API, making it easy to display up-to-date menus on digital signage in cafeterias, dining halls, and other food service locations.

## Features

- **Built with Vue.js + TypeScript:** Modern, maintainable, and scalable codebase.
- **Powered by Vite:** Fast development and optimized builds.
- **Pioneer Food Services API Integration:** Automatically displays the latest menu data.
- **Kiosk Mode:** Full-screen, distraction-free display for digital signage.
- **PWA:** Installable on any device, works offline, and supports push updates.
- **Real-Time Updates:** Menus refresh automatically with new API data.
- **Multi-Screen Support:** Run on multiple displays across different locations.
- **Responsive Design:** Optimized for TVs, tablets, and desktops.

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Pioneer Food Services API credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/dining-device-front-end.git
   cd dining-device-front-end
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure your environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     VITE_APP_ROOT=/
     VITE_APP_URL=https://your-signage-app-url.com
     VITE_API_CAMPUS=campus-name
     ```
   - Replace the values as needed for your deployment.

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and go to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist` directory.

## Usage

- **Kiosk Mode:** Open the app on any screen and switch to kiosk mode for a full-screen menu display.
- **PWA Installation:** Use “Add to Home Screen” in your browser for a native app experience.

## Configuration

- All configuration is managed through the `.env` file using these variables:
  - `VITE_APP_ROOT`: The root path of the app.
  - `VITE_APP_URL`: The public URL where the app is hosted.
  - `VITE_API_CAMPUS`: The campus name for fetching menus from the Pioneer Food Services API.

## Contributing

Pull requests and suggestions are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## License

[MIT](LICENSE)
