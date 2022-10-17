import { Client, Collection, EmbedBuilder } from "discord.js";
import path from "node:path";
import fs, { Dir, read, readdir } from "node:fs";

export default async function SlashCommandsHandler(client: any) {
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands/');
    //const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    let commandFiles:any = [];
    let Dirs:any = [];
    fs.readdirSync(commandsPath).forEach(element => {
        if(element.endsWith(".ts")) commandFiles.push(commandsPath+element)
        if(!element.endsWith(".ts")) Dirs.push(commandsPath+element)
    })
    while (Dirs.length > 0) {
        Dirs.forEach(async (file: string) => {
            let readdir:any = fs.readdirSync(file);
                if(readdir.length === 0) {
                    Dirs = Dirs.filter((element:any) => element !== file)
                    return
                }
                console.log(file)
                console.log(Dirs)
                readdir.forEach((element:any) => {
                    if(element.endsWith(".ts")) commandFiles.push(path.join(__dirname,element))
                    if(!element.endsWith(".ts")) Dirs.push(path.join(__dirname,element))
                    Dirs = Dirs.filter((element:any) => element !== file)
                })
        });
        
    }
    //console.log(commandFiles)
    //console.log(__dirname)
    //do it as a object and save category
    //console.log(commandFiles)
    //console.log(Dirs)
    /*Dirs.forEach(async (file: any) => {
        const t = await import(file)
        console.log(t.name)
    });*/
        
    /*for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(filePath);
        console.log("[","\x1b[43m","C","\x1b[0m","]","\x1b[4m", file, "\x1b[0m" + " Loaded!")
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
    });*/
}