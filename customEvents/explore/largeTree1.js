const { EmbedBuilder,StringSelectMenuBuilder,ActionRowBuilder,StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  name: '거대한 나무 발견',
  async execute(interaction) {
    
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle("거대한 나무 발견!")
      .setDescription(
        '```\n' +
        `길을 헤치던 당신의 눈앞에 유독 단단해 보이는 거대한 나무가 나타납니다.\n`
        +'오랜 세월을 버텨온 듯 굵직한 줄기와 거친 껍질이 위용을 자랑하고 있습니다.'
        +'이 나무의 가지를 잘라낸다면 훌륭한 무기와 도구의 재료가 될 것입니다.'
        + '\n```'
      )

    const selctMenu = new StringSelectMenuBuilder()
      .setCustomId(`exploreDifficulty-${interaction.user.id}-거대한 나무 발견`)
      .setPlaceholder('당신의 행동을 선택하세요.')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('힘으로 나무를 부러뜨린다')
          .setValue('str')
          .setDescription('필요: 근력'),
        new StringSelectMenuOptionBuilder()
          .setLabel('나무의 위의 약한 가지를 잘라낸다.')
          .setValue('dex')
          .setDescription('필요: 민첩'),
        new StringSelectMenuOptionBuilder()
          .setLabel('나무의 내부에서 마력을 폭발시킨다.')
          .setValue('int')
          .setDescription('필요: 지능')
      )
    
    // 추가 옵션
    const userId = interaction.user.id
    const level = interaction.client.db.prepare('SELECT * FROM level WHERE userId=?').get(userId)
    const userPerception = level.per
    const diceManager = interaction.client.dice
    if (diceManager.rollCheck(userId, 'per', 11).result === '대성공') {
      selctMenu.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('[발견] 나무 뒤에 부러진 가지들이 보입니다!')
          .setValue('per')
          .setDescription('필요: 감각')
      )
    }

    const row = new ActionRowBuilder()
      .addComponents(selctMenu)

    await interaction.followUp({ embeds: [embed], components: [row] });

  }
};
