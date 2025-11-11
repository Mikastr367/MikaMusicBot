const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Zeigt die Latenz an'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const diff = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! Latenz: ${diff} ms`);
  }
};
