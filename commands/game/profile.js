const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

function makeBar (count, max, barLength) {
  const BAR = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];

  let length = (barLength * count / max),
      int = Math.round(length),
      result = BAR[8].repeat(int);

  return (result + '░'.repeat(barLength - result.length));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('상태')
    .setDescription('사용자의 상태를 확인합니다.'),
  permission: 2,
  availableStatus:[null,"탐험","이동"],
  async execute(interaction) {
    const db = interaction.client.db
    const userId = interaction.user.id

    const user = db.prepare('SELECT * FROM user WHERE userId = ?').get(userId)
    const status = db.prepare('SELECT * FROM status WHERE userId = ?').get(userId)
    const level = db.prepare('SELECT * FROM level WHERE userId = ?').get(userId)
    const nickname = user.nickname

    const gameManager = interaction.client.game

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(`${nickname}의 상태`)
      .setDescription(
        `이름: **${nickname}**\n` +
        `레벨: **Lv.${level.level}**\n|${makeBar(level.exp, gameManager.requiredExp(level.level), 15)}| (${level.exp} exp)\n`+ 
        `위치: **${status.location}**\n` +
        `금화: **${status.gold}G**\n` +
        `체력: |${makeBar(status.health, gameManager.maxHealth(userId), 15)}| (${status.health}/${gameManager.maxHealth(userId)})\n` + 
        `마나: |${makeBar(status.mana, gameManager.maxMana(userId), 15)}| (${status.mana}/${gameManager.maxMana(userId)})` 
      )
      .addFields(
        { name: `능력치 (남은 포인트:${level.statPoints})`, value:
          `힘: **${level.str}**\n` +
          `지능: **${level.int}**\n` +
          `체력: **${level.con}**\n` +
          `감각: **${level.per}**\n` +
          `민첩: **${level.dex}**`
        }
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    await interaction.reply({ embeds: [embed] })
  }
}