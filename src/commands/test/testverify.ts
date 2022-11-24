
import { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tsver')
		.setDescription('--'),
	async execute(interaction:any) {
		const buttonrow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("start-verify")
            .setLabel("Začít proces ověření")
            .setStyle(ButtonStyle.Primary)
        )
		let yourping = await new Date().getTime() - interaction.createdTimestamp
		let botping = await Math.round(interaction.client.ws.ping)
		const pong = new EmbedBuilder()
		.setTitle("TEST")
		.setColor('#07bb8b')
		.setDescription(`**Your latency: \`\`${yourping}ms\`\`**\n**Bot latency \`\`${botping}ms\`\`**\n\n> Bot Base is project made for simple, fast, and easy development of new bots. This project is still in the early development and not openned to public.`)
		.setFooter({ text: "© Bot Base by DEPSTRCZ#9987"})
		await interaction.reply({embeds:[pong],components: [buttonrow]});
	},
};
