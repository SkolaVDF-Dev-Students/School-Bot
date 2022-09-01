import { Embed, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import axios from "axios";

async function getStravaData(format: string): Promise<string> {
    let data = await axios.get("https://www.strava.cz/strava5/Jidelnicky?zarizeni=6218");
    return data.data;
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
