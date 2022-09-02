import { Embed, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { toJson as xml2json } from "xml2json";

async function getStravaData(format: string): Promise<string> {
    let data = await axios.get("https://www.strava.cz/strava5/Jidelnicky/XML?zarizeni=6218");
    let parsedToJson: any = xml2json(data.data);
    let parsed: any = JSON.parse(parsedToJson);
    return parsed.jidelnicky.den[0].jidlo[0].nazev;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("food")
        .setDescription("Výběr možností")
        .addSubcommand((subcommand) => subcommand.setName("today").setDescription("Pošle dnešní jídelníček."))
        .addSubcommand((subcommand) => subcommand.setName("tomorrow").setDescription("Pošle zítřejší jídelníček."))
        .addSubcommand((subcommand) => subcommand.setName("month").setDescription("Pošle jídelníček na celý měsíc."))
        .addSubcommand((subcommand) => subcommand.setName("permanent").setDescription("Pošle zprávu s dnešním jídelníčkem který se každých 24h aktualizuje.")),
    async execute(interaction: any) {
        let asdass: string = await getStravaData(interaction.options._subcommand);

        return interaction.reply({ content: asdass });
    },
};
