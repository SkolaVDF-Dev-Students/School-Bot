import { Collection, EmbedBuilder } from "discord.js";
import path from "node:path";
import fs, { Dir, read, readdir } from "node:fs";
import { nest_limit } from "../configs/bot/handlersnestlimit.json";
import { println } from "../utils/utils";
let commandFiles:any = [];
async function LoopDir(dir:string, level:number) {
    if(level > nest_limit && nest_limit) {
        println("error", "Folder nest limit reached");
        throw new Error("Folder nest limit reached");
    }
    const elements = fs.readdirSync(dir);
    
    for(const element of elements) {
        if(element.endsWith(".ts")) commandFiles.push(dir+element);
        else await LoopDir(path.join(dir,element,"/"), level++);
    }
}
//made with BIG assistance of da Milk MaN
export default async function SlashCommandsHandler(client: any) {
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands/');
    await LoopDir(commandsPath, 0);
        
    for (const file of commandFiles) {
        const command = await import(file);
        println("commandLoad", path.basename(file))
        if(!command.data) {
            println("error", "Missing command data at: " + file)
            throw new Error("Missing command data at: " + file);
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