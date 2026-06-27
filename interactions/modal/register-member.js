const { EmbedBuilder, MessageFlags } = require('discord.js')

// 회원가입 시 사용할 수 없는 이름들
const FORBIDDEN_NICKNAMES = [
  // 관리 관련
  '관리자',
  '운영자',
  '관리팀',
  '운영팀',
  '지원팀',
  '운영진',
  // 개발 관련
  '개발자',
  '개발팀',
  '프로그래머',
  // 특수 역할
  '모더레이터',
  '관리',
  '운영',
  // 시스템 관련
  '시스템',
  '서버',
  'bot',
  'BOT',
  'Bot',
  'admin',
  'Admin',
  'administrator',
  'developer',
  'developer_team',
  'moderator',
  'support',
  'official',
  'server',
  'system',
  'test',
  '테스트',
  // 특수 이름
  'system_admin',
  'discord',
  'Discord',
  '디스코드',
  'root',
  'superuser'
]

module.exports = {
  name: 'register-member',
  permission: 1,
  async execute(interaction) {
    const nickname = interaction.fields.getTextInputValue('nickname').trim()
    if (!nickname) {
      await interaction.reply({ flags: MessageFlags.Ephemeral, content: '⚠️ 닉네임을 입력해주세요.' })
      return
    }

    const nicknameRegex = /^[가-힣a-zA-Z0-9_]{1,16}$/
    if (!nicknameRegex.test(nickname)) {
      await interaction.reply({ flags: MessageFlags.Ephemeral, content: '⚠️ 닉네임은 1~16자이며, 한글/영문/숫자/_만 사용할 수 있습니다.' })
      return
    }

    // 금지된 이름 확인 (대소문자 구분 안 함)
    if (FORBIDDEN_NICKNAMES.some(forbidden => forbidden.toLowerCase() === nickname.toLowerCase())) {
      await interaction.reply({ flags: MessageFlags.Ephemeral, content: '⚠️ 사용할 수 없는 닉네임입니다.' })
      return
    }

    const db = interaction.client.db
    const existingUser = db.prepare('SELECT * FROM user WHERE userId=?').get(interaction.user.id)
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
      // 트랜잭션으로 모든 INSERT를 한 번에 처리
      const registerTransaction = db.transaction(() => {
        db.prepare('INSERT INTO user (userId, date, nickname) VALUES (?, ?, ?)')
          .run(interaction.user.id, Date.now(), nickname)
        db.prepare('INSERT INTO status (userId,location,gold,health,mana,changeAt) VALUES (?, ?, ?, ?, ?, ?)')
          .run(interaction.user.id, '도토리 마을', 300, 100, 100, Date.now())
        db.prepare('INSERT INTO level (userId,level,exp,statPoints,str,int,con,per,dex) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .run(interaction.user.id, 1, 0, 3, 0, 0, 0, 0, 0)
      })
      
      // 트랜잭션 실행
      registerTransaction()
    } catch (error) {
      console.error(error)
      await interaction.reply({ flags: MessageFlags.Ephemeral, content: '⚠️ 회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' })
      return
    }

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('회원가입 완료')
      .setDescription(`**${nickname}**님 환영합니다!`)
      .addFields({ name: '어떻게 시작하나요?', value: '도움말 명령어를 사용해보세요!' })

    await interaction.reply({ embeds: [embed] })
  }
}
