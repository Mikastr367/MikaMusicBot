const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Spielt einen Song (YouTube-Link oder Suchbegriff)')
    .addStringOption(opt => opt.setName('song').setDescription('Link oder Suchbegriff').setRequired(true)),
  async execute(interaction, client) {
    await interaction.deferReply();
    const query = interaction.options.getString('song', true);
    const voice = interaction.member.voice.channel;
    if (!voice) return interaction.editReply('Du musst in einem Voice-Channel sein!');
    try {
      await client.distube.play(voice, query, { member: interaction.member, textChannel: interaction.channel });
      return interaction.editReply(`⏳ Suche nach: **${query}**`);
    } catch (e) {
      console.error(e);
      return interaction.editReply('Fehler beim Abspielen.');
    }
  }
};
