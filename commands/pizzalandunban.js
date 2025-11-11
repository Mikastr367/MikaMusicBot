const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('pizzalandunban').setDescription('Zeigt das Unban Angebot'),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Unbann kaufen 300 EUR')
        .setStyle(ButtonStyle.Link)
        .setURL('https://softof.de/')
    );
    await interaction.reply({
      content: 'Unbann Angebot: Klicke auf den Button um zum Kauf weitergeleitet zu werden. Hinweis: handle stets sicher und vertraue nur legitimen Anbietern.',
      components: [row],
      ephemeral: false
    });
  }
};
