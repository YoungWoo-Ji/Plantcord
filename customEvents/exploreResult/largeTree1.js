const { EmbedBuilder } = require("discord.js")

function resultEmbed(roll,bonus,result,desc){

  let rollResult
  if(roll===1){
    rollResult='펌블!'
  }else if(roll===20){
    rollResult='크리티컬!'
  }else{
    rollResult=`${roll}+${bonus}`
  }

  const embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle(`🎲 주사위 결과: ${roll}`)
    .setDescription(
      `**${result}** (${rollResult})\n`+
      '```\n'+
      `${desc}\n`+
      '```'
    )
  return embed
}

module.exports = {
  name:"거대한 나무 발견",
  async execute(interaction){
    const choice = interaction.customId.split("-")[3]
    const dice = interaction.client.dice
    const userId = interaction.user.id

    const gameManager = interaction.client.game

    let embed

    // 근력 선택지
    if(choice === 'str'){
      const {result,roll,bonus} = dice.rollCheck(userId,'str',5)
      if(result === '대성공'){
        embed = resultEmbed(roll,bonus,result,
          `완벽한 궤적의 묵직한 일격입니다!\n`+
          `당신의 일격이 나무의 결을 정확히 파고들었습니다.\n`+
          `당신은 힘의 낭비 없이 훌륭한 목재들을 획득합니다.\n\n`+
          gameManager.giveItem(userId,"나무",8)+
          gameManager.addExp(userId,10)
        )
        
      }else if(result === '성공'){
        embed = resultEmbed(roll,bonus,result,
          `당신은 거친 호흡을 내쉬며 나무 기둥에 연달아 공격을 가합니다.\n`+
          `단단한 껍질이 튕겨나가고, 마침내 쓸만한 크기의 목재를 획득합니다.\n\n`+
          gameManager.giveItem(userId,"나무",4)+
          gameManager.addExp(userId,5)
        )
        
      }else if(result === '실패'){
        embed = resultEmbed(roll,bonus,result,
          `깡...! 당신의 공격이 빗맞았습니다.\n`+
          `단단한 목질에 가로막혀, 목재를 얻어내지 못했습니다...\n\n`+
          gameManager.addExp(userId,1)+
          gameManager.addHealth(userId,-5)
        )
        
      }else if(result === '대실패'){
        embed = resultEmbed(roll,bonus,result,
          `무리하게 힘을 주어 나무를 부수려다, 단단한 옹이를 정면으로 들이받았습니다!\n`+
          `거대한 반동과 함께 당신은 신체에 큰 피해를 입습니다!\n\n`+
          gameManager.addExp(userId,1)+
          gameManager.addHealth(userId,-20)
        )
        
      }
    // 민첩 선택지
    }else if(choice === 'dex'){
      const {result,roll,bonus} = dice.rollCheck(userId,'dex',6)
      if(result === '대성공'){
        embed = resultEmbed(roll,bonus,result,
          `눈부실 정도로 정교한 솜씨입니다.\n당신은 나무의 가장 취약한 접합부를 정확히 공격합니다.\n`+
          `상처 하나 없이 매끄러운 다수의 목재들을 획득하였습니다.\n\n`+
          gameManager.giveItem(userId,"나무",6)+
          gameManager.addExp(userId,15)
        )
        
      }else if(result === '성공'){
        embed = resultEmbed(roll,bonus,result,
          `당신은 빠르게 나무위로 올라가 쓸만한 가지들을 찾습니다.\n`+
          `몇번의 시도 끝에, 마침내 적당한 목재를 분리해냅니다.\n\n`+
          gameManager.giveItem(userId,'나무',3)+
          gameManager.addExp(userId,7)
        )
        
      }else if(result === '실패'){
        embed = resultEmbed(roll,bonus,result,
          `나무의 틈새를 공략해보려 했지만, 생각보다 나무의 섬유질이 너무 질깁니다.\n`+
          `힘을 주어 보아도 상처만 날 뿐, 별 수확을 얻지 못했습니다...\n\n`+
          gameManager.addExp(userId,1)+
          gameManager.addHealth(userId,-3)
        )
        
      }else if(result === '대실패'){
        embed = resultEmbed(roll,bonus,result,
          `억지로 나무를 부러뜨려던 순간, '뚝' 하는 소리와 함께 나무 조각이 당신에게 튕겨져 날라옵니다.\n`+
          `튕겨나간 나무파편이 당신에게 피해를 입힙니다.\n\n`+
          gameManager.addExp(userId,1)+
          gameManager.addHealth(userId,-10)
        )
        
      }

    // 지능 선택지
    }else if(choice === 'int'){
      const {result,roll,bonus} = dice.rollCheck(userId,'int',7)
      if(result === '대성공'){
        embed = resultEmbed(roll,bonus,result,
          `나무 내부의 마력 줄기를 완벽히 감지해 냈습니다.\n`+
          `나무의 취약한 부분 몇 군데의 마력을 폭발시키자 훌륭한 목재들이 떨어집니다.\n`+
          gameManager.giveItem(userId,'나무',7)+
          gameManager.addExp(userId,13)+
          gameManager.addMana(userId,-5)
        )
        
      }else if(result === '성공'){
        embed = resultEmbed(roll,bonus,result,
          `당신을 정신을 집중하여 나무에 마력을 불어넣습니다.\n`+
          `몇 번의 폭발을 일으켜 당신은 목재 몇개를 얻어냅니다.\n\n`+
          gameManager.giveItem(userId,'나무',3)+
          gameManager.addExp(userId,6)+
          gameManager.addMana(userId,-5)
        )

      }else if(result === '실패'){
        embed = resultEmbed(roll,bonus,result,
          `의식을 집중해 보았지만 숲의 기운에 가려져 마력의 흐름이 잘 보이지 않습니다.\n`+
          `어설프게 흘려보낸 마력은 나무의 두꺼운 껍질에 가로막혀 허공에 흩어지고 말았습니다.\n\n`+
          gameManager.addExp(userId,1)+
          gameManager.addMana(userId,-5)
        )

      }else if(result === '대실패'){
        embed = resultEmbed(roll,bonus,result,
          `마력을 무리하게 주입하다가, 고목의 마력과 충돌하였습니다.\n`+
          `당신은 거센 마력 역류를 맞이하며 큰 피해를 입습니다.\n\n`+
          gameManager.addExp(userId,1)+
          gameManager.addMana(userId,-30)+
          gameManager.addHealth(userId,-15)
        )
      }

    // 감각 선택지
    }else if(choice === 'per'){
      const {result,roll,bonus} = dice.rollCheck(userId,'per',3)
      if(result === '대성공'){
        embed = resultEmbed(roll,bonus,result,
          `당신은 나무 뒤쪽으로 이동합니다.\n`+
          `나무 뒤쪽에는 비바람에 부서진듯한 훌륭한 목재들이 쌓여있었습니다.\n`+
          `당신은 목재를 한아름 챙겨갑니다.\n\n`+
          gameManager.giveItem(userId,'나무',10)+
          gameManager.addExp(userId,16)
        )

      }else if(result === '성공'){
        embed = resultEmbed(roll,bonus,result,
          `당신을 나무 뒤쪽으로 이동합니다.\n`+
          `나무 뒤쪽에는 몇개의 부러진 가지들이 있었습니다.\n`+
          `당신은 손쉽게 땅에 떨어진 목재들을 획득합니다.\n\n`+
          gameManager.giveItem(userId,'나무',5)+
          gameManager.addExp(userId,8)
        )

      }else if(result === '실패'){
        embed = resultEmbed(roll,bonus,result,
          `당신은 나무 뒤쪽으로 이동합니다.\n`+
          `나무 뒤쪽에서 목재를 발견했지만, 부러진지 너무 오래되었는지 벌레가 먹고 썩어있습니다.\n`+
          `당신은 실망한 채 이동합니다.\n\n`+
          gameManager.addExp(userId,1)
        )

      }else if(result === '대실패'){
        embed = resultEmbed(roll,bonus,result,
          `당신은 나무 뒤쪽으로 이동합니다.\n`+
          `이동하던 중 당신은 나무 뿌리에 걸려 크게 넘어집니다.\n`+
          `나무 뒤에 있었던 목재들이 다 부숴져 버렸습니다...\n\n`+
          gameManager.addExp(userId,1)+
          gameManager.addHealth(userId,-13)
        )
      }
    }

    await interaction.followUp({embeds:[embed]})
    
    // 상태 변경
    interaction.client.db.prepare('UPDATE status SET status=?, changeAt=? WHERE userId=?')
      .run(null,Date.now(),userId)
  } 
}