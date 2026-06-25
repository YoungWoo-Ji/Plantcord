const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('도움말')
		.setDescription('어플의 모든 명령어를 확인합니다.')
    .setDMPermission(false),

	async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('❓ 도움말')
      .setDescription('어플의 모든 명령어입니다.')
      .addFields(
        {name:'💎 카테고리',value:
          '`/명령어`: 설명\n'
        }
      )
    await interaction.reply({embeds:[embed]})
  } 
}