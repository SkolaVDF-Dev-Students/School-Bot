import config from "../config/config.json";

module.exports = {
    name: "ready",
    once: false,
    async execute(client: {
        guilds: { fetch: (arg0: any) => any };
        user: {
            tag: any;
            setStatus: (arg0: string) => void;
            setPresence: (arg0: { activities: { name: string }[]; status: any }) => void;
            setActivity: (
                arg0: any,
                arg1: {
                    type: any;
                }
            ) => void;
        };
    }) {
        let guild = await client.guilds.fetch(config.BOT.guildId);
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
            client.user.setPresence({ activities: [{ name: "" }], status: config.STATUS["status-slots"] });
            client.user.setActivity(config.STATUS["status-slots"][i], { type: config.STATUS["status-type"] });
            i++;
            i = i % config.STATUS["status-slots"].length;
        }, config.STATUS["status-interval"]);
    },
};
