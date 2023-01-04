import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { token } from "../configs/bot/bot.json";
import Deploy from "../handlers/deploy";
import { println } from "../utils/utils";
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cmddeploy')
        .setDescription('Admin'),
	async execute(interaction:any) {
        let infos = new EmbedBuilder()
        .setColor("#FFA500")
        .setDescription("**DpBase** The client is restarting! \nReason: Registering new commands")
		interaction.reply({embeds: [infos]})
        .then(() => {
            interaction.client.destroy
            println("debug", "Client shutdown.");
        })
        .then(() => {
            Deploy(interaction.client)
        })
        .then(() => interaction.client.login(token))
        .then(() => {
            println("debug", "Client online!");
        })
	},
};
