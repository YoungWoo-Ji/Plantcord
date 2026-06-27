class GameManager {
  constructor(client) {
    this.client = client;
    this.db = client.db;
    this.system = client.system;
  }

  requiredExp(level){
    return Math.floor(Math.pow(level,1.8))*10+10
  }

  addExp(userId, amount){
    const userLevel = this.db.prepare("SELECT * FROM level WHERE userId=?").get(userId)
    const currentLevel = userLevel.level
    const currentExp = userLevel.exp
    if(currentExp+amount>=this.requiredExp(currentLevel)){
      this.db.prepare('UPDATE level SET level=?,exp=? WHERE userId = ?')
        .run(currentLevel+1,0,userId)
      return `[exp +${amount}]\n[레벨 업!]\n`
    }else{
      this.db.prepare('UPDATE level SET exp=? WHERE userId=?')
        .run(currentExp+amount,userId)
        return `[exp +${amount}]\n`
    }
    
  }

  addStat(userId, statName, amount){
    const userLevel = this.db.prepare("SELECT * FROM level WHERE userId=?").get(userId)
    const statPoints = userLevel.statPoints
    const currentStat = userLevel[statName]

    if(amount>statPoints){
      return false
    }

    this.db.prepare(`UPDATE level SET statPoints=?,${statName}=? WHERE userId=?`)
      .run(statPoints-amount,currentStat+amount,userId)
    return true
  }

  maxHealth(userId){
    const user = this.db.prepare("SELECT * FROM level WHERE userId=?").get(userId)
    const userCon = user.con 
    const userlevel = user.level
    return 100 + userCon*5 + 15*(userlevel-1) 
  }

  maxMana(userId){
    const user = this.db.prepare("SELECT * FROM level WHERE userId=?").get(userId)
    const userInt = user.int 
    const userlevel = user.level
    return 100 + userInt*5 + 5*(userlevel-1) 
  }

  maxSlot(userId){
    const userBag = this.db.prepare("SELECT * FROM equipment WHERE userId=? AND part=?").get(userId,'가방')
    if(!userBag){
      return 10
    }
    return this.client.data.items[userBag.item].maxSlot
  }

  giveItem(userId,item,amount){
    const transaction = this.db.transaction((userId,item,amount)=>{
      const itemData = this.client.items[item]
      if(!itemData) return false
      // 최대 슬롯
      const maxSlot = this.maxSlot(userId)
      // 현재 인벤토리 모두
      const inv = this.db.prepare('SELECT * FROM inventory WHERE userId=? ORDER BY slotIndex ASC')
        .all(userId)
      // 못 넣은 수량
      let remaining = amount

      // 1. 기존 슬롯에 덧붙이기
      const sameItemSlots = inv.filter(slot => slot.item === item && slot.amount < itemData.maxStack)

      for (const slot of sameItemSlots) {
        const spaceLeft = itemData.maxStack - slot.amount; // 이 슬롯에 더 들어갈 수 있는 공간
        const toAdd = Math.min(spaceLeft, remaining);  // 넣을 수 있는 만큼만 선택

        this.db.prepare('UPDATE inventory SET amount = amount + ? WHERE id = ?').run(toAdd, slot.id);
        remaining -= toAdd;

        if (remaining <= 0) break;
      }

      // 2. 빈 슬롯에 새로 넣기
      if (remaining > 0) {
        // 현재 사용 중인 슬롯 번호들만 모은 세트 (예: [0, 1, 3])
        const usedSlots = new Set(inv.map(slot => slot.slotIndex));

        // 1번 칸부터 최대칸까지 돌면서 빈 번호 찾기
        for (let i = 1; i <= maxSlot; i++) {
          if (!usedSlots.has(i)) { // 빈 슬롯 발견
            const toAdd = Math.min(itemData.maxStack, remaining); // maxStack만큼 담기
            
            this.db.prepare('INSERT INTO inventory (userId, item, amount, slotIndex) VALUES (?, ?, ?, ?)')
                    .run(userId, item, toAdd, i);
            
            remaining -= toAdd;
            usedSlots.add(i); // 이제 이 칸은 사용 중

            if (remaining <= 0) break;
          }
        }
      }

      // 3. 맵에 버리기
      if(remaining>0) {
        const location = this.db.prepare("SELECT location FROM status WHERE userId=?").location
        const floorItems = this.system.prepare('SELECT * FROM mapItem WHERE location=?')

        // [바닥 1단계] 이미 맵에 떨어져 있는 같은 아이템 슬롯 중 빈자리 찾아서 채우기
        const sameFloorSlots = floorItems.filter(slot => slot.item === item && slot.amount < itemData.maxStack);
        for (const slot of sameFloorSlots) {
            const spaceLeft = itemData.maxStack - slot.amount;
            const toAdd = Math.min(spaceLeft, remaining);
            this.system.prepare('UPDATE mapItem SET amount = amount + ? WHERE id = ?').run(toAdd, slot.id);
            remaining -= toAdd;
            if (remaining <= 0) break;
        }

        // [바닥 2단계] 그래도 남으면 맵의 새로운 슬롯에 배치 (무제한 슬롯이므로 빈 인덱스 계속 생성)
        if (remaining > 0) {
            while (remaining > 0) {
                const toAdd = Math.min(item.maxStack, remaining);
                this.system.prepare('INSERT INTO mapItem (location,item,amount) VALUES (?, ?, ?)')
                        .run(location, item, toAdd);
                remaining -= toAdd;
            }
        }
      }
      return `[${item} +${amount}]\n`
    })
    return transaction(userId,item,amount)
  }

  addHealth(userId,amount){
    const userStatus = this.db.prepare("SELECT * FROM status WHERE userId=?").get(userId)
    const currentHealth = userStatus.health
    const currentStatus = userStatus.status
    // 체력이 0이하로 떨어짐
    if(currentHealth+amount<=0){
      this.db.prepare("UPDATE status SET status = ?, health=?, mana=?, changeAt=? WHERE userId=?")
        .run('기절',this.maxHealth(userId),this.maxMana(userId),Date.now(),userId)
      return `[체력 ${amount>=0?'+':''}${amount}]\n[당신은 기절했습니다]\n`
    }
    // 단순 체력 증감
    this.db.prepare("UPDATE status SET health = ? WHERE userId = ?")
      .run(currentHealth+amount,userId)
    return `[체력 ${amount>=0?'+':''}${amount}]\n`
  }

  addMana(userId,amount){
    const userStatus = this.db.prepare("SELECT * FROM status WHERE userId=?").get(userId)
    const currentMana = userStatus.mana

    const changedMana = Math.min(Math.max(0,currentMana+amount),this.maxMana(userId))

    this.db.prepare("UPDATE status SET mana = ? WHERE userId = ?")
      .run(changedMana,userId)
    return `[마력 ${amount>=0?'+':''}${amount}]\n`
  }

}

module.exports = GameManager;