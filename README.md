# Flagright Visualizer

A frontend application for visualizing and analyzing user relationships and transactions.

- Frontend Repository Link: [https://github.com/Harsh2563/flagright-frontend](https://github.com/Harsh2563/flagright-frontend)
- Backend Repository Link: [https://github.com/Harsh2563/flagright-backend](https://github.com/Harsh2563/flagright-backend)
- Frontend Deployed Link: [https://flagright-frontend.vercel.app](https://flagright-frontend.vercel.app)
- Backend Deployed Link: [https://flagright-backend-tvkg.onrender.com](https://flagright-backend-tvkg.onrender.com)

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
  - [Development Setup](#development-setup)
  - [Docker Deployment](#docker-deployment)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Docker Configuration Files](#docker-configuration-files)
- [Folder Structure](#folder-structure)
- [Video Demonstration](#video-demonstration)

---

## Features
- **User Management**: View and manage user profiles and relationships.
- **Transaction Visualization**: Analyze and visualize transaction data.
- **User Relationships**: View connections between users with graph visualization.
- **Transaction Tracking**: Monitor and track financial transactions.
- **Theme Switching**: Support for light and dark themes.
- **Responsive Design**: Optimized for desktop and mobile devices.

---

## Technologies Used
- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **UI Components**: [HeroUI](https://heroui.com/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Data Visualization**: [Cytoscape.js](https://js.cytoscape.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Form Validation**: [Zod](https://zod.dev/)
- **Containerization**: [Docker](https://www.docker.com/)

---

## Setup Instructions

### Development Setup

1. **Clone the Repository**
   ```bash
   https://github.com/Harsh2563/flagright-frontend.git
   cd flagright-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_BASE_URL=YOUR_BACKEND_URL
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

#### Prerequisites
- [Docker](https://www.docker.com/get-started) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine

#### Building and Running with Docker

1. **Build and Run the Docker Container**:

   ```powershell
   # On Windows
   .\deploy.ps1
   ```

   This will:
   - Build the Docker image based on the Dockerfile
   - Start the container in detached mode
   - Expose the application on port 3000

2. **Access the Application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

#### Backend Connection

The application is configured to connect to a backend running on:
```
http://localhost:5000/api
```

If your backend is running on a different URL, you can modify it in the `docker-compose.yml` file under the `environment` section.

#### Managing the Docker Container

- **Stop the container**:
  ```powershell
  docker-compose down
  ```

- **View logs**:
  ```powershell
  docker-compose logs -f
  ```

- **Rebuild the container after changes**:
  ```powershell
  docker-compose up -d --build
  ```

---

## Scripts

| Script | Description |
| :-------- | :------- |
| `npm run dev` | Runs the development server with Turbopack. |
| `npm run build` | Builds the application for production. |
| `npm start` | Starts the production server. |
| `npm run lint` | Runs ESLint to fix code style issues. |

---

## Environment Variables

| Variable | Description |
| :-------- | :------- |
| `NEXT_PUBLIC_API_BASE_URL` | The base URL for the backend API. |

---

## Docker Configuration Files

The following Docker-related files are included in the repository and ready to be pushed to GitHub:

1. **Dockerfile**: Multi-stage build setup for the Next.js application:
   - `deps` stage: Installs dependencies
   - `builder` stage: Builds the Next.js application
   - `runner` stage: Creates a minimal production image

2. **docker-compose.yml**: Configures the Docker container service:
   - Port mapping (3000:3000)
   - Environment variables
   - Health check configuration
   - Host configuration for backend connectivity

3. **.dockerignore**: Excludes unnecessary files from the Docker build:
   - Development files (node_modules, .git)
   - Environment files
   - Documentation and configuration files

4. **deploy.ps1**: PowerShell script for easy deployment:
   - Stops any running containers
   - Builds and starts the container
   - Checks container status

5. **next.config.js**: Configures Next.js for standalone output in Docker.

---

## Folder Structure
```
flagright-visualizer/
├── app/                    # Next.js app directory
│   ├── transactions/       # Transaction-related pages
│   ├── users/              # User-related pages
│   └── visualization/      # Visualization pages
├── components/             # React components
│   ├── common/             # Common components
│   ├── home/               # Home page components
│   ├── navbar/             # Navigation components
│   ├── transaction/        # Transaction-related components
│   ├── ui/                 # UI components
│   └── user/               # User-related components
├── config/                 # Configuration files
├── contexts/               # React context providers
├── helper/                 # Helper functions
├── public/                 # Static files
├── schemas/                # Validation schemas
├── services/               # API services
├── styles/                 # CSS styles
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── .dockerignore           # Docker ignore configuration
├── deploy.ps1              # Docker deployment script
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker build configuration
├── next.config.js          # Next.js configuration
└── package.json            # Project dependencies
```

---

## Video Demonstration

https://github.com/user-attachments/assets/6836de3b-3868-4f05-87f1-d5cb78328914

