import Deploy from "./deploy";
import fs from "node:fs";
import path from "node:path";

let CacheStorePath:string = path.join(__dirname,"../store/cachesystem/temp.json")
let CommandsPath:string = path.join(__dirname,"../commands")

export default async function name(client:unknown) {
    try {
        const ReadStored = fs.readFileSync(CacheStorePath,"utf-8")
        let DataStored:any = JSON.parse(ReadStored.toString())
        const DirsLength = fs.readdirSync(CommandsPath,"utf-8").length
        console.log("[", "\x1b[43m", "Commands AutoDeploy", "\x1b[0m", "]", "\x1b[0m","Checking for new commands...")
        if(DirsLength !== DataStored.TEMP.editDeploy) {
            console.log("[", "\x1b[43m", "Commands", "\x1b[0m", "]", "\x1b[0m", " New commands were detected..");
            Deploy(client)
            DataStored.TEMP.editDeploy = DirsLength
            fs.writeFileSync(CacheStorePath,JSON.stringify(DataStored),"utf-8")
        } else {
            console.log("[", "\x1b[43m", "Commands", "\x1b[0m", "]", "\x1b[0m", " No new commands were detected... Skipping");
        }
    } catch(err) {
        console.log("UTILS.ERROR(AUTODEPLOY FAIL")
        console.log(err)
    }
}
