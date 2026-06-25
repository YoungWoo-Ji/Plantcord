const { EmbedBuilder, MessageFlags } = require('discord.js')

module.exports = {
  name:"confirm",
  permission:2,
  async execute(interaction){
    const db = interaction.client.db
    const find = db.prepare('SELECT * FROM user WHERE user_id=?')
    const user = find.get(interaction.user.id)

    //동일 회원 존재여부 확인
    if (!user){
      await interaction.reply({flags:MessageFlags.Ephemeral ,content:'⚠️ 아직 회원가입하지 않으셨습니다.'})
      return
    }

    //데이터 삭제 절차
    //user에서 삭제
    db.prepare('DELETE FROM user WHERE user_id=?')
      .run(interaction.user.id)

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle('회원탈퇴가 완료되었습니다.')
      .setDescription('그동안 함께해주셔서 감사합니다.')

    await interaction.update({embeds:[embed],components:[]})
  }
}