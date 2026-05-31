const { SlashCommandBuilder, EmbedBuilder,MessageFlags, AttachmentBuilder } = require("discord.js");
const Database = require('better-sqlite3')

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('회원가입')
		.setDescription('회원가입을 진행합니다.')
    .setDMPermission(false),
  permission:1,
	async execute(interaction) {

    const db = new Database('DB/user.db')
    const find = db.prepare('SELECT * FROM user WHERE user_id=?')
    const user = find.get(interaction.user.id)

    //동일 회원 존재여부 확인
    if (user){
      db.close()
      await interaction.reply({flags:MessageFlags.Ephemeral, content:'⚠️ 이미 회원으로 등록되었습니다.'})
      return
    }

    const insert = db.prepare('INSERT INTO user (user_id,date) VALUES (?,?)')
    insert.run(interaction.user.id,Date.now())
    db.close
    
    const embed = new EmbedBuilder()
      .setColor('Purple')
      .setTitle("회원가입이 완료되었습니다.")
      .setDescription("ㅊㅋ")
      .addFields(
        {name:"❓ 이제 뭘 해야하죠?", value:"저도 모르겠네요"}
      )

		await interaction.reply({embeds:[embed]});
  }
}