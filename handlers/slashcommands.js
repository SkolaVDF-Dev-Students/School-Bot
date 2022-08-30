const { Client, Collection, EmbedBuilder } = require("discord.js");
const path = require('node:path');
const fs = require('node:fs');
module.exports = async (client) => {
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands/');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        console.log("[","\x1b[43m","C","\x1b[0m","]","\x1b[4m", file, "\x1b[0m" + " Loaded!")
        client.commands.set(command.data.name, command);
    }
    client.on('interactionCreate', async interaction => {
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

