import { EmbedBuilder, Collection, SlashCommandBuilder } from "discord.js";
import config from "../config/config.json";
import path from "node:path";
import fs from "node:fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
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
            let commandFile = require("../handlers/autodeploy");
            commandFile.run(interaction.client);
        })
        .then(() => interaction.client.login(config.BOT.token))
        .then(() => {
            console.log("DEBUG: Client Online!")
        })
	},
};
