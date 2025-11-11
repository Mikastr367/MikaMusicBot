const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('rps').setDescription('Rock Paper Scissors gegen den Bot'),
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('rps_rock').setLabel('✊ Rock').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('rps_paper').setLabel('✋ Paper').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('rps_scissors').setLabel('✌️ Scissors').setStyle(ButtonStyle.Primary)
      );
    await interaction.reply({ content: 'Wähle: Rock, Paper oder Scissors', components: [row] });
  }
};
