const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Setzt einen Audio-Filter (z. B. bassboost, nightcore, echo)')
    .addStringOption(o => o.setName('name').setDescription('filter name').setRequired(true)
      .addChoices(
        { name: 'bassboost', value: 'bassboost' },
        { name: 'nightcore', value: 'nightcore' },
        { name: '3d', value: '3d' },
        { name: 'echo', value: 'echo' },
        { name: 'vaporwave', value: 'vaporwave' }
      )),
  async execute(interaction, client) {
    const filter = interaction.options.getString('name', true);
    try {
      // Distube setFilter expects a "message-like" object; interaction works in many setups
      await client.distube.setFilter(interaction, filter);
      return interaction.reply(`🔊 Filter gesetzt: ${filter}`);
    } catch (e) {
      console.error(e);
      return interaction.reply({ content: 'Fehler beim Anwenden des Filters.', ephemeral: true });
    }
  }
};
