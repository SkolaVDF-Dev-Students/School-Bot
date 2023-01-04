import { println } from "../utils/utils";

module.exports = {
    name: "interactionCreate",
    execute(interaction:any) {
        println("debug", `Interaction: ${interaction.user.tag} -> #${interaction.channel.name}`)
    },
};
