#!/usr/bin/env node

import program from 'commander';
import * as Commands from "./Commands"
import chalk from 'chalk'
import * as Helpers from './Utility/Helpers'

class CdsCLI {
    static initialize() {
        const boxen = require("boxen");

        const greeting = chalk.white.bold("CDS Assistant CLI");

        const boxenOptions = {
            padding: { top: 1, right: 40, bottom: 1, left: 40 },
            margin: 1,
            borderStyle: "round",
            borderColor: "green",
            backgroundColor: "#555555",
            align: "center"
        };
        const msgBox = boxen(greeting, boxenOptions);

        if (process.argv.length < 3) {
            console.log(msgBox);
        }

        program.version('0.0.1')
            .description('Command line CDS Management Application')

        program
            .command("WhoAmI")
            .alias('who')
            .description('WhoAmI Dynamics Web API call')
            .action(() => Commands.WhoAmI());

        program.command("AddSolutionComponent")
            .description('Add a solution component(s) to a solution')
            .requiredOption("--solutionUniqueName <solution_unique_name>", "REQUIRED | Unique name of the solution.")
            .requiredOption("--componentId <id>", "REQUIRED | ID of the solution component.")
            .requiredOption("--componentType <type>", "REQUIRED | The solution component to add to the unmanaged solution.")
            .option("--addRequiredComponents <true|false>", "Indicates whether other solution components that are required by the solution component should also be added to the unmanaged solution.", false)
            .option("--doNotIncludeSubcomponents <true|false>", "Indicates whether the subcomponents should be included.", true)
            .action(async (options) => {
                Helpers.log(Helpers.MessageType.INFO, chalk.white.bold(`Attempting to add component to ${options.solutionUniqueName}`));
                let response = await Commands.AddSolutionComponent(options.componentId, options.componentType, options.solutionUniqueName, options.addRequiredComponents, options.doNotIncludeSubcomponents);
                let json = await response.json();
                if (response.status === 200) {

                    Helpers.log(Helpers.MessageType.INFO, `${chalk.greenBright("Success")} | Added component (${options.componentId}) of type ${options.componentType} to ${options.solutionUniqueName} solution`);
                    Helpers.log(Helpers.MessageType.INFO, `Solution component ID: ${json.id}`);
                }
            });

        program.command("GetSolutionComponents")
            .arguments('<solution_unique_name>')
            .description('Get solution component(s) from a solution')
            .action(async (solutionName) => {
                Helpers.log(Helpers.MessageType.INFO, chalk.white.bold(`Retrieving components for solution: ${solutionName}`));

                let solutioncomponentCollection = await Commands.GetSolutionComponents(solutionName);
                let data: string = JSON.stringify(solutioncomponentCollection);

                Helpers.writeToFile(data, `solComponents_${solutionName}_${Helpers.generateTimeStamp()}.json`)
            })
            .on('--help', function () {
                console.log('');
                console.log('Examples:');
                console.log('');
                console.log('  $ deploy GetSolutionComponents <solution_unique_name>');
                console.log('  $ deploy GetSolutionComponents mySolution');
            });

        program.command("GetSolutionComponentsSummaries")
            .arguments('<solution_id>')
            .description(`Get summarized solution component(s) from a solution. Output serialized to ${Helpers.oututDirectory}`)
            .action(async (solutionId: string) => {
                Helpers.log(Helpers.MessageType.INFO, chalk.white.bold(`Retrieving components for solution with ID: ${solutionId}`));

                let solutionComponentCollection = await Commands.GetSolutionComponentsSummaries(solutionId);
                let data: string = JSON.stringify(solutionComponentCollection);

                Helpers.writeToFile(data, `solComponentSummaries_${solutionId}_${Helpers.generateTimeStamp()}.json`);
            })
            .on('--help', function () {
                console.log('');
                console.log('Examples:');
                console.log('');
                console.log('  $ deploy GetSolutionComponentsSummaries <solution_id>');
                console.log('  $ deploy GetSolutionComponentsSummaries b0367b29-ed8a-ea11-a812-000d3a579ca6');
            });

            program.command("CompareSolutionSummaries")
            .description('Compare two solution component summaries')
            .requiredOption("--solutionPath <path_to_solution1>", "REQUIRED | Path to first solution")
            .requiredOption("--solutionPath2 <path_to_solution2>", "REQUIRED | Path to second solution")                        
            .action(async (options) => {
                Helpers.log(Helpers.MessageType.INFO, chalk.white.bold(`Comparing solution ${options.solutionPath} to solution ${options.solutionPath2} `));
                let response = await Commands.CompareSolutionSummaries(options.solutionPath, options.solutionPath2);
                Helpers.log(Helpers.MessageType.INFO, chalk.white.bold(`Comparison Result: ${response.isEqual}`));
                
            });

        program.parse(process.argv)
    }
}

CdsCLI.initialize();