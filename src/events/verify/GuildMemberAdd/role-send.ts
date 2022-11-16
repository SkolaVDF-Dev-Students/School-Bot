import { unverified_role_id } from "../../../configs/veify.json"
import { ActionRowBuilder, ButtonBuilder, Embed, EmbedBuilder } from "discord.js"
module.exports = {
    name: "guildMemberAdd",
    async execute(member:any) {
        await member.roles.add(unverified_role_id)
        const emebed = new EmbedBuilder()
        .setTitle("Ovění")
        .setDescription("")
        member.send()
    }
}