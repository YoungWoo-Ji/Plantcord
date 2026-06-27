const { EmbedBuilder } = require('discord.js')

module.exports = {
  name:"cancel",
  permission:2,
  async execute(interaction){

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('회원탈퇴 절차가 취소되었습니다.')
      .setDescription('계속해서 게임을 즐기실 수 있습니다.')

    await interaction.update({embeds:[embed],components:[]})
  }
}