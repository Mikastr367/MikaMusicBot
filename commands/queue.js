const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Zeigt die Queue'),
  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue || !queue.songs || queue.songs.length === 0) return interaction.reply('Queue ist leer.');
      const list = queue.songs.map((s, i) => `${i === 0 ? '▶️' : `${i}.`} ${s.name} (${s.formattedDuration})`).slice(0, 10).join('\n');
      return interaction.reply(`📜 Queue:\n${list}`);
    } catch (e) {
      console.error(e);
      return interaction.reply({ content: 'Fehler beim Laden der Queue.', ephemeral: true });
    }
  }
};
