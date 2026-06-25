const { EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
  name: 'register-member',
  permission: 1,
  async execute(interaction) {
    const nickname = interaction.fields.getTextInputValue('nickname').trim()
    if (!nickname) {
      await interaction.reply({ flags: MessageFlags.Ephemeral, content: '⚠️ 닉네임을 입력해주세요.' })
      return
    }

    const nicknameRegex = /^[가-힣a-zA-Z0-9_]{3,16}$/
    if (!nicknameRegex.test(nickname)) {
      await interaction.reply({ flags: MessageFlags.Ephemeral, content: '⚠️ 닉네임은 3~16자이며, 한글/영문/숫자/_만 사용할 수 있습니다.' })
      return
    }

    const db = interaction.client.db
    const existingUser = db.prepare('SELECT * FROM user WHERE user_id=?').get(interaction.user.id)
    if (existingUser) {
      await interaction.reply({ flags: MessageFlags.Ephemeral, content: '⚠️ 이미 회원으로 등록된 사용자입니다.' })
      return
    }

    const existingNickname = db.prepare('SELECT * FROM user WHERE nickname=?').get(nickname)
    if (existingNickname) {
      await interaction.reply({ flags: MessageFlags.Ephemeral, content: '⚠️ 이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.' })
      return
    }

    try {
      db.prepare('INSERT INTO user (user_id, date, nickname) VALUES (?, ?, ?)')
        .run(interaction.user.id, Date.now(), nickname)
    } catch (error) {
      console.error(error)
      await interaction.reply({ flags: MessageFlags.Ephemeral, content: '⚠️ 회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' })
      return
    }

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('회원가입 정보 등록 완료')
      .setDescription(`닉네임 ${nickname}으로 등록되었습니다.`)
      .addFields({ name: '🎉 환영합니다!', value: '이제 회원 기능을 사용할 수 있습니다.' })

    await interaction.reply({ embeds: [embed] })
  }
}
