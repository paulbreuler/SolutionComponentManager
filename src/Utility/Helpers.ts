import fs from 'fs';
import os from 'os';
import chalk from 'chalk'

export async function writeToFile(data: string, fileName: string) {
    let dir = "./output";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    let file: string = `${dir}/${fileName}`;
    fs.writeFile(file, data, (err) => {
        if (err) throw err;
        log(MessageType.INFO, `${chalk.greenBright("Success")} - Data written to file: ${file}`);
    });
}

export enum MessageType {
    ERROR, WARN, INFO, DEBUG
}

export function log(messageType: MessageType, message: string) {
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

    let timeStamp: string = `[${y}-${m}-${d} ${hour}:${min}:${sec}]`

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