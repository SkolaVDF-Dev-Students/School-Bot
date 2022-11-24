import { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, Embed} from "discord.js";
module.exports = {
    name: "interactionCreate",
    async execute(interaction:any) {
        //Handler for button in verify channel
        //if(interaction.isButton()) return;
        
        const filter = (i:any) => i.customId === 'start-verify';

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        const process = new EmbedBuilder()
        .setTitle("Čekám na vyplnění")
        .setColor("Orange")
        .setDescription("Info zpráva to tom že se zobrazí modal a že začne vyplňovat")
        collector.on('collect', async (i:any) => {
	        await i.update({embeds:[process], components: []});
            console.log("1")
            await collector.stop("idk");
            console.log("2")
        });

        collector.on('end', (collected:any) => console.log(`Collected ${collected.size} items`));
    }
}