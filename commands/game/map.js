const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const mapData = require('../../data/map.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('지도')
    .setDescription('현재 위치정보를 확인합니다.'),
  permission: 2,
  availableStatus:[null,"탐험"],
  async execute(interaction) {
    const db = interaction.client.db
    const userStatus = db.prepare('SELECT * FROM status WHERE userId=?').get(interaction.user.id)
    const location = mapData[userStatus.location]

    if (!location) {
      await interaction.reply({ content: '⚠️ 현재 위치를 찾을 수 없습니다. 관리자에게 문의하세요.', flags: MessageFlags.Ephemeral })
      return
    }

    const paths = (location.paths || [])
      .map((pathId, index) => `[${index + 1}] ${pathId}`)
      .join('\n') || '이동 가능한 경로가 없습니다.'

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(userStatus.location)
      .setDescription(location.description)
      .addFields(
        { name: '이동', value: paths }
      )

    await interaction.reply({ embeds: [embed] })
  }
}