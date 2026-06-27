const { EmbedBuilder } = require('discord.js');

class DiceManager {
  constructor(client) {
    this.client = client;
    this.db = client.db;
  }

  /**
   * Rolls a d20 and evaluates the result against difficulty.
   * @param {string} statName character stat name (str, dex, con, int, per)
   * @param {number} difficulty 1~20
   * @returns {{roll:number, difficulty:number, difference:number, result:string}}
   */
  rollCheck(userId, statName, difficulty) {

    const level = this.db.prepare('SELECT * FROM level WHERE userId = ?').get(userId);
    const requiredStat = level[statName];

    const roll = Math.floor(Math.random() * 20) + 1 
    const bonus = Math.floor(requiredStat/10)
    const rollWithBonus = roll + bonus
    const difference = roll - difficulty;

    let result;
    if (roll === 20) {
      result = '대성공';
    } else if (roll === 1) {
      result = '대실패';
    } else if (difference >= 5) {
      result = '대성공';
    } else if (difference <= -5) {
      result = '대실패';
    } else if (roll >= difficulty) {
      result = '성공';
    } else {
      result = '실패';
    }

    return { result, roll, bonus };
  }

  /**
   * Returns the d20 ranges for each outcome given a difficulty.
   * @param {number} difficulty 1~20
   * @returns {{criticalSuccess:[number,number], success:[number,number]|null, failure:[number,number]|null, criticalFailure:[number,number], difficulty:number}}
   */
  getRollCheckRanges(difficulty) {
    const criticalSuccessMin = Math.min(difficulty + 5, 20);
    const criticalFailureMax = Math.max(difficulty - 5, 1);

    const successMin = Math.max(difficulty, 2);
    const successMax = Math.min(criticalSuccessMin - 1, 19);
    const failureMin = Math.max(criticalFailureMax + 1, 2);
    const failureMax = Math.min(difficulty - 1, 19);

    return {
      difficulty,
      criticalSuccess: [criticalSuccessMin, 20],
      success: successMin <= successMax ? [successMin, successMax] : null,
      failure: failureMin <= failureMax ? [failureMin, failureMax] : null,
      criticalFailure: [1, criticalFailureMax],
    };
  }

  /**
   * Create an Embed showing roll outcome ranges.
   * @param {string} title embed title
   * @param {string} desc embed description
   * @param {string} statName required stat name (str,dex,con,int,per)
   * @param {string} userId discord user id
   * @param {number} difficulty 1~20
   * @returns {EmbedBuilder}
   */
  createRangeEmbed(title,desc,difficulty,statName,userId) {
    const ranges = this.getRollCheckRanges(difficulty);

    const levelRow = this.db.prepare('SELECT * FROM level WHERE userId = ?').get(userId);
    const userStat = levelRow ? (levelRow[statName] ?? null) : null;

    const formatRange = (r) => (r ? (r[0] === r[1] ? `${r[0]}` : `${r[0]} - ${r[1]}`) : '없음');

    const koreanStatus = {
      str:"근력",int:"지능",con:"체력",dex:"민첩",per:"감각"
    }

    const level = this.db.prepare('SELECT * FROM level WHERE userId = ?').get(userId);
    const requiredStat = level[statName];
  
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(title)
      .setDescription(`\`\`\`\n${desc}\n\`\`\`\n`)
      .addFields(
        {name:"성공확률", value:
        `- 대성공: ${formatRange(ranges.criticalSuccess)}\n`+
        `- 성공: ${formatRange(ranges.success)}\n`+
        `- 실패: ${formatRange(ranges.failure)}\n`+
        `- 대실패: ${formatRange(ranges.criticalFailure)}`
        },
        {name:"능력치 보정", value:
          `${koreanStatus[statName]}: +${Math.floor(requiredStat/10)}`
        }
      )

    return embed;
  }

}

module.exports = DiceManager;