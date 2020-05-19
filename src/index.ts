#!/usr/bin/env node

import program from 'commander';
import * as Commands from "./commands"
import fetch from 'node-fetch';

class CdsCLI {
    static initialize(){
        const chalk = require("chalk");
        const boxen = require("boxen");
        
        const greeting = chalk.white.bold("CDS Assistant CLI");
        
        const boxenOptions = {
         padding: {top: 1, right: 40, bottom: 1, left: 40},
         margin: 1,
         borderStyle: "round",
         borderColor: "green",
         backgroundColor: "#555555",
         align: "center"
        };
        const msgBox = boxen( greeting, boxenOptions );
        
        console.log(msgBox);
        
        program
        .version('0.0.1')
        .description('Command line CDS Management Application')
        
        program
        .command("WhoAmI")
        .alias('who')
        .description('WhoAmI Dynamics Web API call')
        .action(() => Commands.WhoAmI());
        
        program
        .command("AddSolutionComponent")
        .alias('add')
        .description('Add a solution component(s) to a solution')
        .action(() => Commands.AddSolutionComponent());

        program.parse(process.argv)
    }
}
 
CdsCLI.initialize();