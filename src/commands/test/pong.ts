
import { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responds with latency of the bot and pong '),
	async execute(interaction:any) {
		let yourping = await new Date().getTime() - interaction.createdTimestamp
		let botping = await Math.round(interaction.client.ws.ping)
		const pong = new EmbedBuilder()
		.setTitle("Pong! 🏓")
		.setColor('#07bb8b')
		.setDescription(`**Your latency: \`\`${yourping}ms\`\`**\n**Bot latency \`\`${botping}ms\`\`**\n\n> Bot Base is project made for simple, fast, and easy development of new bots. This project is still in the early development and not openned to public.`)
		.setFooter({ text: "© Bot Base by DEPSTRCZ#9987"})
		const buttonrow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("verify-start")
            .setLabel("Začít proces ověření")
            .setStyle(ButtonStyle.Primary)
        )
		return interaction.reply({embeds:[pong], components:[buttonrow]});
	},
};
