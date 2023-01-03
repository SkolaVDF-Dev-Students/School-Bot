import { Collection } from "discord.js";
import path from "node:path";
import * as fs from "node:fs";
import { REST } from "@discordjs/rest";
import BotData from "../configs/bot/bot.json"
import { Routes } from "discord-api-types/v9";
import { nest_limit } from "../configs/bot/handlersnestlimit.json"

let commandFiles:any = [];
let CacheStorePath:string = path.join(__dirname,"../store/cachesystem/temp.json")

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
export default async function Deploy (client:any) {
    const commands:any = [];
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands/');
    await LoopDir(commandsPath, 0);

    for (const file of commandFiles) {
        const command = await import(file);
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
    try {
        const ReadStored = fs.readFileSync(CacheStorePath,"utf-8")
        const DataStored = JSON.parse(ReadStored)

        if(JSON.stringify(commands) == JSON.stringify(DataStored)) {
            console.log("[", "\x1b[46m", "Deploy", "\x1b[0m", "]", "\x1b[0m", " No new changes were detected... Skipping");
            return
        }
    } catch(err) {
        console.log("UTILS.ERROR(DEPLOY - FAILED - JSON DATA BROKEN FIXING.)")
    }
    console.log("[", "\x1b[46m", "Deploy", "\x1b[0m", "]", "\x1b[0m", " Changes were detected..");
    fs.writeFileSync(CacheStorePath,JSON.stringify(commands),"utf-8")
    const rest = new REST({ version: '9' }).setToken(BotData.token);
    rest.put(Routes.applicationGuildCommands(BotData.clientId, BotData.guildId), { body: commands })
	    .then(() => {
        console.log("[","\x1b[46m","Deploy","\x1b[0m","]","\x1b[0m"," Detected changes were applied!")
        return 1;
		})
	    .catch(console.error);  
}
