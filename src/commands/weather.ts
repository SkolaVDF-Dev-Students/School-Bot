import { ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, time, AttachmentBuilder } from "discord.js";
import EmbedData from "../configs/bot/embeds.json";
import * as utils from "../utils/utils";
import { createCanvas, Image } from '@napi-rs/canvas';
import { readFile } from 'fs/promises';
import { request } from 'undici';
import test from "node:test";
import { table } from "console";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("počasí")
        .setDescription("Počasí na tento den")
        .addStringOption((option) => option.setName("lokace").setDescription("Adresa / Město / Lokace").setRequired(true)),
    // async execute(interaction: any) {
    //     await interaction.deferReply();

    //     let location: string = interaction.options.getString("lokace");
    //     let urlLocation: string = encodeURIComponent(location);

    //     let rawGeocodeData = await fetch(`https://nominatim.openstreetmap.org/search?q=${urlLocation}&format=json&addressdetails=0&featuretype=city&limit=1`);
    //     let geoCodeData = await rawGeocodeData.json();

    //     let rawWeatherData = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${geoCodeData[0].lat}&lon=${geoCodeData[0].lon}`);
    //     let weatherData = await rawWeatherData.json();

    //     let todayForecast: Array<any> = [];
    //     let timeseriesData: Array<object> = weatherData.properties.timeseries;

    //     timeseriesData.forEach((day: any) => {
    //         if (utils.isToday(new Date(day.time))) {                
    //             todayForecast.push({
    //                 time: day.time,
    //                 air_temp: day.data.instant.details.air_temperature.toString()
    //             })
    //         }
    //     })

    //     let forecastEmbed = new EmbedBuilder()
    //         .setTitle("Počasí")
    //         .setColor("#16e1ab")
    //         .setDescription("test")
    //         .setFooter({ text: EmbedData.footer.text, iconURL: EmbedData.footer.icon_url });

    //     todayForecast.forEach((forecast) => {
    //         forecastEmbed.addFields({ name: `Air tempeature at ${forecast.time}`, value: forecast.air_temp, inline: false });
    //     })
    //     await interaction.editReply({ embeds: [forecastEmbed]});
    // },

    async execute(interaction: any) {
        await interaction.deferReply();

        const applyText = (canvas: any, text: string) => {
            const context = canvas.getContext('2d');
            let fontSize = 70;

            do {
                context.font = `${fontSize -= 10}px sans-serif`;
            } while (context.measureText(text).width > canvas.width - 300);

            return context.font;
        };

        const loadLocalImage = async (pathName: string) => {
            return await readFile(`./src/assets/icons/${pathName}.png`);
        }

        let testData = [
                {
                    "temp_min": "2",
                    "temp_max": "5",
                    "icon": "rain"
                }
            ]

        const canvas = createCanvas(700, 250);
        const context = canvas.getContext('2d');

        testData.forEach(async (data) => {

            context.font = applyText(canvas, data.temp_max);
            context.fillStyle = '#ffffff';
            context.fillText(data.temp_max, canvas.width / 2.5, canvas.height / 1.8);

            let icon = await loadLocalImage(data.icon);
            let weatherIcon = new Image();
    
            weatherIcon.src = icon

            context.drawImage(weatherIcon, 0, 0, canvas.width, canvas.height);

        })


        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

        interaction.editeply({ files: [attachment] });
    }
};



