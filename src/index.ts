// Imports
import BotConf from "./configs/bot/bot.json";
import { Client, GatewayIntentBits } from "discord.js";
import EventsHandler from "./handlers/events";
import SlashCommandsHandler from "./handlers/slashcommands";
//import AutoDeploy from "./handlers/autodeploy";
import Deploy from "./handlers/deploy";
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
println("coreLoad", "Bot Core - Loading...")

// main handlers
EventsHandler(client);
SlashCommandsHandler(client);
Deploy(client);
client.login(BotConf.token)