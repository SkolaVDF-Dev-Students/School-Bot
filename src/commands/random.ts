
import { Embed, Client, EmbedBuilder, SlashCommandBuilder, } from "discord.js";
import axios from "axios";
import randomwords from "random-words"
import * as deepl from 'deepl-node';
const authKey = "6469a68d-1cf7-b681-ed7f-8fa091941857:fx"; // Replace with your key
const translator = new deepl.Translator(authKey);
module.exports = {
	data: new SlashCommandBuilder()
		.setName("nahodné")
		.setDescription("Vyber akci")
        .addSubcommand(subcommand =>
            subcommand
                .setName("slovo")
                .setDescription("Pošle náhodné slovo")
                .addIntegerOption(option =>
                    option.setName("počet")
                        .setDescription("Vybere maximální počet vygenerovaných slov. Max 20")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("jazyk")
                        .setDescription("Vybere v jakém jazyce májí být náhodné slova")
                        .setRequired(true)
                        .addChoices(
                            { name: "Česky", value: "cs" },
                            {name: "Anglicky", value: "en" },)))        
        .addSubcommand(subcommand =>
            subcommand
                .setName("číslo")
                .setDescription("Pošle náhodnné číslo")
                .addIntegerOption(option =>
                    option.setName("počet")
                        .setDescription("Vybere maximální počet vygenerovaných čísel. Max 30")
                        .setRequired(true))
                .addIntegerOption(option => 
                    option.setName("od")
                    .setDescription("Umožňuje specifikovat od kterého čísla se mají náhodné čísla generovat"))
                .addNumberOption(option => 
                    option.setName("do")
                        .setDescription("Umožňuje specifikovat do kterého čísla se mají náhodné čísla generovat. Max 9999"))
                .addStringOption(option => 
                    option.setName("záporné")
                        .setDescription("Umožnujě specifikovat zda mají čísla být zaporná nebo kladná")
                        .addChoices(
                            { name: "Všechny", value: "all" },
                            { name: "Nahodně", value: "random"}
                        )
                )),
	async execute(interaction:any) {
        if (interaction.options.getSubcommand() === "slovo") {
            if (interaction.options.getInteger("počet") > 20) return interaction.reply({content: "EMBED: Vybral jsi až moc velké číslo Max 20"})
            await interaction.deferReply();
            let randomresponse = "";
            for (let i = 0; i < interaction.options.getInteger("počet"); i++) {
                if (interaction.options.getString('jazyk') == "cs") {
                    const result:any = await translator.translateText(randomwords(1)[0], null, 'cs');
                    randomresponse += `${result.text}\n`;
                } else {
                    randomresponse += `${randomwords(1)}\n`;
                }
            };
            if (interaction.options.getString("jazyk") == "cs") return interaction.editReply({content: "CS: Může být nepřesný \n\n" + randomresponse})
            if (interaction.options.getString("jazyk") == "en") return interaction.editReply({content: "En: Přesný \n\n" + randomresponse})
            
        }
        if (interaction.options.getSubcommand() === "číslo") {
            if (interaction.options.getInteger("počet") > 30) return interaction.reply({content: "EMBED: Vybral jsi až moc velké číslo Max 30"})
            await interaction.deferReply();
            let randomresponse = "";
            function getRandomInt(from: any = 0, to: any = 9999, negative: string) {
                if (from === null) from = 0
                if (to === null) from = 9999
                from = Math.ceil(from);
                to = Math.floor(to);
                let random = Math.floor(Math.random() * (to - from) + from);
                if (negative == "all") return Math.abs(random) * -1
                else if (negative == "random") {
                    console.log("1")
                    if (random > Math.round(random / 100 * Math.random() * 100)) return Math.abs(random) * -1
                } else {
                    return random
                }
            }
                  
            
            for  (let i = 0; i < interaction.options.getInteger("počet"); i++) {
                //randomresponse += `${getRandomInt(interaction.options.getInteger("od") = , interaction.options.getInteger("from") || null, interaction.options.getString("záporné"))}\n`
                console.log(getRandomInt(interaction.options.getInteger("od"), interaction.options.getInteger("do"), interaction.options.getString("záporné")))
            }
            
            interaction.editReply({ content: "Random číslos:" + randomresponse})
        }
	},
};