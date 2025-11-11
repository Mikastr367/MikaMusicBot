const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { DisTube } = require('distube');
const playdl = require('play-dl');

// Client initialisieren
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// Commands einlesen
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
  }
}

// DisTube instance
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  savePreviousSongs: true,
  emitAddListWhenCreatingQueue: false
});

// DisTube Events
client.distube
  .on('playSong', (queue, song) => {
    queue.textChannel?.send(`▶️ Jetzt spielt: **${song.name}**`);
  })
  .on('addSong', (queue, song) => {
    queue.textChannel?.send(`➕ Zur Queue hinzugefügt: **${song.name}**`);
  })
  .on('finish', queue => {
    queue.textChannel?.send('✅ Queue fertig.');
  })
  .on('error', (channel, e) => {
    console.error(e);
    channel?.send('Fehler mit DisTube: ' + String(e));
  });

// Interactions
client.on('interactionCreate', async interaction => {
  // Slash Commands
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return interaction.reply({ content: 'Command nicht gefunden', ephemeral: true });
    try {
      await cmd.execute(interaction, client);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Fehler beim Ausführen des Commands', ephemeral: true });
    }
  }

  // Buttons (z.B. Rock Paper Scissors)
  if (interaction.isButton()) {
    const id = interaction.customId;
    
    if (id.startsWith('rps_')) {
      const choice = id.split('_')[1];
      const options = ['rock','paper','scissors'];
      const botChoice = options[Math.floor(Math.random() * 3)];
      const win = (c, b) => (c === 'rock' && b === 'scissors') || (c === 'scissors' && b === 'paper') || (c === 'paper' && b === 'rock');
      let resultText = `Du: **${choice}** — Bot: **${botChoice}**\n`;
      if (choice === botChoice) resultText += "Unentschieden!";
      else if (win(choice, botChoice)) resultText += "Du gewinnst!";
      else resultText += "Du verlierst!";
      await interaction.update({ content: resultText, components: [] });
    }
  }
});

// Ready Event
client.once('ready', async () => {
  console.log('✅ Bot ready:', client.user.tag);
  if (await playdl.is_expired()) {
    await playdl.refreshToken();
  }
});

// Token aus Umgebungsvariable einlesen
const token = process.env.DISCORD_TOKEN;
if (!token || typeof token !== 'string') {
  console.error('⚠️ Fehler: Bot-Token fehlt oder ist ungültig! Bitte Umgebungsvariable DISCORD_TOKEN setzen.');
  process.exit(1);
}

// Bot starten
client.login(token);

