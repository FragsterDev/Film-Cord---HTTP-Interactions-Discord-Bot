# 🎬 Film Cord — HTTP Interactions Discord Bot

A movie-focused Discord bot built with **Node.js, Express, and Discord's HTTP Interactions API**.

Instead of maintaining a persistent Discord Gateway/WebSocket connection, the bot receives Discord interactions through an HTTP endpoint and responds to slash commands and message components.

## ✨ Features

- 🎬 Movie-focused Discord commands
- ⚡ Discord HTTP Interactions API
- 🔗 Slash command handling
- 🖱️ Button interaction handling
- 🎞️ TMDB integration for movie-related data
- 🗄️ PostgreSQL database integration
- 🧩 Modular command architecture
- 🔐 Discord interaction signature verification
- 🌱 Environment variable configuration with `dotenv`
- 🚀 Express-based HTTP server

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **Discord Interactions API**
- **discord-interactions**
- **PostgreSQL**
- **TMDB API**
- **dotenv**

## 📁 Project Structure

```text
Film-Cord---HTTP-Interactions-Discord-Bot/
│
├── commands/
├── constants/
├── data/
├── entities/
├── helpers/
├── services/
│   └── tmdb_service/
├── ui/
│   └── components/
├── index.js
├── register_commands.js
├── package.json
└── .env
```

## 🔄 How It Works

```text
Discord
   │
   │ HTTP Interaction
   ▼
Express Server
   │
   ├── Verify Discord Signature
   │
   ├── PING
   │     └── PONG
   │
   ├── Slash Command
   │     └── Command Handler
   │
   └── Button Interaction
         └── Button Handler
```

The Express application exposes an `/interactions` endpoint. Discord sends interaction payloads to this endpoint, where the request signature is verified using the application's public key.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/FragsterDev/Film-Cord---HTTP-Interactions-Discord-Bot.git
cd Film-Cord---HTTP-Interactions-Discord-Bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and provide the credentials required by the application.

### 4. Register Discord commands

```bash
node register_commands.js
```

### 5. Start the bot

```bash
npm run dev
```

The server runs on the port configured through the environment variables.

## 🌐 Discord Interaction Endpoint

The bot expects Discord interactions at:

```text
POST /interactions
```

The endpoint uses Discord's public key to verify incoming requests before processing them.

For local development, expose the server through a publicly accessible HTTPS URL using a tunneling service such as ngrok or Cloudflare Tunnel.

Set the Discord application's Interactions Endpoint URL to:

```text
https://your-domain.com/interactions
```

## 🎞️ Movie Data

The project includes a dedicated TMDB service for retrieving movie-related information.

TMDB is used as the external movie-data source for the bot.

## 🧩 Command Architecture

Commands are organized as independent modules.

Each command exposes:

```javascript
{
    data,
    execute
}
```

The application loads command modules from the `commands/` directory, making it possible to add new commands without modifying the main interaction server.

## 🖱️ Button Interactions

The bot supports Discord message component interactions.

Button events are routed separately from slash commands and handled through dedicated button handlers.

## 🔒 Security

Do **not** commit your `.env` file or expose API credentials.

Keep the following private:

- Discord credentials
- Discord application secrets
- PostgreSQL credentials
- TMDB API keys

Discord interaction signatures are verified using the application's public key before interactions are processed.

## 📌 Project Status

This project explores:

- Discord's HTTP Interactions API
- Event-driven application architecture
- Modular command design
- HTTP-based Discord bots
- External API integration
- PostgreSQL-backed applications

## 👨‍💻 Author

**Pratik Sharma**

- GitHub: [@FragsterDev](https://github.com/FragsterDev)

## 📄 License

This project is licensed under the ISC License.
