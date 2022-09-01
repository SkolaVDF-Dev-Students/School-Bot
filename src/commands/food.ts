import { Embed, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder().setName("food").setDescription("Vrátí jídelníček pro vybrané "),
    async execute(interaction: any) {
        return interaction.reply("asda");
    },
};
