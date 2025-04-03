# Project Documentation

## Overview

This application is a web-based platform designed to provide engaging and interactive statistics related to sports, particularly soccer. It features a visually appealing interface with various graphical assets, such as logos and soccer ball icons, to enhance the user experience.

## Overview

This application is a web-based platform designed to provide users with engaging and interactive statistics, primarily focused on sports like soccer. It allows users to explore fun and insightful data visualizations, making statistical analysis more accessible and enjoyable. The app features a modern, responsive design and incorporates customizable themes to enhance the user experience. It is built with a focus on performance and scalability, leveraging a robust frontend tech stack.

## Features

- **Interactive Statistics**: Displays fun and insightful statistics about soccer.
- **Customizable Themes**: Includes multiple logo and icon variations for different themes.
- **Responsive Design**: Optimized for various screen sizes and devices.

## Tech Stack

### Frontend

- **HTML**: The structure of the application is defined in `index.html`.
- **TypeScript**: The primary programming language used for the application, ensuring type safety and better development experience.
- **MUI**: Ready to use components.
- **Vite**: A fast build tool and development server, configured in `vite.config.ts`.

### Tooling

- **ESLint**: Configured in `eslint.config.js` to maintain code quality and enforce coding standards.
- **TypeScript Configuration**: Managed through `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json` for different build targets.

### Assets

- **Public Directory**: Contains static assets such as logos and icons used in the application.

## Getting Started

1. **Install Dependencies**:

   ```sh
   npm install
   ```

2. Run the Development Server:

```sh
npm run dev
```

3. Build for Production:

```sh
npm run build
```

4. Preview the Production Build:

```sh
npm run preview
```

## Directory Structure

`.env`: Environment variables for the application.
`public/`: Contains static assets like logos and icons.
`src/`: The source code of the application.
`tsconfig.*.json`: TypeScript configuration files for different environments.
`vite.config.ts`: Configuration for the Vite build tool.
