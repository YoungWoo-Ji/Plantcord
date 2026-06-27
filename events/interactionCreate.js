const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		//Slash Commands & Context Menu
		if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand()){
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				console.error(`No Slash command matching ${interaction.commandName} was found.`);
				return;
			}

			//회원 전용 메뉴 (DB 설정 필요)
			if(command.permission===2){
				const db = interaction.client.db
				const find = db.prepare('SELECT * FROM user WHERE userId=?').get(interaction.user.id)
				if(!find){
					interaction.reply({content:'⚠️ 해당 명령어는 정보가 등록된 회원만 사용이 가능합니다.',flags:MessageFlags.Ephemeral})
					return
				}

				// 
				const statusRow = db.prepare('SELECT * FROM status WHERE userId=?').get(interaction.user.id)
				const userStatus = statusRow.status

				if (Object.prototype.hasOwnProperty.call(command, 'availableStatus')) {
					if (!Array.isArray(command.availableStatus) || !command.availableStatus.includes(userStatus)) {
						interaction.reply({content:'⚠️ 해당 명령어는 현재 상태에서 사용할 수 없습니다.'+`\n(현재 상태: ${userStatus})`, flags: MessageFlags.Ephemeral})
						return
					}
				} else if (userStatus !== null) {
					interaction.reply({content:'⚠️ 해당 명령어는 현재 상태에서 사용할 수 없습니다.'+`\n(현재 상태: ${userStatus})`, flags: MessageFlags.Ephemeral})
					return
				}
			}
			
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: '⚠️명령 실행 중 오류가 발생했습니다!', flags:MessageFlags.Ephemeral });
				} else {
					await interaction.reply({ content: '⚠️명령 실행 중 오류가 발생했습니다!', flags:MessageFlags.Ephemeral });
				}
			}
		}

		//autocomplete
		if(interaction.isAutocomplete()){
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		}

		//Modal
		if(interaction.isModalSubmit()){
			const command = interaction.client.interactions.modal.get(interaction.customId);
			if(!command) {
				console.error(`No Modal command matching ${interaction.customId} was found.`);
				return;
			}
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: '⚠️명령 실행 중 오류가 발생했습니다!', flags:MessageFlags.Ephemeral });
				} else {
					await interaction.reply({ content: '⚠️명령 실행 중 오류가 발생했습니다!', flags:MessageFlags.Ephemeral });
				}
			}
		}

		//Button
		if(interaction.isButton()){
			const customId= interaction.customId.split('-')

			//customId에 유저 id 포함
			if(customId.length >= 2){
				if(customId[1]!==interaction.user.id){
					interaction.reply({content:"⚠️ 해당 버튼을 사용할 수 있는 권한이 없습니다.",flags:MessageFlags.Ephemeral})
					return
				}
			}

			const command = interaction.client.interactions.button.get(customId[0]);
			if(!command) {
				console.error(`No Button command matching ${customId[0]} was found.`);
				return;
			}

			// 회원 전용 버튼
			if(command.permission===2){
				const db = interaction.client.db
				const find = db.prepare('SELECT * FROM user WHERE userId=?').get(interaction.user.id)
				if(!find){
					interaction.reply({content:'⚠️ 해당 명령어는 정보가 등록된 회원만 사용이 가능합니다.',flags:MessageFlags.Ephemeral})
					return
				}

				// 상태 확인
				const statusRow = db.prepare('SELECT * FROM status WHERE userId=?').get(interaction.user.id)
				const userStatus = statusRow.status

				if (Object.prototype.hasOwnProperty.call(command, 'availableStatus')) {
					if (!Array.isArray(command.availableStatus) || !command.availableStatus.includes(userStatus)) {
						interaction.reply({content:'⚠️ 해당 명령어는 현재 상태에서 사용할 수 없습니다.'+`\n(현재 상태: ${userStatus})`, flags: MessageFlags.Ephemeral})
						return
					}
				} else if (userStatus !== null) {
					interaction.reply({content:'⚠️ 해당 명령어는 현재 상태에서 사용할 수 없습니다.'+`\n(현재 상태: ${userStatus})`, flags: MessageFlags.Ephemeral})
					return
				}
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: '⚠️명령 실행 중 오류가 발생했습니다!', flags:MessageFlags.Ephemeral });
				} else {
					await interaction.reply({ content: '⚠️명령 실행 중 오류가 발생했습니다!', flags:MessageFlags.Ephemeral });
				}
			}
		}

		//StringSelectMenu
		if(interaction.isStringSelectMenu()){
			const customId= interaction.customId.split('-')

			//customId에 유저 id 포함
			if(customId.length >= 2){
				if(customId[1]!==interaction.user.id){
					interaction.reply({content:"⚠️ 해당 메뉴는 메뉴 생성 유저만 상호작용 가능합니다.",flags:MessageFlags.Ephemeral})
					return
				}
			}

			const command = interaction.client.interactions.stringSelectMenu.get(customId[0]);
			if(!command) {
				console.error(`No StringSelectMenu command matching ${customId[0]} was found.`);
				return;
			}

			// 회원 전용 메뉴
			if(command.permission===2){
				const db = interaction.client.db
				const find = db.prepare('SELECT * FROM user WHERE userId=?').get(interaction.user.id)
				if(!find){
					interaction.reply({content:'⚠️ 해당 명령어는 정보가 등록된 회원만 사용이 가능합니다.',flags:MessageFlags.Ephemeral})
					return
				}

				// 상태 확인
				const statusRow = db.prepare('SELECT * FROM status WHERE userId=?').get(interaction.user.id)
				const userStatus = statusRow.status

				if (Object.prototype.hasOwnProperty.call(command, 'availableStatus')) {
					if (!Array.isArray(command.availableStatus) || !command.availableStatus.includes(userStatus)) {
						interaction.reply({content:'⚠️ 해당 명령어는 현재 상태에서 사용할 수 없습니다.'+`\n(현재 상태: ${userStatus})`, flags: MessageFlags.Ephemeral})
						return
					}
				} else if (userStatus !== null) {
					interaction.reply({content:'⚠️ 해당 명령어는 현재 상태에서 사용할 수 없습니다.'+`\n(현재 상태: ${userStatus})`, flags: MessageFlags.Ephemeral})
					return
				}
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: '⚠️명령 실행 중 오류가 발생했습니다!', flags:MessageFlags.Ephemeral });
				} else {
					await interaction.reply({ content: '⚠️명령 실행 중 오류가 발생했습니다!', flags:MessageFlags.Ephemeral });
				}
			}
		}

	},
};