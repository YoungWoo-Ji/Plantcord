module.exports = {
  name:"exploreResult",
  permission:2,
  availableStatus:['탐험'],
  async execute(interaction) {
    const eventName = interaction.customId.split('-')[2]
    await interaction.update({components:[]})
    await interaction.client.customEvents.exploreResult
      .get(eventName).execute(interaction)
  }
}