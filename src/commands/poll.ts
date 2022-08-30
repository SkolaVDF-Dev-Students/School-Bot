import { EmbedBuilder, Permissions, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";
import fs from "node:fs";
import config from "../config/config.json";
import pollpath from "../store/poll.json";
module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Allows you to vote about something")
        .addStringOption((option) => option.setName("text").setDescription("Write your idea").setRequired(true))
        .addAttachmentOption((option) => option.setName("image").setDescription("Pïn some image")),
    async execute(interaction:any) {
        var poll = new EmbedBuilder()
            .setTitle("» Poll «")
            .setColor("#16e1ab")
            .setDescription(interaction.options.getString("text") + `\n\n> **User: <@${interaction.user.id}>**`)
            .setFooter({ text: config.EMBEDS["footer-text"], iconURL: config.EMBEDS["footer-icon"] })
            .addFields({ name: "👍 **Up Votes**", value: "**0**", inline: true }, { name: "👎 **Down Votes**", value: "**0**", inline: true })
            .addFields({ name: "Poll ends in:", value: `<t:${Math.round(new Date().setDate(new Date().getDate() + 5) / 1000)}:R>` })
            .setThumbnail(interaction.user.avatarURL({ size: 128 }));
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("498").setStyle(ButtonStyle.Secondary).setEmoji("👍"),
            new ButtonBuilder().setCustomId("499").setStyle(ButtonStyle.Secondary).setEmoji("👎")
        );
        if (interaction.options.getAttachment("image")) {
            let img = await interaction.options.getAttachment("image").url;
            await poll.setImage(img);
            await interaction.reply({ embeds: [poll], components: [row], fetchReply: true }).then(async (message:any) => {
                saveToJSON(message.channelId);
            });
        } else {
            await interaction.reply({ embeds: [poll], components: [row], fetchReply: true }).then(async (message:any) => {
                saveToJSON(message.id);
            });
        }

        function saveToJSON(id:any) {
            fs.readFile(pollpath, (err:any, res:any) => {
                if (err) return console.error(err);
                let data = JSON.parse(res);
                const messageObject = {
                    id: id,
                    end: new Date().setDate(new Date().getDate() + 1),
                    up: 0,
                    down: 0,
                    users: [],
                };
                data.push(messageObject);
                fs.writeFile(pollpath, JSON.stringify(data), (err) => {
                    if (err) console.error(err);
                });
            });
        }
    },
};
