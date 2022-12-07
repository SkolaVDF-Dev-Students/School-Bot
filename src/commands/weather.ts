import { ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder } from "discord.js";
import EmbedData from "../configs/bot/embeds.json";
import * as utils from "../utils/utils";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("počasí")
        .setDescription("Počasí")
        .addStringOption((option) => option.setName("lokace").setDescription("Adresa / Město / Lokace").setRequired(true)),
    async execute(interaction: any) {
        await interaction.deferReply();

        let location = interaction.options.getString("lokace");
        let urlLocation = encodeURIComponent(location);
        
        let rawGeocodeData = await fetch(`https://nominatim.openstreetmap.org/search?q=${urlLocation}&format=json&addressdetails=0&featuretype=city&limit=1`);
        let geoCodeData = await rawGeocodeData.json();

        let rawWeatherData = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${geoCodeData[0].lat}&lon=${geoCodeData[0].lon}`);
        let weatherData = await rawWeatherData.json();

        let currentTemp = weatherData.properties.timeseries[0].data.instant.details.air_temperature;
        
        return interaction.editReply(currentTemp.toString());
    },
};
