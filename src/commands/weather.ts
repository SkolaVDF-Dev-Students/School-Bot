import { ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, time } from "discord.js";
import EmbedData from "../configs/bot/embeds.json";
import * as utils from "../utils/utils";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("počasí")
        .setDescription("Počasí na tento den")
        .addStringOption((option) => option.setName("lokace").setDescription("Adresa / Město / Lokace").setRequired(true)),
    async execute(interaction: any) {
        await interaction.deferReply();

        let location: string = interaction.options.getString("lokace");
        let urlLocation: string = encodeURIComponent(location);

        let rawGeocodeData = await fetch(`https://nominatim.openstreetmap.org/search?q=${urlLocation}&format=json&addressdetails=0&featuretype=city&limit=1`);
        let geoCodeData = await rawGeocodeData.json();

        let rawWeatherData = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${geoCodeData[0].lat}&lon=${geoCodeData[0].lon}`);
        let weatherData = await rawWeatherData.json();

        let todayForecast: Array<any> = [];

        let timeseriesData: Array<object> = weatherData.properties.timeseries;

        timeseriesData.forEach((day: any) => {
            if (utils.isToday(new Date(day.time))) {                
                todayForecast.push({
                    time: day.time,
                    air_temp: day.data.instant.details.air_temperature.toString()
                })
            }
        })

        var forecastEmbed = new EmbedBuilder()
            .setTitle("Počasí")
            .setColor("#16e1ab")
            .setDescription("test")
            .setFooter({ text: EmbedData.footer.text, iconURL: EmbedData.footer.icon_url });

        todayForecast.forEach((forecast) => {
            forecastEmbed.addFields({ name: `Air tempeature at ${forecast.time}`, value: forecast.air_temp, inline: false });
        })
        await interaction.editReply({ embeds: [forecastEmbed]});
    },
};
