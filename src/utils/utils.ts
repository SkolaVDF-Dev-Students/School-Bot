import axios from "axios";
import { toJson as xml2json } from "xml2json";
import clc from "cli-color";
import { text } from "stream/consumers";

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

    const EFormat = {
        TODAY: "dnes",
        TOMORROW: "zítra",
        DATE: "datum",
    };

    switch (format) {
        case EFormat.TODAY:
            return extractDataFromStrava(parsed, true, "", alergeny);
        case EFormat.TOMORROW:
            return extractDataFromStrava(parsed, false, "", alergeny);
        case EFormat.DATE:
            return extractDataFromStrava(parsed, true, date, alergeny);
        default:
            return [{ name: "Nastala chyba", value: "Nejspíš bylo zadáno špatné datum, zkus to znovu." }];
    }
}

/**
 * Function that prints beautified messages into console 
 * @param type Predefined set of types, each type looks different
 * @param message Main message
 * @param anotherMessage Secondary message
 */
export function println(type: "coreLoad" | "eventLoad" | "commandLoad" | "autoDeployInfo" | "commandDeploy" | "debug" | "error", message: string) {
    switch (type) {
        case "coreLoad":
            let ornaments = clc.blue;
            let ornamentsText = clc.cyan;

            let textLength = message.length;
            let postTextTop = " ╔";
            let postTextBot = " ╚";
            for (let i = 0; i < textLength + 2; i++) {
                postTextTop += "═";
                postTextBot += "═";

                if (i == textLength + 1) {
                    postTextTop += "╗";
                    postTextBot += "╝";
                }
            }

            console.clear()
            console.log(ornaments(postTextTop));
            console.log(ornaments(" ║ ") + ornamentsText(message) + ornaments(" ║"));
            console.log(ornaments(postTextBot));
            break;
        case "autoDeployInfo":
            var insideText = clc.bgYellow;
            console.log(`[ ${insideText(` Commands AutoDeploy `)} ] ${message}`);
            break;
        case "commandLoad":
            var insideText = clc.bgYellow;
            console.log(`[ ${insideText(` C `)} ] ${clc.underline(` ${message} `)} Loaded!`);
            break;
        case "eventLoad":
            var insideText = clc.bgGreen;
            console.log(`[ ${insideText(` E `)} ] ${clc.underline(` ${message} `)} Loaded!`);
            break;
        case "commandDeploy":
            var insideText = clc.bgBlue;
            console.log(`[ ${insideText(` D `)} ] ${clc.underline(` ${message} `)} Deployed!`);
            break;
        case "debug":
            var insideText = clc.bgMagenta;
            console.log(`[ ${insideText(` DEBUG `)} ] ${message}`);
            break;
        case "error":
            var insideText = clc.bgRedBright;
            var errorText = clc.redBright;
            console.log(`[ ${insideText(` ERROR `)} ] ${errorText(message)}`);
            break;
    }
}