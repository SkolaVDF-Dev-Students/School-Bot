module.exports = {
    name: "interactionCreate",
    execute(interaction:any) {
        console.log(`DEBUG Interaction =  user: ${interaction.user.tag} channel: #${interaction.channel.name}`);
    },
};
