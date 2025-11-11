require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

// globale Fehlerbehandlung
process.on('unhandledRejection', err => console.error('Unhandled promise rejection:', err));
client.on('error', err => console.error('Discord client error:', err));

// Commands laden
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const cmd = require(path.join(commandsPath, file));
    client.commands.set(cmd.data.name, cmd);
  }
}

// Interaction handler
client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return interaction.reply({ content: 'Command nicht gefunden', ephemeral: true });
      await cmd.execute(interaction, client);
    } else if (interaction.isButton()) {
      // zentrale Button-Logik für Fälle wo ein Command keine eigene Button-Handler hat
      const id = interaction.customId;
      // rps buttons
      if (id.startsWith('rps_')) {
        const choice = id.split('_')[1];
        const options = ['rock', 'paper', 'scissors'];
        const botChoice = options[Math.floor(Math.random() * 3)];
        const win = (c, b) => (c === 'rock' && b === 'scissors') || (c === 'scissors' && b === 'paper') || (c === 'paper' && b === 'rock');
        let result = `Du: **${choice}** — Bot: **${botChoice}**\n`;
        if (choice === botChoice) result += 'Unentschieden!';
        else if (win(choice, botChoice)) result += 'Du gewinnst!';
        else result += 'Du verlierst!';
        await interaction.update({ content: result, components: [] });
      }
    }
  } catch (err) {
    console.error('Interaction error:', err);
    if (interaction.replied || interaction.deferred) {
      try { await interaction.followUp({ content: 'Fehler beim Ausführen', ephemeral: true }); } catch {}
    } else {
      try { await interaction.reply({ content: 'Fehler beim Ausführen', ephemeral: true }); } catch {}
    }
  }
});

client.once('ready', () => {
  console.log('✅ Bot ready:', client.user.tag);
});

// Token prüfen und starten
const token = process.env.DISCORD_TOKEN;
if (!token || typeof token !== 'string') {
  console.error('Bot-Token fehlt. Bitte DISCORD_TOKEN setzen.');
  process.exit(1);
}
client.login(token);
