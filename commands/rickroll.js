const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder().setName('rickroll').setDescription('Rickroll someone or yourself (plays Rick Astley).')
    .addUserOption(u => u.setName('user').setDescription('Optional: Zielperson')),
  async execute(interaction, client) {
    await interaction.deferReply();
    const voice = interaction.member.voice.channel;
    if (!voice) {
      return interaction.editReply('Du musst in einem Voice-Channel sein, damit ich rickrollen kann!');
    }
    const target = interaction.options.getUser('user');
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    await client.distube.play(voice, url, { member: interaction.member, textChannel: interaction.channel });
    return interaction.editReply(`🎵 Rickroll gestartet ${target ? `gegen ${target}` : ''}`);
  }
};
