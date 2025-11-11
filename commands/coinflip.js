const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('coinflip').setDescription('Wirft eine Münze'),
  async execute(interaction) {
    const res = Math.random() < 0.5 ? 'Kopf' : 'Zahl';
    await interaction.reply(`Die Münze zeigt: **${res}**`);
  }
};
