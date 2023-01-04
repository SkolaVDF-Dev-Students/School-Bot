import BotData from "../configs/bot/bot.json";
import StatusConf from "../configs/bot/status.json";
import { println } from "../utils/utils";
module.exports = {
    name: "ready",
    once: false,
    async execute(client: any) {
        let guild = await client.guilds.fetch(BotData.guildId);
        await guild.members.fetch();
        println("coreLoad", "Bot Core - Loaded")
        println("onlineInfo", [
            "Action: Started - Online", 
            `Logged as: ${client.user.tag}`, 
            `DiscordJS version: ${await (await import("../../package.json")).dependencies["discord.js"]}`,
            "Bot Core state: BareBones(Basic)"
        ])
        //ready
        client.user.setStatus("away");
        var i = 0;
        setInterval(() => {
            client.user.setPresence({ activities: [{ name: "" }], status: StatusConf.slots });
            client.user.setActivity(StatusConf.slots[i], { type: StatusConf.type });
            i++;
            i = i % StatusConf.slots.length;
        }, StatusConf.interval);
    },
};
