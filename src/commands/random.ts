
import { Embed, Client, EmbedBuilder, SlashCommandBuilder, } from "discord.js";
import axios from "axios";
import randomwords from "random-words"
import * as deepl from 'deepl-node';
const authKey = "6469a68d-1cf7-b681-ed7f-8fa091941857:fx"; // Replace with your key
const translator = new deepl.Translator(authKey);
module.exports = {
	data: new SlashCommandBuilder()
		.setName('nahodné')
		.setDescription('Vyber akci')
        .addSubcommand(subcommand =>
            subcommand
                .setName('slovo')
                .setDescription('Pošle náhodné slovo')
                .addIntegerOption(option =>
                    option.setName("počet")
                        .setDescription("Vybere maximální počet vygenerovaných slov. Max 20")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('jazyk')
                        .setDescription('Vybere v jakém jazyce májí být náhodné slova')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Česky', value: 'cs' },
                            {name: 'Anglicky', value: 'en' },)))        
        .addSubcommand(subcommand =>
            subcommand
                .setName('číslo')
                .setDescription('Pošle náhodnné číslo')),
	async execute(interaction:any) {
        if (interaction.options.getSubcommand("slovo")) {
            if (interaction.options.getInteger("počet") > 20) return interaction.reply({content: "Vybral jsi až moc velké číslo"})
            await interaction.deferReply();
            let randomresponse = "";
            for (let i = 0; i < interaction.options.getInteger("počet"); i++) {
                if (interaction.options.getString('jazyk') == "cs") {
                    const result:any = await translator.translateText(randomwords(), null, 'cs');
                    randomresponse += `${result.text}\n`;
                } else {
                    randomresponse += `${randomwords()}\n`;
                }
            };
            if (interaction.options.getString("jazyk") == "cs") return interaction.editReply({content: "CS: Může být nepřesný \n\n" + randomresponse})
            if (interaction.options.getString("jazyk") == "en") return interaction.editReply({content: "En: Přesný \n\n" + randomresponse})
        } else if (interaction.options.getSubcommand("číslo")) {

        }
	},
};