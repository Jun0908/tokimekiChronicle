
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

- **NEXT_PUBLIC_PRIVY_APP_ID**: Obtain from [Privy](https://www.privy.io/)
- **NEXT_PUBLIC_ALCHEMY_API_KEY**: Obtain from [Alchemy](https://www.alchemy.com/)
- **OPENAI_API_KEY**: Obtain from [OpenAI](https://platform.openai.com/api-keys)
- **PINATA_JWT**: Obtain from [Pinata](https://www.pinata.cloud/)
- **NEXT_PUBLIC_GATEWAY_URL**: [Pinata](https://www.pinata.cloud/)
- **PINECONE_API_KEY**: Obtain from [Pinecone](https://www.pinecone.io/)
- **NEXT_PUBLIC_ALICE_PRIVATE_KEY**: This should be your Alice account private key (use with caution).
- **OPEN_WEATHER_API_KEY**: Obtain from [OpenWeather API](https://hibi-update.org/other/openweathermap-api/)
- **SEPOLIA_RPC_URL**: Ob[Alchemy](https://www.alchemy.com/)

### 2. Starting Docker

To launch the Docker containers, run the following command in your terminal:

```bash
docker-compose up
```

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


# Clone the repository (update the repository URL accordingly)
```bash
git clone git@github.com:Jun0908/tokimekiChronicle.git
```

# Change to the project directory
```bash
cd frontend
```

# Install dependencies
```bash
yarn install
```

# Start the development server
```bash
yarn run dev
```
The development server should now be running, and you can access the application in your browser at the indicated local address.


License
This project is licensed under the MIT License. Feel free to use and modify the code as per the license terms.

