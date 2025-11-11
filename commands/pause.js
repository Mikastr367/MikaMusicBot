const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder().setName('pause').setDescription('Pausiert die Musik'),
  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue) return interaction.reply({ content: 'Nichts in der Queue.', ephemeral: true });
      queue.pause();
      return interaction.reply('⏸ Musik pausiert.');
    } catch (e) {
      console.error(e);
      return interaction.reply({ content: 'Fehler beim Pausieren.', ephemeral: true });
    }
  }
};
