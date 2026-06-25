const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {

		// 상태 설정
		client.user.setPresence({
			activities: [{
				name:'/도움말 을 입력해보세요!',
				type: ActivityType.Custom
			}],
			status:'online'
		})

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
