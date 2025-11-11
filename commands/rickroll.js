const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('rickroll').setDescription('Rickroll someone'),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Open link')
        .setStyle(ButtonStyle.Link)
        .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    );
    await interaction.reply({ content: 'Get rickrolled', components: [row] });
  }
};

