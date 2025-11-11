const { SlashCommandBuilder } = require('@discordjs/builders');

const questions = [
  { q: 'Welche Farbe hat der Himmel an einem klaren Tag?', a: 'blau' },
  { q: 'Wie viel ist 2+2?', a: '4' },
  { q: 'Wie heißt die Hauptstadt von Deutschland?', a: 'berlin' }
];

module.exports = {
  data: new SlashCommandBuilder().setName('trivia').setDescription('Kleines Quiz-Spiel'),
  async execute(interaction) {
    const pick = questions[Math.floor(Math.random()*questions.length)];
    await interaction.reply({ content: `🧠 Frage: ${pick.q} \n(Schreibe deine Antwort in den Chat, du hast 15s)` });
    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });
    collector.on('collect', m => {
      if (m.content.toLowerCase().includes(pick.a)) m.reply('✅ Richtig!');
      else m.reply(`❌ Falsch. Die richtige Antwort wäre: ${pick.a}`);
    });
    collector.on('end', collected => {
      if (collected.size === 0) interaction.followUp('Zeit abgelaufen!');
    });
  }
};
