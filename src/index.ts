// Imports
import BotConf from "./configs/bot/bot.json";
import fs from "node:fs";
import TEMP from "./chachesystem/temp.json";
import { Client, GatewayIntentBits } from "discord.js";
import AutoDeploy from "./handlers/autodeploy"
import path from "node:path"
import EventsHandler from "./handlers/events";
import SlashCommandsHandler from "./handlers/slashcommands";
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
//loading
console.log("\x1b[34m", "╔════════════════════════╗", "\x1b[0m", "\n\x1b[36m", "  Bot Core -", "\x1b[0m", "Loading...", "\n\x1b[34m", "╚════════════════════════╝", "\x1b[0m");
console.log("[", "\x1b[43m", "Commands AutoDeploy", "\x1b[0m", "]", "\x1b[0m","Checking for new commands...")
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
const length = fs.readdirSync(path.join(__dirname, "./commands")).length;
if (TEMP.TEMP.editDeploy !== length) {
    AutoDeploy(client)
} else {
    console.log("[", "\x1b[43m", "Commands", "\x1b[0m", "]", "\x1b[0m", " No new commands were detected... Skipping");
}
// main handlers
EventsHandler(client);
SlashCommandsHandler(client);
client.login(BotConf.token);
