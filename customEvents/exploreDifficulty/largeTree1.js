const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
  name:'거대한 나무 발견',
  async execute(interaction){
    let embed
    const button = new ButtonBuilder()
      .setEmoji('🎲')
      .setLabel('주사위 굴리기')
      .setStyle(ButtonStyle.Secondary)
    const choice = interaction.values[0]
    const dice = interaction.client.dice
    const userId = interaction.user.id

    if(choice === "str"){
      embed = dice.createRangeEmbed(
        "힘으로 부수기",
        "당신을 당신의 힘으로 나무를 부술 준비를 합니다.",
      5,"str",userId)
      button.setCustomId(`exploreResult-${userId}-거대한 나무 발견-str`)
    }else if(choice === "dex"){
      embed = dice.createRangeEmbed(
        "가지를 잘라내기",
        "당신은 나무의 약한 가지를 파악해봅니다.",
      6,"dex",userId)
      button.setCustomId(`exploreResult-${userId}-거대한 나무 발견-dex`)
    }else if(choice === "int"){
      embed = dice.createRangeEmbed(
        "마력을 폭발시키기",
        "당신은 나무에 마력을 사용하기 위해 정신을 집중합니다.",
      7,"int",userId)
      button.setCustomId(`exploreResult-${userId}-거대한 나무 발견-int`)
    }else if(choice === "per"){
      embed = dice.createRangeEmbed(
        "나무 주변 조사",
        "당신은 나무의 뒤쪽을 조사해보기로 합니다.",
      3,"per",userId)
      button.setCustomId(`exploreResult-${userId}-거대한 나무 발견-per`)
    }
    
    const row = new ActionRowBuilder().addComponents(button)

    await interaction.followUp({ embeds: [embed], components:[row] })
  }
}