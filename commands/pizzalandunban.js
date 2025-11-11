const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('@discordjs/builders');
const { ActionRow, ButtonComponent } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('pizzalandunban').setDescription('Zeigt das Unban-Angebot (300 €).'),
  async execute(interaction) {
    const row = new (require('discord.js').ActionRowBuilder)()
      .addComponents(
        new (require('discord.js').ButtonBuilder)()
          .setLabel('Unban für 300 € kaufen')
          .setStyle(require('discord.js').ButtonStyle.Link)
          .setURL('https://softof.de/')
      );
    await interaction.reply({ content: 'Kaufe dir ein Unban (300 €). Klicke auf den Button, um zur Seite zu gehen.', components: [row] });
  }
};
