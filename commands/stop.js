const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Stoppt die Wiedergabe und leert die Queue'),
  async execute(interaction, client) {
    try {
      const queue = client.distube.getQueue(interaction);
      if (!queue) return interaction.reply({ content: 'Nichts in der Queue.', ephemeral: true });
      queue.stop();
      return interaction.reply('⏹ Musik gestoppt und Queue geleert.');
    } catch (e) {
      console.error(e);
      return interaction.reply({ content: 'Fehler beim Stoppen.', ephemeral: true });
    }
  }
};
