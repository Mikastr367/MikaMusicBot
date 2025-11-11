1) Set environment variables:
   - TOKEN (Discord Bot Token)
   - CLIENT_ID (Application client id)
   - GUILD_ID (Test server id for deploy script)

2) Run locally:
   npm install
   npm run deploy-commands   # registers slash commands to your guild
   npm start                # starts bot

3) For Koyeb:
   - Push repo to GitHub
   - Connect repo in Koyeb (Deploy from GitHub)
   - Add env var TOKEN (and optionally CLIENT_ID, GUILD_ID for command deploy)
