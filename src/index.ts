// Imports
import BotConf from "./configs/bot/bot.json";
import fs from "node:fs";
import TEMP from "./chachesystem/temp.json";
import { Client, GatewayIntentBits } from "discord.js";
import AutoDeploy from "./handlers/autodeploy"
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
import EventsHandler from "./handlers/events";
import SlashCommandsHandler from "./handlers/slashcommands";
EventsHandler(client);
SlashCommandsHandler(client);
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
const length = fs.readdirSync("./commands/").length;
if (TEMP.TEMP.editDeploy !== length) {
    AutoDeploy(client)
} else {
    console.log("[", "\x1b[43m", "Commands", "\x1b[0m", "]", "\x1b[0m", " No edit to commands were made... Skipping");
}
client.login(BotConf.token);
