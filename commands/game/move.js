const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js')
const {setTimeout} = require('node:timers/promises');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('이동')
    .setDescription('다른 지역으로 이동합니다')
    .addIntegerOption((option)=>option.setName('번호').setDescription('현재 위치에서 이동할 지역의 번호를 적어주세요.').setRequired(true).setMinValue(1)),
  permission: 2,
  async execute(interaction) {
    const userId = interaction.user.id
    const userStatus = interaction.client.db.prepare('SELECT location FROM status WHERE userId = ?').get(userId)
    const location = userStatus.location
    const mapData = interaction.client.maps
    const locationData = mapData[location]

    const choice = interaction.options.getInteger('번호')

    // 범위 초과
    if(choice>locationData.paths.length){
      await interaction.reply({content:"⚠️ 해당 위치는 존재하지 않습니다.", flags:MessageFlags.Ephemeral})
      return
    }

    // 이동 임베드
    const destination = locationData.paths[choice-1]
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('이동')
      .setDescription(
        '```\n'+
        `당신은 ${destination}(으)로 이동합니다...\n`+
        '```'
      )
    // 상태 변경
    interaction.client.db.prepare('UPDATE status SET status=?, changeAt=? WHERE userId=?')
      .run('이동',Date.now(),userId)

    await interaction.reply({embeds:[embed]})

    // 5~7초 랜덤 대기
    const waitTime = Math.floor(Math.random() * 3000) + 5000;
    await setTimeout(waitTime)

    // 이동 완료 임베드
    embed
      .setTitle('이동 완료')
      .setDescription(
        '```\n'+
        `당신은 ${destination}에 도착했습니다!\n`+
        '```'
      )
    // 상태 변경
    interaction.client.db.prepare('UPDATE status SET status=?, changeAt=?,location=? WHERE userId=?')
      .run(null,Date.now(),destination,userId)
      
    await interaction.followUp({embeds:[embed]})

  }
}