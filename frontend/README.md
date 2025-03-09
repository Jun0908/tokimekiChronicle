# Project Title

A brief description of your project, built with Next.js (TypeScript & App Router), Shadcn/UI, and Tailwind CSS. This project leverages multiple external APIs and Docker for containerization.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1. Obtain API Keys](#1-obtain-api-keys)
  - [2. Starting Docker](#2-starting-docker)
  - [3. Starting the Frontend](#3-starting-the-frontend)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

This project is designed to serve as a modern web application utilizing Next.js with TypeScript, enhanced by the App Router, Shadcn/UI, and Tailwind CSS. It integrates several external APIs for functionality including blockchain, authentication, weather data, AI services, and cryptocurrency information. Docker is used for containerization to simplify deployment.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Yarn](https://yarnpkg.com/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)

## Setup Instructions

### 1. Obtain API Keys

Before running the application, copy the provided `.env.sample` file to `.env` and add the following API keys:

- **NEXT_PUBLIC_ALCHEMY_API_KEY**: Obtain from [Alchemy](https://www.alchemy.com/)
- **NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID**: Obtain from [Web3 Auth](https://web3auth.io/)
- **OPEN_WEATHER_API_KEY**: Obtain from [OpenWeather API](https://hibi-update.org/other/openweathermap-api/)
- **OPENAI_API_KEY**: Obtain from [OpenAI](https://platform.openai.com/api-keys)

### 2. Starting Docker

To launch the Docker containers, run the following command in your terminal:

```bash
docker-compose up
```

This command will start all services defined in your docker-compose.yml file.

3. Starting the Frontend
Follow these steps to set up and run the frontend application:

bash
コピーする
# Clone the repository (update the repository URL accordingly)
git clone git@github.com:your_username/your_repository.git

# Change to the project directory
cd frontend

# Install dependencies
yarn install

# Start the development server
yarn run dev
The development server should now be running, and you can access the application in your browser at the indicated local address.

Troubleshooting
Docker Issues: If Docker does not start correctly, check the logs using docker-compose logs to identify potential issues.
Dependency Problems: Ensure that all dependencies are properly installed by running yarn install in the frontend directory.
API Key Errors: Verify that your .env file has the correct API keys and that they are active.
Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements, bug fixes, or feature suggestions.

License
This project is licensed under the MIT License. Feel free to use and modify the code as per the license terms.


