import colors from "colors";
import { DebugMode } from "../Config";
import { getTime } from "./Time";

const Logger = {
    trace: () => {
        let err = new Error();
        let lines = err.stack?.split("\n");
        //@ts-ignore
        return lines[2].substring(lines[2].indexOf("("), lines[2].lastIndexOf(")") + 1)
    },

    debug: <T extends any[]> (...body: T) => {
        if(DebugMode) {
            let time = getTime();

            console.log(time + " | " + colors.cyan(`debug: `), ...body)
        }
    },

    verbos: <T extends any[]> (...body: T) => {
        let time = getTime();

        console.log(time + " | " + colors.magenta(`verbos: `), ...body)
    },

    error: <T extends any[]> (...body: T) => {
        let time = getTime();

        console.log(time + " | ", colors.red(`error: `), ...body)
    },

    warning: <T extends any[]> (...body: T) => {
        let time = getTime();

        console.log(time + " | ", colors.yellow(`warning: `), ...body)
    },

    info: <T extends any[]> (...body: T) => {
        let time = getTime();

        console.log(time + " | ", colors.blue(`info: `), ...body)
    },
}

export default Logger;