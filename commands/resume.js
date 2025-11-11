const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder().setName('resume').setDescription('Fortsetzen'),
  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue) return interaction.reply({ content: 'Nichts in der Queue.', ephemeral: true });
      queue.resume();
      return interaction.reply('▶️ Fortgesetzt.');
    } catch (e) {
      console.error(e);
      return interaction.reply({ content: 'Fehler beim Fortsetzen.', ephemeral: true });
    }
  }
};
