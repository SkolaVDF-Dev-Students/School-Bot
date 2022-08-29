
const { Embed, Client, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('imagine')
		.setDescription('Allow you to create AI generatred picture trhough specified text'),
	async execute(interaction) {
		//nic
		return interaction.reply({embeds:[pong]});
	},
};