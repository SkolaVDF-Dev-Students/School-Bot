import { EmbedBuilder } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import PollConf from "../configs/poll.json";

module.exports = async (client:any) => {
    const ended = new EmbedBuilder().setDescription("This poll has ended!").setColor("#e11616");
    const alreadyvoted = new EmbedBuilder().setDescription("You already voted on this poll").setColor("#ffb923");

    // chcker function
    function check_delete() {
        fs.readFile(path.join(__dirname, "../store/poll.json"), async (err, res: any) => {
            if (err) return console.error(err);
            let data = await JSON.parse(res);
            data.forEach(async (element: { id: any; end: string | number | Date }) => {
                let channel = await client.channels.fetch(PollConf["channel_id"]);
                let message = await channel.messages.fetch(element.id);
                let difference = new Date(element.end).getTime() - new Date().getTime();
                let object = await data.find((obj: { id: any }) => obj.id === message.id);
                if (difference < 0) {
                    let updated = EmbedBuilder.from(message.embeds[0]);
                    updated.setFields(
                        { name: "👍 **Up Votes**", value: `**${object.up}**`, inline: true },
                        { name: "👎 **Down Votes**", value: `**${object.down}**`, inline: true },
                        { name: "The poll ended on:", value: `<t:${Math.round(Date.now() / 1000)}:f>` }
                    );
                    data = data.filter((obj: { id: any }) => obj.id !== message.id);
                    await fs.writeFile(path.join(__dirname, "../store/poll.json"), JSON.stringify(data), (err: any) => {
                        if (err) console.error(err);
                    });
                    await message
                        .edit({
                            embeds: [updated],
                            components: [],
                        })
                        .catch(console.error);
                }
            });
        });
    }
    setInterval(async () => {
        check_delete();
    }, 10000);
    client.on(
        "interactionCreate",
        async (interaction: any) => {
            //Vote function
            function poll_vote(action: string) {
                fs.readFile(path.join(__dirname, "../store/poll.json"), async (err, res: any) => {
                    if (err) return console.error(err);
                    let data = await JSON.parse(res);
                    let object = await data.find((obj: { id: any }) => obj.id === interaction.message.id);
                    if (data.find((obj: { id: any }) => obj.id === interaction.message.id)) {
                        if (object.users.includes(interaction.user.id)) {
                            interaction.reply({ embeds: [alreadyvoted], ephemeral: true });
                        } else {
                            if (action == "up") object.up++;
                            else if (action == "down") object.down++;
                            await object.users.push(interaction.user.id);
                            fs.writeFile(path.join(__dirname, "../store/poll.json"), JSON.stringify(data), (err: any) => {
                                if (err) console.error(err);
                            });
                            let updated = EmbedBuilder.from(interaction.message.embeds[0]);
                            updated.setFields(
                                { name: "👍 **Up Votes**", value: `**${object.up}**`, inline: true },
                                { name: "👎 **Down Votes**", value: `**${object.down}**`, inline: true },
                                { name: interaction.message.embeds[0].fields[2].name, value: interaction.message.embeds[0].fields[2].value }
                            );
                            await interaction
                                .update({
                                    embeds: [updated],
                                })
                                .catch(console.error);
                        }
                    } else {
                        interaction.reply({ embeds: [ended], ephemeral: true });
                    }
                });
            }
            // Vote
            if (interaction.customId === "498") {
                poll_vote("up");
            }
            if (interaction.customId === "499") {
                poll_vote("down");
            }
        }
    );
};
