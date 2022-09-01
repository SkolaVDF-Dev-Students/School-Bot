import BotData from "../configs/bot/bot.json"
import StatusConf from "../configs/bot/status.json" 
module.exports = {
    name: "ready",
    once: false,
    async execute(client:any) {
        let guild = await client.guilds.fetch(BotData.guildId);
        await guild.members.fetch();
        console.log("\x1b[34m", "╔═════════════╗", "\x1b[0m");
        console.log("\x1b[34m", "║", "\x1b[36m", "Bot Core", "\x1b[0m", "\x1b[34m", "║", "\x1b[0m");
        console.log("\x1b[34m", "╚═════════════╝", "\x1b[0m");
        console.log("• Action:", "\x1b[33m", "Started", "\x1b[0m", "-", "\x1b[32m", "Online", "\x1b[0m");
        console.log(`• Logged as: ${client.user.tag}`);
        console.log(`• Discord Js version: ${require("../../package.json").dependencies["discord.js"]}`);
        console.log(`• Bot Core state: BareBones(Basic)`);

        //KeepAlive
        const PollHandler = require("../inthandlers/poll");
        PollHandler(client);

        //ready
        client.user.setStatus("away");
        var i = 0;
        setInterval(() => {
            client.user.setPresence({ activities: [{ name: "" }], status: StatusConf.slots});
            client.user.setActivity(StatusConf.slots[i], { type: StatusConf.type });
            i++;
            i = i % StatusConf.slots.length;
        }, StatusConf.interval);
    },
};
