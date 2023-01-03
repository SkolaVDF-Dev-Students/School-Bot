// Imports
import BotConf from "./configs/bot/bot.json";
import { Client, GatewayIntentBits } from "discord.js";
import EventsHandler from "./handlers/events";
import SlashCommandsHandler from "./handlers/slashcommands";
//import AutoDeploy from "./handlers/autodeploy";
import Deploy from "./handlers/deploy";
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

// main handlers
EventsHandler(client);
SlashCommandsHandler(client);
Deploy(client);
client.login(BotConf.token)