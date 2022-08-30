import config from "../config/config.json";
module.exports = {
    name: "interactionCreate",
    execute(interaction: { user: { tag: string }; channel: { name: string } }) {
        if (config.DEBUG.interaction) console.log(`DEBUG Interaction =  user: ${interaction.user.tag} channel: #${interaction.channel.name}`);
    },
};
