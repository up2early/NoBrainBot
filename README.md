<h1 align="center">Welcome to Discord Stable Diffusion Slash Bot</h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

## Requirements

1. NPM
2. A Discord CLIENT_ID and Bot TOKEN
3. An ImgBB API key

## Usage

1. Clone repo
2. Install dependencies with command `npm install` or `yarn`
3. Rename `.env.example` as `.env` and fill required blanks
4. Add bot to your server with this invite `https://discord.com/oauth2/authorize?client_id=YOUR_BOTS_CLIENT_ID&scope=applications.commands`
5. For development use `nodemon app.js | pino-pretty -L debug` to launch auto reloading server
6. For production use `node app.js` to run