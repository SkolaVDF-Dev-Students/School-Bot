import axios from "axios";
import { toJson as xml2json } from "xml2json";
import cron  from "node-cron";

export function getDate(today: boolean, date: string) {
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

export function extractDataFromStrava(parsed: any, switcher: boolean, date: string = "", alergeny: boolean = false) {
    let dateChecker = getDate(switcher, date);

    if (dateChecker === 404) return [{ name: "Trefil jsem se na víkend", value: "Jenže o víkendu se nic nevaří." }];

    if (dateChecker === 401) return [{ name: "Nastala chyba", value: "Nejspíš bylo zadáno špatné datum, zkus to znovu." }];

    let days = parsed.jidelnicky.den;

    let foods: { name: string; value: string }[] = [];
    let secondCheck = 0;
    days.forEach((day: any) => {
        if (day.datum == dateChecker) {
            day.jidlo.forEach((food: any) => {
                let alergen = food.alergeny;
                if (food.alergeny !== "") {
                    alergen = alergen.split("|");
                    alergen.pop();
                    alergen = alergen.join(", ");
                } else {
                    alergen = "Žádná data o alergenech nejsou dostupná";
                }
                foods.push({
                    name: food.druh,
                    value: alergeny ? alergen : food.nazev,
                });
            });
        } else {
            secondCheck += 1;
        }
    });

    if (foods.length <= 0 && secondCheck > 0) return [{ name: "Nastala chyba", value: "Na toto datum jsme nenašli žádné jídlo." }];

    return foods;
}

export async function getStravaData(format: string, date: string, alergeny: boolean = false) {
    let data = await axios.get("https://www.strava.cz/strava5/Jidelnicky/XML?zarizeni=6218");

    if (data.status != 200) return data.statusText;

    let parsedToJson: any = xml2json(data.data);
    let parsed: any = JSON.parse(parsedToJson);

    switch (format) {
        case "today":
            return extractDataFromStrava(parsed, true, "", alergeny);
        case "tomorrow":
            return extractDataFromStrava(parsed, false, "", alergeny);
        case "date":
            return extractDataFromStrava(parsed, true, date, alergeny);
        default:
            return "Something happened whoops";
    }
}

module.exports = async (client: any) => {
    setInterval(() => {});

    client.on("interactionCreate", async (interaction: any) => {
        if (!interaction.isButton()) return;
        if (interaction.customId === "500") {
            let commandName = interaction.message.interaction.commandName;
            commandName = commandName.split("food ");
            commandName = commandName[1];
            let embed: any = interaction.message.embeds[0].data;
            embed.fields = await getStravaData(commandName, interaction.message.embeds[0].data.timestamp, true);
            embed.title = "🍽️ Alergeny";
            embed.color = 0xd18700;
            return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
        }
    });
};
