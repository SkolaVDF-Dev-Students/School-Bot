module.exports = {
    name: "interactionCreate",
    async execute(interaction:any) {
        //Handler for button in verify channel
        //if(interaction.isButton()) return;
        
        const filter = (i:any) => i.customId === 'start-verify';

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i:any) => {
	        await i.update({ content: 'A button was clicked!', components: [] });
        });

        collector.on('end', (collected:any) => console.log(`Collected ${collected.size} items`));
    }
}