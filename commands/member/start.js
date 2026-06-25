const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require("discord.js");

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('회원가입')
		.setDescription('회원가입을 진행합니다.')
    .setDMPermission(false),
  permission:1,
	async execute(interaction) {

    const db = interaction.client.db
    const user = db.prepare('SELECT * FROM user WHERE user_id=?').get(interaction.user.id)

    // 동일 회원 존재여부 확인
    if (user){
      await interaction.reply({flags:MessageFlags.Ephemeral, content:'⚠️ 이미 회원으로 등록되었습니다.'})
      return
    }

    const modal = new ModalBuilder()
      .setCustomId('register-member')
      .setTitle('회원가입')

    const nicknameInput = new TextInputBuilder()
      .setCustomId('nickname')
      .setLabel('이름(닉네임)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('게임 내에서 사용할 이름을 입력해주세요.')
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(16)

    const row = new ActionRowBuilder().addComponents(nicknameInput)
    modal.addComponents(row)

    await interaction.showModal(modal)
  }
}