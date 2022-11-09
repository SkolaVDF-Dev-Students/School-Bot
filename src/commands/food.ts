import { ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder } from "discord.js";
import EmbedData from "../configs/bot/embeds.json";
import * as utils from "../utils/utils";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jídlo")
        .setDescription("Výběr možností")
        .addSubcommand((subcommand) => subcommand.setName("dnes").setDescription("Pošle dnešní jídelníček."))
        .addSubcommand((subcommand) => subcommand.setName("zítra").setDescription("Pošle zítřejší jídelníček."))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("datum")
                .setDescription("Pošle jídelníček na napsané datum.")
                .addIntegerOption((option) => option.setName("den").setDescription("Zadej den (např. 2, 5, 9, ...)").setRequired(true))
                .addIntegerOption((option) => option.setName("měsíc").setDescription("Zadej měsíc (např. 1, 6, 9, ...)").setRequired(true))
        ),
    async execute(interaction: any) {
        await interaction.deferReply();

        let date: string = "";
        if (interaction.options._hoistedOptions.length > 0) {
            let options = interaction.options._hoistedOptions;

            let year = new Date().getFullYear().toString();

            let day = options[0].value;
            let month = options[1].value;

            let strDay = "";
            let strMonth = "";

            if (day < 10) {
                strDay = day.toString();
                strDay = `0${strDay}`;
            } else {
                strDay = day.toString();
            }

            if (month < 10) {
                strMonth = month.toString();
                strMonth = `0${strMonth}`;
            } else {
                strMonth = month.toString();
            }

            date = `${year}-${strMonth}-${strDay}`;
        }
        let data: any = await utils.getStravaData(interaction.options._subcommand, date, false);

        let color: number = 0x000000;
        if (data.length === 1 && data[0].name == "Nastala chyba") {
            color = 0x7d2828;
        } else {
            color = 0x4e7d28;
        }

        let embed = {
            color: color,
            title: "🍽️ Jídelní lístek",
            fields: data,
            timestamp: date,
            footer: {
                text: EmbedData.footer.text,
                iconURL: EmbedData.footer.icon_url,
            },
        };

        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("500").setLabel("Zobrazit Alergeny").setEmoji("📜").setStyle(ButtonStyle.Secondary));

        if (data[0].name == "Nastala chyba" || data[0].name == "Trefil jsem se na víkend") {
            embed.timestamp = new Date().toISOString();
            return interaction.editReply({ content: "", embeds: [embed] });
        }
        return interaction.editReply({ content: "", embeds: [embed], components: [row] });
    },
};
