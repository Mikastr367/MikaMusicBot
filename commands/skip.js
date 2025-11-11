const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Überspringt den aktuellen Song'),
  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue) return interaction.reply({ content: 'Nichts in der Queue.', ephemeral: true });
      await queue.skip();
      return interaction.reply('⏭ Übersprungen.');
    } catch (e) {
      console.error(e);
      return interaction.reply({ content: 'Fehler beim Überspringen.', ephemeral: true });
    }
  }
};
