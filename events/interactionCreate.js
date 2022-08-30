const config = require("../config/config.json");
module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		if(config.DEBUG.interaction) console.log(`DEBUG Interaction =  user: ${interaction.user.tag} channel: #${interaction.channel.name}`);
	},
};