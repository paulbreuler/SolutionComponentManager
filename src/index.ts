#!/usr/bin/env node

import program from 'commander';
import * as Commands from "./Commands"
import chalk from 'chalk'
import * as Helpers from './Utility/Helpers'
var Table = require("cli-table3");

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
            .requiredOption("--solutionPathA <path_to_solution1>", "REQUIRED | Path to first solution")
            .requiredOption("--solutionPathB <path_to_solution2>", "REQUIRED | Path to second solution")
            .option("--outputAsTable <true|false>", "Output report as a formatted table", false)
            .action(async (options) => {
                Helpers.log(Helpers.MessageType.INFO, chalk.white.bold(`Comparing solution ${options.solutionPathA} to solution ${options.solutionPathB} `));
                let response = await Commands.CompareSolutionSummaries(options.solutionPathA, options.solutionPathB);

                Helpers.log(Helpers.MessageType.INFO, chalk.white.bold(`Comparison Result: ${response.isEqual}`));
                Helpers.log(Helpers.MessageType.INFO, chalk.white.bold(`There are ${response.uniqueFromPathA.length} unique result(s) From solutionPathA: ${JSON.stringify(response.uniqueFromPathA)}`));
                Helpers.log(Helpers.MessageType.INFO, chalk.white.bold(`There are ${response.uniqueFromPathB.length} unique result(s) From solutionPathB: ${JSON.stringify(response.uniqueFromPathB)}`));
                if (options.outputAsTable)
                    OutputTable(response);
            });

        program.parse(process.argv)
    }
}

// TODO make keys headers to make this more generic.
function OutputTable(input: Commands.ISolutionCompareResponse) {
    var table = new Table({
        head: ["Solution"].concat(Object.keys(input.uniqueFromPathA[0])),
        style: {
            head: []    //disable colors in header cells
            , border: []  //disable colors for the border
        }
    });

    input.uniqueFromPathA.forEach((e) => {
        table.push(["A"].concat(Object.values(e)));
    })

    input.uniqueFromPathB.forEach((e) => {
        table.push(["B"].concat(Object.values(e)));
    })

    Helpers.log(Helpers.MessageType.INFO, chalk.white.bold(`\n${table.toString()}`));
}

CdsCLI.initialize();