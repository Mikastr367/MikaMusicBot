const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { DisTube } = require('distube');
const playdl = require('play-dl');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// DisTube instance
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  savePreviousSongs: true,
  emitAddListWhenCreatingQueue: false
});

// simple Distube event logging
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

// Interaction handling
client.on('interactionCreate', async interaction => {
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

  // Button interactions for RPS and pizzalandunban etc.
  if (interaction.isButton()) {
    // RPS buttons format: rps_rock, rps_paper, rps_scissors
    const id = interaction.customId;
    if (id && id.startsWith('rps_')) {
      const choice = id.split('_')[1];
      const options = ['rock','paper','scissors'];
      const botChoice = options[Math.floor(Math.random()*3)];
      const win = (c, b) => (c === 'rock' && b === 'scissors') || (c === 'scissors' && b === 'paper') || (c === 'paper' && b === 'rock');
      let resultText = `Du: **${choice}** — Bot: **${botChoice}**\n`;
      if (choice === botChoice) resultText += "Unentschieden!";
      else if (win(choice, botChoice)) resultText += "Du gewinnst!";
      else resultText += "Du verlierst!";
      await interaction.update({ content: resultText, components: [] });
    }
  }
});

client.once('ready', async () => {
  console.log('✅ Bot ready:', client.user.tag);
  // ensure play-dl is ready for YouTube
  if (await playdl.is_expired()) {
    await playdl.refreshToken(); // best effort
  }
});

client.login(MTQzNzUyNjA2NzMyNDkxMTc3Mg.Gm2G7h.gT28jOEstozVrCvxb9Ixx2QF5TeE6Q6uHNVj6U);
