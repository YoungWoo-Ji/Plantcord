const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js')
const { setTimeout } = require('node:timers/promises');
const eventsData = require('../../data/events.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('탐험')
    .setDescription('현재 위치에서 탐험을 진행합니다.'),
  permission: 2,
  async execute(interaction) {

    const db = interaction.client.db
    const userStatus = db.prepare('SELECT * FROM status WHERE userId=?').get(interaction.user.id)
    const location = userStatus.location
    
    // 탐험 이벤트 존재 확인
    const locationEvents = eventsData[location]
    if (!locationEvents || locationEvents.length === 0) {
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('탐험')
        .setDescription('```\n'+`${location}에서는 특별히 탐험할 것이 없어 보입니다.`+'\n```')
      await interaction.reply({ embeds: [embed] })
      return
    }

    // 탐험 시작 메시지
    const startMsg = [

`당신은 눈앞에 펼쳐진 ${location}의 중심부로 발을 내딛습니다.
주변의 낯선 공기와 풍경이 온몸의 감각을 부드럽게 자극합니다.
어떤 흥미로운 장소나 생명체가 숨어있을지 기대감이 차오릅니다.
장비를 가볍게 손질하고 주위에 무엇이 있는지 살핍니다.`,

`당신은 ${location}의 경계선을 넘어 안쪽으로 이동합니다.
발끝에 닿는 지형의 거친 감촉이 고스란히 전해집니다.
장비를 단단히 고쳐매고 미지의 길을 향해 나아갑니다.
혹시 눈앞에 숨겨진 보물이나 귀한 채집물이 있을지,
당신은 걸음을 잠시 멈추고 주위를 차분하게 둘러봅니다.`,

`바람을 타고 불어오는 미지의 향기가 ${location} 전체를 감쌉니다.
저 멀리 깊은 곳에서 이름 모를 소리들이 아스라이 들려옵니다.
사방으로 복잡하게 얽힌 길 앞에서 잠시 방향을 가늠합니다.
당신은 오감을 곤두세운 채 위험 요소를 포착하려 애씁니다.
당신은 신중하게 발걸음을 옮기며 앞으로 전진합니다.`,

`주변을 은밀하게 살피며 ${location}(을)를 탐색하기 시작합니다.
혹시 모를 위협이나 누군가의 발자국 흔적이 없는지 바닥을 살핍니다.
옷깃이 스치는 미세한 소리조차 이 고요한 공간의 공기를 깨뜨립니다.
언제 어디서 무엇이 나올지 모릅니다.
당신은 숨을 죽인 채 주변을 정찰합니다.`,

`${location}의 더 깊숙한 구역으로 들어설수록 주변이 고요해집니다.
지형지물이 빛을 가려 보이지 않는 그늘이 낮게 깔려 있습니다.
등 뒤로 무언가 시선이 느껴지는 듯한 기묘한 기분이 듭니다.
무기를 쥔 손에 가만히 힘을 주며 경계를 늦추지 않습니다.
당신은 경계 태세를 유지하며 주변을 정찰합니다.`,

`한참을 걷던 당신은 거친 숨을 고르며 잠시 주위를 봅니다.
겉보기엔 평화롭지만, 언제든 적과 마주칠 수 있는 환경입니다.
허리에 찬 물통을 꺼내 가볍게 축이고 다시 채비를 마칩니다.
한층 가벼우면서도 신중한 태도로 다음 목적지를 바라봅니다.
당신은 흐트러진 호흡을 가다듬고 걸음을 재촉합니다.`,

`다른 개척자들의 발길이 닿았던 희미한 흔적을 따라 이동합니다.
누군가 쉬어갔던 장소인지, 희미하게 빛이 바랜 잔해가 보입니다.
당신의 눈앞에는 ${location}의 더 깊고 험난한 구역으로 이어지는 길이 보입니다.
당신은 무기와 방어구의 상태를 최종적으로 체크합니다.
당신은 새로운 수확을 기대하며 전방을 향해 꿋꿋이 전진합니다.`,

`하늘을 가린 지형 사이로 풍경의 색이 조금씩 변해가는 것이 느껴집니다.
대지의 기운이 한층 더 짙어지며 정령들의 숨결 같은 바람이 불어옵니다.
당신이 머무는 ${location}(은)는 시시각각 변화무쌍한 모습을 보입니다.
오늘 하루 가장 큰 성과를 거두기를 기대하며 발걸음을 재촉합니다.
당신은 목표한 구역을 향해 멈춤 없이 탐험을 진행합니다.`
    ]
    
    const randomStartMsg = startMsg[Math.floor(Math.random() * startMsg.length)]

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('탐험')
      .setDescription(
        '```\n'+
        `당신은 ${location}에서 탐험을 시작합니다.\n`+
        `${randomStartMsg}`+
        '```'
      )
    await interaction.reply({ embeds: [embed] })

    // 3~4초 랜덤 대기
    const waitTime = Math.floor(Math.random() * 2000) + 3000;
    await setTimeout(waitTime)

    // 가중치에 따라 무작위 이벤트 선택
    const totalWeight = locationEvents.reduce((sum, event) => sum + event.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedEvent = locationEvents[0];

    for (const event of locationEvents) {
      random -= event.weight;
      if (random <= 0) {
        selectedEvent = event.name;
        break;
      }
    }

    // 이벤트 모듈 로드 및 실행
    const event = interaction.client.customEvents.explore.get(selectedEvent);
    if (!event) {
      await interaction.followUp({ content: `⚠️ 이벤트를 불러오는 중 오류가 발생했습니다! 관리자에게 문의해주세요.\n(이벤트 이름: ${selectedEvent}, 장소:${location})`, flags:MessageFlags.Ephemeral });
      return;
    }

    // 유저 상태 변경
    db.prepare('UPDATE status SET status=? WHERE userId=?').run("탐험", interaction.user.id);

    await event.execute(interaction)
  }
}