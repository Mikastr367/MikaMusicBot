const { SlashCommandBuilder } = require('@discordjs/builders');
const playdl = require('play-dl');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('musikvideo')
    .setDescription('Sendet das Musikvideo (YouTube-Link + Vorschaubild)')
    .addStringOption(o => o.setName('query').setDescription('Song oder YouTube-Link').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const q = interaction.options.getString('query', true);
    try {
      const search = await playdl.search(q, { limit: 1 });
      if (!search || !search.length) return interaction.editReply('Kein Video gefunden.');
      const video = search[0];
      const embed = {
        title: video.title,
        url: video.url,
        description: `Dauer: ${video.durationRaw}`,
        image: { url: video.thumbnail },
        footer: { text: `Quelle: YouTube` }
      };
      return interaction.editReply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      return interaction.editReply('Fehler beim Suchen.');
    }
  }
};
