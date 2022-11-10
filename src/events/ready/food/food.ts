import cron from "node-cron";
import EmbedData from "../../../configs/bot/embeds.json";
import foodConf from "../../../configs/food.json";
import * as utils from "../../../utils/utils";

module.exports = {
    name: "ready",
    once: false,
    async execute(client: any) {
        let channel = client.channels.cache.get(foodConf.permanentChannelFood);

        let data: any = await utils.getStravaData("today", "", false);

        let color: number = 0x000000;
        if (data.length === 1 && data[0].name == "Nastala chyba") {
            color = 0x7d2828;
        } else {
            color = 0x4e7d28;
        }

        let embed = {
            color: color,
            title: "🍽️ Jídelní lístek",
            fields: data,
            footer: {
                text: EmbedData.footer.text,
                iconURL: EmbedData.footer.icon_url,
            },
        };
        let todayDate = new Date();
        let checkDate = todayDate.getDay() === 0 || todayDate.getDay() === 6;

        let contentMsg = checkDate ? "" : `||<@&${foodConf.permanentRoleFood}>||`;
        if (todayDate.getHours() === 4 && todayDate.getMinutes() === 0) {
            channel.send({ content: contentMsg, embeds: [embed] }).then((msg: any) => {
                cron.schedule("0 4 * * *", () => {
                    msg.delete();
                    channel.send({ content: contentMsg, embeds: [embed] });
                });
            });
        }

        client.on("interactionCreate", async (interaction: any) => {
            if (!interaction.isButton()) return;
            if (interaction.customId === "500") {
                let commandName = interaction.message.interaction.commandName;
                commandName = commandName.split("jídlo ");
                commandName = commandName[1];
                let embed: any = interaction.message.embeds[0].data;
                embed.fields = await utils.getStravaData(commandName, interaction.message.embeds[0].data.timestamp, true);
                embed.title = "🍽️ Alergeny";
                embed.color = 0xd18700;
                return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
            }
        });
    },
};
