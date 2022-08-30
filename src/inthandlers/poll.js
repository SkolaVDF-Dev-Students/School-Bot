const { EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const config = require("../../config/config.json");
const poll = "src/store/poll.json"

module.exports = async (client) => {
  const ended = new EmbedBuilder().setDescription("This poll has ended!").setColor("#e11616");
  const alreadyvoted = new EmbedBuilder().setDescription("You already voted on this poll").setColor("#ffb923");

  // chcker function
  function check_delete() {
    fs.readFile(poll, async (err, res) => {
      if (err) return console.error(err);
      let data = await JSON.parse(res);
      data.forEach(async (element) => {
        let channel = await client.channels.fetch(config.COMMANDS.poll["channel-id"]);
        let message = await channel.messages.fetch(element.id);
        let difference = new Date(element.end).getTime() - new Date().getTime();
        let object = await data.find((obj) => obj.id === message.id);
        console.log(difference);
        if (difference < 0) {
          let updated = EmbedBuilder.from(message.embeds[0]);
          updated.setFields(
            { name: "👍 **Up Votes**", value: `**${object.up}**`, inline: true },
            { name: "👎 **Down Votes**", value: `**${object.down}**`, inline: true },
            { name: "The poll ended on:", value: `<t:${Math.round(Date.now() / 1000)}:R>` }
          );
          data = data.filter((obj) => obj.id !== message.id);
          await fs.writeFile(poll, JSON.stringify(data), (err) => {
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
  client.on("interactionCreate", async (interaction) => {
    //Vote function
    function poll_vote(action) {
      fs.readFile(poll, async (err, res) => {
        if (err) return console.error(err);
        let data = await JSON.parse(res);
        let object = await data.find((obj) => obj.id === interaction.message.id);
        if (data.find((obj) => obj.id === interaction.message.id)) {
          if (object.users.includes(interaction.user.id)) {
            interaction.reply({ embeds: [alreadyvoted], ephemeral: true });
          } else {
            if (action == "up") object.up++;
            else if (action == "down") object.down++;
            await object.users.push(interaction.user.id);
            fs.writeFile(poll, JSON.stringify(data), (err) => {
              if (err) console.error(err);
            });
            let updated = EmbedBuilder.from(interaction.message.embeds[0]);
            updated.setFields(
              { name: "👍 **Up Votes**", value: `**${object.up}**`, inline: true },
              { name: "👎 **Down Votes**", value: `**${object.down}**`, inline: true },
              { name: "Poll ends in:", value: `<t:${Math.round(object.end / 1000)}:f>` }
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
  });
};
