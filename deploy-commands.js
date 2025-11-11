const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

// Token und Client ID aus Umgebungsvariablen
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID; // Dein Bot Client ID
const guildId = process.env.GUILD_ID;   // Optional: für Testserver, schneller

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`🚀 Registriere ${commands.length} Commands...`);

    // Auf Guild Ebene (schneller zum testen)
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    // Oder global (dauert bis zu 1h bis es überall sichtbar ist)
    // await rest.put(
    //   Routes.applicationCommands(clientId),
    //   { body: commands }
    // );

    console.log('✅ Commands erfolgreich registriert.');
  } catch (error) {
    console.error(error);
  }
})();
