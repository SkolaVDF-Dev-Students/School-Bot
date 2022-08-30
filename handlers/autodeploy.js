exports.run = async (client) => {
    const { Collection } = require("discord.js");
    const path = require('node:path');
    const fs = require('node:fs');
    const { REST } = require('@discordjs/rest');
    const config = require("../config/config.json");
    const { Routes } = require('discord-api-types/v9');
    const commands = [];
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands/');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
	    const filePath = path.join(commandsPath, file);
	    const command = require(filePath);
	    client.commands.set(command.data.name, command);
    }
    
    for (const file of commandFiles) {
	    const filePath = path.join(commandsPath, file);
	    const command = require(filePath);
	    commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(config.BOT.token);

    rest.put(Routes.applicationGuildCommands(config.BOT.clientId, config.BOT.guildId), { body: commands })
	    .then(() => {
        console.log("[","\x1b[43m","Commands","\x1b[0m","]","\x1b[0m"," Changes were detected! Applaying them now!")
		})
	    .catch(console.error);    
}
