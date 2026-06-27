const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('소지품')
    .setDescription('소지품을 확인합니다.'),
  permission: 2,
  availableStatus:[null,"탐험","전투", "이동"],
  async execute(interaction) {
    const userId = interaction.user.id
    const db = interaction.client.db
    const userNickname = db.prepare("SELECT nickname FROM user WHERE userId=?")
      .get(userId).nickname
    const inv = db.prepare("SELECT * FROM inventory WHERE userId = ?")
      .all(userId)
    const invMap = new Map(inv.map(slot=>[slot.slotIndex,slot]))
    const maxSlot = interaction.client.game.maxSlot(userId)
    const displayLines = []

    for(let i = 1; i<=maxSlot; i++){
      if(invMap.has(i)){
        const slot = invMap.get(i)
        displayLines.push(`[${i}] ${slot.item} x ${slot.amount}`)
      }else{
        displayLines.push(`[${i}]`)
      }
    }

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('소지품')
      .setDescription(`현재 ${userNickname}님이 소지하고 있는 물품입니다.\n`+'```\n'+displayLines.join('\n')+'\n```')

    await interaction.reply({embeds:[embed]})
  }
}