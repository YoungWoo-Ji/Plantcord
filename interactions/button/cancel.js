const { EmbedBuilder } = require('discord.js')

module.exports = {
  name:"cancel",
  permission:2,
  async execute(interaction){

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('회원탈퇴 절차가 취소되었습니다.')
      .setDescription('bb')

    await interaction.update({embeds:[embed],components:[]})
  }
}