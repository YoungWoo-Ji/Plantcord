module.exports = {
  name: 'exploreDifficulty',
  permission:2,
  availableStatus:['탐험'],
  async execute(interaction) {
    const eventName = interaction.customId.split('-')[2]
    await interaction.update({components:[]})
    await interaction.client.customEvents.exploreDifficulty
      .get(eventName).execute(interaction)
  }
}