// Imports
import BotConf from "./configs/bot/bot.json";
import fs from "node:fs";
import TEMP from "./chachesystem/temp.json";
import { Client, GatewayIntentBits } from "discord.js";
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
const EventsHandler = require("./handlers/events");
const SlashCommandsHandler = require("./handlers/slashcommands");
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
const length = fs.readdirSync("./dist/commands/").length;
if (TEMP.TEMP.editDeploy !== length) {
    let commandFile = require("./handlers/autodeploy");
    commandFile.run(client);
} else {
    console.log("[", "\x1b[43m", "Commands", "\x1b[0m", "]", "\x1b[0m", " No edit to commands were made... Skipping");
}
client.login(BotConf.token);
