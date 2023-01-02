// Imports
import BotConf from "./configs/bot/bot.json";
import fs from "node:fs";
import TEMP from "./store/cachesystem/temp.json";
import { Client, GatewayIntentBits } from "discord.js";
import AutoDeploy from "./handlers/autodeploy"
import path from "node:path"
import EventsHandler from "./handlers/events";
import SlashCommandsHandler from "./handlers/slashcommands";

let CacheStorePath:string = path.join(__dirname,"./store/cachesystem/temp.json")
let CommandsPath:string = path.join(__dirname,"./commands")
//intents - client
const INTENTS = [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
];
const client = new Client({ intents: INTENTS });
//Loding
console.log("\x1b[34m", "╔════════════════════════╗", "\x1b[0m", "\n\x1b[36m", "  Bot Core -", "\x1b[0m", "Loading...", "\n\x1b[34m", "╚════════════════════════╝", "\x1b[0m");
//Auto deploy cmds
try {
    const ReadStored = fs.readFileSync(CacheStorePath,"utf-8")
    let DataStored:any = JSON.parse(ReadStored.toString())
    const DirsLength = fs.readdirSync(CommandsPath,"utf-8").length
    console.log("[", "\x1b[43m", "Commands AutoDeploy", "\x1b[0m", "]", "\x1b[0m","Checking for new commands...")
    if(DirsLength !== DataStored.TEMP.editDeploy) {
        AutoDeploy(client)
        DataStored.TEMP.editDeploy = DirsLength
        fs.writeFileSync(CacheStorePath,JSON.stringify(DataStored),"utf-8")
    } else {
        console.log("[", "\x1b[43m", "Commands", "\x1b[0m", "]", "\x1b[0m", " No new commands were detected... Skipping");

    }
    console.log("R&W Succesful")


} catch(err) {
    console.log("Dement cement xD")
    console.log(err)
}
/*
fs.readdir(path.join(__dirname, "./commands"), (err:any, data:any) =>{
    if (TEMP.TEMP.editDeploy !== data.length) {
        AutoDeploy(client)
    } else {
        console.log("[", "\x1b[43m", "Commands", "\x1b[0m", "]", "\x1b[0m", " No new commands were detected... Skipping");
    }
})*/
// main handlers
EventsHandler(client);
SlashCommandsHandler(client);
client.login(BotConf.token)
