import fs from 'fs';
import os from 'os';
import chalk from 'chalk'

export const oututDirectory = "./output";

export async function writeToFile(data: string, fileName: string) {
    if (!fs.existsSync(oututDirectory)) {
        fs.mkdirSync(oututDirectory);
    }

    let file: string = `${oututDirectory}/${fileName}`;
    fs.writeFile(file, data, (err) => {
        if (err) throw err;
        log(MessageType.INFO, `${chalk.greenBright("Success")} - Data written to file: ${file}`);
    });
}

export async function jsonFromFile(file: string) {
    let rawdata = fs.readFileSync(file, null) as any;
    let json = JSON.parse(rawdata);

    return json;
}

export enum MessageType {
    ERROR, WARN, INFO, DEBUG
}

export function generateTimeStamp(isFriendly?: boolean) {
    var time = new Date();
    let y = time.getFullYear();
    let m = time.getMonth();
    let d = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    // add a zero in front of numbers<10
    hour = padTime(hour);
    min = padTime(min);
    sec = padTime(sec);

    if (isFriendly) {
        let timeStamp: string = `[${y}-${m}-${d} ${hour}:${min}:${sec}]`

        return timeStamp;
    } else {
        let timeStamp: string = `${y}${m}${d}_${hour}${min}${sec}`

        return timeStamp;
    }

}

export function log(messageType: MessageType, message: string) {
    let timeStamp = generateTimeStamp(true);

    switch (messageType) {
        case MessageType.ERROR:
            console.error(`${timeStamp} | ERROR: ${message}`)
            break;
        case MessageType.WARN:
            console.warn(`${timeStamp} | WARN: ${message}`)
            break;
        case MessageType.INFO:
            console.info(`${timeStamp} | INFO: ${message}`)
            break;
        case MessageType.DEBUG:
            console.debug(`${timeStamp} | DEBUG: ${message}`)
            break;
    }
}

function padTime(i: any) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

export class DeserializeJSON {
    /**
     * Instantiates and object of 'this' type or provided class type
     * @param json 
     * @param mod module | namespace
     * @param clazz class
     * @returns object of type 'this' or clazz
     */
    public deserializeFromJson(json: JSON, mod?: any, clazz?: any) {
        var instance: any = clazz ? clazz : this;
        for (var prop in json) {
            if (!json.hasOwnProperty(prop)) {
                continue;
            }
            // If nested object call recusively
            if (typeof json[prop] === 'object' && json[prop]) {
                instance[prop] = this.deserializeFromJson(json[prop], mod, mod[prop] as typeof clazz);
            } else {
                instance[prop] = json[prop];
            }

        }
        return instance;
    }
}