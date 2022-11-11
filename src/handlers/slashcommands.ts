import { Collection, EmbedBuilder } from "discord.js";
import path from "node:path";
import fs, { Dir, read, readdir } from "node:fs";
import { nest_limit } from "../configs/bot/slashcommands.json"
let commandFiles:any = [];
async function LoopDir(dir:string, level:number) {
    if(level > nest_limit && nest_limit) {
        console.log("[","\x1b[41m","Error","\x1b[0m","]")
        throw new Error("Folder nest limit reached");
    }
    const elements = fs.readdirSync(dir);
    
    for(const element of elements) {
        if(element.endsWith(".ts")) commandFiles.push(dir+element);
        else await LoopDir(dir+element+"\\", level++);
    }
}
//made with BIG assistance of da Milk MaN
export default async function SlashCommandsHandler(client: any) {
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands/');
    await LoopDir(commandsPath, 0);
        
    for (const file of commandFiles) {
        const command = await import(file);
        console.log("[","\x1b[43m","C","\x1b[0m","]","\x1b[4m", path.basename(file), "\x1b[0m" + " Loaded!");
        if(!command.data) {
            console.log("[","\x1b[41m","Error","\x1b[0m","]");
            throw new Error("Missing command data at:  "+file);
        }
        client.commands.set(command.data.name, command);
    }

    client.on('interactionCreate', async (interaction:any) => {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
    
        if (!command) return;
    
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            const ERROR = new EmbedBuilder()
            .setColor("Red")
            .setDescription("There was an error while executing this command!")
            await interaction.reply({ embeds: [ERROR], ephemeral: true });
        }
    });
}