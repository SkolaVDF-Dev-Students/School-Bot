import { unverified_role_id } from "../../../configs/veify.json"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed, EmbedBuilder } from "discord.js"
//Send the message with buttoon to start verify proces when user joins
module.exports = {
    name: "guildMemberAdd",
    async execute(member:any) {
        await member.roles.add(unverified_role_id)
        const embed = new EmbedBuilder()
        .setTitle("Ovění")
        .setDescription("Prosím ově se BLA BLA BLA")

        const buttonrow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("start-verify")
            .setLabel("Začít proces ověření")
            .setStyle(ButtonStyle.Primary)
        )
        await member.send({content: `<@&${member.id}>`,emebeds: [embed], components: [buttonrow]})
    }
}