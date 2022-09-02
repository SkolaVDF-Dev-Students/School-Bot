import { Embed, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { toJson as xml2json } from "xml2json";
import EmbedData from "../configs/bot/embeds.json";

function getDate(today: boolean, date: string) {
    let theDate = new Date();

    if (date !== "") {
        theDate = new Date(date);
    }

    if (Object.prototype.toString.call(theDate) === "[object Date]") {
        if (isNaN(theDate.getTime())) {
            return 401;
        }
    }

    if (!today) {
        theDate = new Date(theDate);
        theDate.setDate(theDate.getDate() + 1);
    }

    if (theDate.getDay() == 6 || theDate.getDay() == 0) return 404;

    const yyyy: number = theDate.getFullYear();
    let mm: number = theDate.getMonth() + 1;
    let dd: number = theDate.getDate();

    let dd2: string = "";
    let mm2: string = "";

    if (dd < 10) {
        dd2 = dd.toString();
        dd2 = `0${dd2}`;
    } else {
        dd2 = dd.toString();
    }

    if (mm < 10) {
        mm2 = mm.toString();
        mm2 = `0${mm2}`;
    } else {
        mm2 = mm.toString();
    }

    return `${dd2}-${mm2}-${yyyy}`;
}

function extractDataFromStrava(parsed: any, switcher: boolean, date: string = "") {
    let dateChecker = getDate(switcher, date);

    if (dateChecker === 404) return [{ name: "Trefil jsem se na víkend", value: "Jenže o víkendu se nic nevaří." }];

    if (dateChecker === 401) return [{ name: "Nastala chyba", value: "Nejspíš bylo zadáno špatné datum, zkus to znovu." }];

    let days = parsed.jidelnicky.den;

    let foods: { name: string; value: string }[] = [];
    let secondCheck = 0;
    days.forEach((day: any) => {
        if (day.datum == dateChecker) {
            day.jidlo.forEach((food: any) => {
                foods.push({
                    name: food.druh,
                    value: food.nazev,
                });
            });
        } else {
            secondCheck += 1;
        }
    });

    if (foods.length <= 0 && secondCheck > 0) return [{ name: "Nastala chyba", value: "Na toto datum jsme nenašli žádné jídlo." }];

    return foods;
}

async function getStravaData(format: string, date: string) {
    let data = await axios.get("https://www.strava.cz/strava5/Jidelnicky/XML?zarizeni=6218");

    if (data.status != 200) return data.statusText;

    let parsedToJson: any = xml2json(data.data);
    let parsed: any = JSON.parse(parsedToJson);

    switch (format) {
        case "today":
            return extractDataFromStrava(parsed, true);
        case "tomorrow":
            return extractDataFromStrava(parsed, false);
        case "date":
            return extractDataFromStrava(parsed, true, date);
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
        .addSubcommand((subcommand) =>
            subcommand
                .setName("date")
                .setDescription("Pošle jídelníček na napsané datum.")
                .addIntegerOption((option) => option.setName("den").setDescription("Zadej den (např. 2, 5, 9, ...)").setRequired(true))
                .addIntegerOption((option) => option.setName("měsíc").setDescription("Zadej měsíc (např. 1, 6, 9, ...)").setRequired(true))
        )
        .addSubcommand((subcommand) => subcommand.setName("permanent").setDescription("Pošle zprávu s dnešním jídelníčkem který se každých 24h aktualizuje.")),
    async execute(interaction: any) {
        await interaction.reply("Hledám data, vydrž moment");

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
        let data: any = await getStravaData(interaction.options._subcommand, date);
        let color: number = 0x000000;
        if (data.length === 1 && data[0].name == "Nastala chyba") {
            color = 0x7d2828;
        } else {
            color = 0x4e7d28;
        }

        const embed = {
            color: color,
            title: "🍽️ Jídelní lístek",
            fields: data,
            timestamp: new Date().toISOString(),
            footer: {
                text: EmbedData.footer.text,
                iconURL: EmbedData.footer.icon_url,
            },
        };

        return interaction.editReply({ content: "", embeds: [embed] });
    },
};
