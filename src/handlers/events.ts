import path from "node:path";
import fs from "node:fs";
module.exports = async (client:any) => {
    const eventsPath = path.join(__dirname, '../events/');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        console.log("[","\x1b[42m","E","\x1b[0m","]","\x1b[4m", file, "\x1b[0m" + " Loaded!")
        if (event.once) {
            client.once(event.name, (...args: any) => event.execute(...args));
        } else {
            client.on(event.name, (...args: any) => event.execute(...args));
        }
    }
}

