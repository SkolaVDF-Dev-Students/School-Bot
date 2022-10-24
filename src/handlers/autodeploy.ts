import { Collection } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { REST } from "@discordjs/rest";
import BotData from "../configs/bot/bot.json"
import { Routes } from "discord-api-types/v9";
export default async function AutoDeploy (client:any) {
    const commands = [];
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands/');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    for (const file of commandFiles) {
	    const filePath = path.join(commandsPath, file);
	    const command = await import(filePath);
	    client.commands.set(command.data.name, command);
    }
    
    for (const file of commandFiles) {
	    const filePath = path.join(commandsPath, file);
	    const command = await import(filePath);
	    commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(BotData.token);
    rest.put(Routes.applicationGuildCommands(BotData.clientId, BotData.guildId), { body: commands })
	    .then(() => {
        console.log("[","\x1b[43m","Commands AutoDeploy","\x1b[0m","]","\x1b[0m"," New commands were detected! Applaying them now!")
		})
	    .catch(console.error);    
}
