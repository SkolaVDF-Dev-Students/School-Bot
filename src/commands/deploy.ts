import { EmbedBuilder, Collection, SlashCommandBuilder, Client } from "discord.js";
import { token } from "../configs/bot/bot.json"
import path from "node:path";
import fs from "node:fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import AutoDeploy from "../handlers/autodeploy";
export default async () => {console.log("s")};
/*module.exports = {
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
};*/
