import { Embed, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { toJson as xml2json } from "xml2json";

async function getStravaData(format: string): Promise<string> {
    let data = await axios.get("https://www.strava.cz/strava5/Jidelnicky/XML?zarizeni=6218");

    if (data.status != 200) return data.statusText;

    let parsedToJson: any = xml2json(data.data);
    let parsed: any = JSON.parse(parsedToJson);

    switch (format) {
        case "today":
            let today = new Date();
            const yyyy: number = today.getFullYear();
            let mm: number = today.getMonth() + 1; // Months start at 0!
            let dd: number = today.getDate();

            let dd2: string = "";
            let mm2: string = "";

            if (dd < 10) {
                dd2 = dd.toString();
                dd2 = `0${dd2}`;
            }

            if (mm < 10) {
                mm2 = mm.toString();
                mm2 = `0${mm2}`;
            }

            const formattedToday = `${dd2}-${mm2}-${yyyy}`;

            let days = parsed.jidelnicky.den;

            let foods: string = "";

            days.forEach((day: any) => {
                if (day.datum == formattedToday) {
                    day.jidlo.forEach((food: any) => {
                        foods += `${food.nazev} - ${food.druh} - ${food.alergeny}\n`;
                    });
                }
            });
            return foods;

        default:
            return "Something happened whoops";
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("food")
        .setDescription("Výběr možností")
        .addSubcommand((subcommand) => subcommand.setName("today").setDescription("Pošle dnešní jídelníček."))
        .addSubcommand((subcommand) => subcommand.setName("tomorrow").setDescription("Pošle zítřejší jídelníček."))
        .addSubcommand((subcommand) => subcommand.setName("date").setDescription("Pošle jídelníček na napsané datum."))
        .addSubcommand((subcommand) => subcommand.setName("permanent").setDescription("Pošle zprávu s dnešním jídelníčkem který se každých 24h aktualizuje.")),
    async execute(interaction: any) {
        let asdass: string = await getStravaData(interaction.options._subcommand);

        return interaction.reply({ content: asdass });
    },
};
