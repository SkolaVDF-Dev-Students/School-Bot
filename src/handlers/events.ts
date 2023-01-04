import path from "node:path";
import fs, { Dir, read, readdir } from "node:fs";
import { nest_limit } from "../configs/bot/handlersnestlimit.json"
import { println } from "../utils/utils";
let eventsFiles:any = [];
async function LoopDir(dir:string, level:number) {
    if(level > nest_limit && nest_limit) {
        println("error", "Folder nest limit reached");
        throw new Error("Folder nest limit reached");
    }
    const elements = fs.readdirSync(dir);
    
    for(const element of elements) {
        if(element.endsWith(".ts")) eventsFiles.push(dir+element);
        else await LoopDir(path.join(dir,element,"/"), level++);
    }
}
export default async function EventsHandler(client:any) {
    const eventsPath = path.join(__dirname, '../events/');
    await LoopDir(eventsPath, 0);

    for (const file of eventsFiles) {
        const event = await import(file);
        println("eventLoad", path.basename(file));
        if (event.once) {
            client.once(event.name, (...args: any) => event.execute(...args));
        } else {
            client.on(event.name, (...args: any) => event.execute(...args));
        }
    }
}
