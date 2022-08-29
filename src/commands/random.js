
const { Embed, Client, EmbedBuilder, SlashCommandBuilder, } = require('discord.js');
const axios = require("axios");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('nahodné')
		.setDescription('Vyber akci')
        .addSubcommand(subcommand =>
            subcommand
                .setName('slovo')
                .setDescription('Pošle náhodné slovo')
                .addIntegerOption(option => option.setName('počet').setDescription('Vybere kolik náhodných slov má poslat. Max 30')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('číslo')
                .setDescription('Pošle náhodnné číslo')),
	async execute(interaction) {
        let slovo = interaction.options.getSubcommand("slovo");
        let číslo = interaction.options.getSubcommand("číslo");
        if (slovo) {
            if (interaction.options.getInteger("počet") > 30) return interaction.reply({content: "EMBED: Amount to big/",embeds: [], ephemeral: true});
            await interaction.deferReply();
            let randomresponse = [];
            for (let i = 0; i < interaction.options.getInteger("počet"); i++) {
                const fetch = await axios({
                    method: "get",
                    url: "https://api.api-ninjas.com/v1/randomword",//move to config
                    Headers: {"X-Api-Key":"uEvz3m9YkP9MnP9EaMGJ2A==mzX2yJ1fhEtu1jYJ"} //move to conf
                })
                await randomresponse.push(fetch.data.word)
            };
            interaction.editReply({content: "cigus"});
        } else if (číslo) {

        }
	},
};