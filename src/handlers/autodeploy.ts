import { Collection } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { REST } from "@discordjs/rest";
import BotData from "../configs/bot/bot.json"
import { Routes } from "discord-api-types/v9";
exports.run = async (client:any) => {
    const commands = [];
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands/');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
	    const filePath = path.join(commandsPath, file);
	    const command = require(filePath);
	    client.commands.set(command.data.name, command);
    }
    
    for (const file of commandFiles) {
	    const filePath = path.join(commandsPath, file);
	    const command = require(filePath);
	    commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(BotData.token);

    rest.put(Routes.applicationGuildCommands(BotData.clientId, BotData.guildId), { body: commands })
	    .then(() => {
        console.log("[","\x1b[43m","Commands","\x1b[0m","]","\x1b[0m"," Changes were detected! Applaying them now!")
		})
	    .catch(console.error);    
}
