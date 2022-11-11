import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { token } from "../configs/bot/bot.json";
import AutoDeploy from "../handlers/autodeploy";
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
            console.log("DEBUG: Client shutdown")
        })
        .then(() => {
            AutoDeploy(interaction.client)
        })
        .then(() => interaction.client.login(token))
        .then(() => {
            console.log("DEBUG: Client Online!")
        })
	},
};
