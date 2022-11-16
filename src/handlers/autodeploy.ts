import { Collection } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { REST } from "@discordjs/rest";
import BotData from "../configs/bot/bot.json"
import { Routes } from "discord-api-types/v9";
import { nest_limit } from "../configs/bot/handlersnestlimit.json"
let commandFiles:any = [];
async function LoopDir(dir:string, level:number) {
    if(level > nest_limit && nest_limit) {
        console.log("[","\x1b[41m","Error","\x1b[0m","]")
        throw new Error("Folder nest limit reached");
    }
    const elements = fs.readdirSync(dir);
    
    for(const element of elements) {
        if(element.endsWith(".ts")) commandFiles.push(dir+element);
        else await LoopDir(path.join(dir,element,"/"), level++);
    }
}
export default async function AutoDeploy (client:any) {
    const commands = [];
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands/');
    await LoopDir(commandsPath, 0);
    for (const file of commandFiles) {
        const command = await import(file);
        console.log("[","\x1b[46m","D","\x1b[0m","]","\x1b[4m", path.basename(file), "\x1b[0m" + " Deployed!");
        if(!command.data) {
            console.log("[","\x1b[41m","Error","\x1b[0m","]");
            throw new Error("Missing command data at:  "+file);
        }
        client.commands.set(command.data.name, command);
    }
    
    for (const file of commandFiles) {
	    const command = await import(file);
	    commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(BotData.token);
    rest.put(Routes.applicationGuildCommands(BotData.clientId, BotData.guildId), { body: commands })
	    .then(() => {
        console.log("[","\x1b[43m","Commands AutoDeploy","\x1b[0m","]","\x1b[0m"," New commands were detected! Applaying them now!")
		})
	    .catch(console.error);    
}
