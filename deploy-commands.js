const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); // falls du lokal testest

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error("⚠️ Bitte DISCORD_TOKEN, CLIENT_ID und GUILD_ID in den Umgebungsvariablen setzen!");
  process.exit(1);
}

const commands = [];
const commandsPath = './commands';
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`${commandsPath}/${file}`);
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`🚀 Starte Slash Commands Deployment für Guild ${guildId}...`);
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
    console.log('✅ Slash Commands erfolgreich registriert!');
  } catch (err) {
    console.error(err);
  }
})();
