// Imports
import BotConf from "./configs/bot/bot.json";
import fs from "node:fs";
import TEMP from "./store/chachesystem/temp.json";
import { Client, GatewayIntentBits } from "discord.js";
import AutoDeploy from "./handlers/autodeploy"
import path from "node:path"
import EventsHandler from "./handlers/events";
import SlashCommandsHandler from "./handlers/slashcommands";
import { println } from "./utils/utils";
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
//Loading
println("coreLoad", "Bot Core - Loading...");
println("autoDeployInfo", "Checking for new commands...");
//Auto deploy cmds
fs.readFile("./chachesystem/temp.json", (err:any, data:any) => {
    if (!err || data) {
        const file = JSON.parse(data.toString());
        const length = fs.readdirSync("./commands/").length;
        file.TEMP.editDeploy = length;
        fs.writeFile("./chachesystem/temp.json", JSON.stringify(file), (err:any) => {
            if (err) console.log(err);
        });
    }
});
fs.readdir(path.join(__dirname, "./commands"), (err:any, data:any) =>{
    if (TEMP.TEMP.editDeploy !== data.length) {
        AutoDeploy(client)
    } else {
        println("autoDeployInfo", "No new commands were detected... Skipping");
    }
})
// main handlers
EventsHandler(client);
SlashCommandsHandler(client);
client.login(BotConf.token)
