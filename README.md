# 스타터팩 설명

## config
1. clientId : 어플 아이디
2. guildId : 관리 길드 아이디
3. token : 봇 토큰
4. discord_invite_code : 서포트 서버 초대코드(ex. mTBbw9TaaP) (command/setting/info.js 참고)
5. kbot_token: 한국 디스코드 리스트 봇 토큰 (interaction/button/update.js 참고)

## command
1. data : SlashCommandBuilder()
2. permission: 명령어 권한 (1: 보통 권한, 2: 회원 권한, 3: 서포트 서버 관리자 전용)
3. execute : 명령어

## 실행
일반
``` bash
node index.js
```
pm2
``` bash
pm2 start index.js --name bot 
pm2 ls
pm2 log
pm2 start bot
pm2 stop bot
pm2 restart bot
pm2 delete bot
```
