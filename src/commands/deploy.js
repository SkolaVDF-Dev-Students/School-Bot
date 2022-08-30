const { EmbedBuilder, Collection, SlashCommandBuilder } = require('discord.js');
const config = require("../../config/config.json");
const path = require('node:path');
const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cmddeploy')
        .setDescription('Admin'),
	async execute(interaction) {
        let infos = new EmbedBuilder()
        .setColor("#FFA500")
        .setDescription("**DpBase** The client is restarting! \nReason: Registering new commands")
		interaction.reply({embeds: [infos]})
        .then(() => {
            interaction.client.destroy
            console.log("DEBUG: Client shutdown")
        })
        .then(() => {
            const commands = [];
            interaction.client.commands = new Collection();
            const commandsPath = path.join(__dirname, '/');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                interaction.client.commands.set(command.data.name, command);
            }
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                commands.push(command.data.toJSON());
            }
            const rest = new REST({ version: '9' }).setToken(config.BOT.token);
            rest.put(Routes.applicationGuildCommands(config.BOT.clientId, config.BOT.guildId), { body: commands })
                .then(() => console.log('DEBUG: Successfully registered application commands.'))
                .catch(console.error);
        })
        .then(() => interaction.client.login(config.BOT.token))
        .then(() => {
            console.log("DEBUG: Client Online!")
            if(config.DEBUG.deploy) {
                interaction.client.channels.cache.get(config.DEBUG['log-channel']).send({embeds: [startapp]})
            }    
        })
	},
};
