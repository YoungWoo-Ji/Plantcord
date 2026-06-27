const { EmbedBuilder } = require("discord.js")

module.exports = {
  name:"ignore",
  permission:2,
  availableStatus:['탐험'],
  async execute(interaction) {
    await interaction.update({components:[]})

    const userId = interaction.user.id
    const db = interaction.client.db
    const userStatus = db.prepare("SELECT * FROM status WHERE userId=?").get(userId)
    const location = userStatus.location

    const msgList = [
      `불필요한 위험을 감수할 필요는 없습니다.\n당신은 냉정하게 상황을 판단하고 자리를 떠났습니다.`,
      `체력과 자원을 아끼는 것도 훌륭한 전략입니다.\n당신은 소모적인 탐색을 포기하고 자리를 떠났습니다.`,
      `모험에는 때론 무시가 미덕일 때도 있는 법입니다.\n당신은 안전한 길을 선택했습니다.`,
      `선택하지 않은 길에는 언제나 비밀이 남는 법입니다.\n당신은 그 비밀을 묻어둔 채 전진합니다.`
    ]

    const embed = new EmbedBuilder()
      .setTitle('탐험')
      .setColor('Green')
      .setDescription(
        '```\n'+
        `${msgList[Math.floor(Math.random()*msgList.length)]}\n`+
        
        '```'
      )
    
    // 상태 변경
    db.prepare('UPDATE status SET status=?, changeAt=? WHERE userId=?')
      .run(null,Date.now(),userId)

    await interaction.followUp({embeds:[embed]})

  }
}