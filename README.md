<h1 align="center">NoBrainBot</h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

## Requirements

1. NPM
2. A Discord CLIENT_ID and Bot TOKEN from the [discord developer portal](https://discord.com/developers/applications/1053508186050670643/bot)

## Deployment

### Local
1. Clone repo
2. Install dependencies with command `npm install` or `yarn`
3. Rename `.env.example` as `.env` and fill all values
4. Add bot to your server with this invite `https://discord.com/oauth2/authorize?client_id=YOUR_BOTS_CLIENT_ID&scope=applications.commands`
5. Run with `node app.js` to launch auto reloading server and run `node deploy-commands` to send the commands to connected servers

## Development
1. Clone repo
2. Install dependencies with command `npm install` or `yarn`
3. Rename `.env.example` as `.env` and fill all values
4. Add bot to your server with this invite `https://discord.com/oauth2/authorize?client_id=YOUR_BOTS_CLIENT_ID&scope=applications.commands`
5. Run with `nodemon app.js` to launch auto reloading server and run `node deploy-commands` to register the slash commands with connected servers

### Docker Development
1. `docker build . -t <YOURNAME/PROJECT>`
2. `docker run -d -p 49160:8080 --env-file=.env loganinak/nobrainbot`
