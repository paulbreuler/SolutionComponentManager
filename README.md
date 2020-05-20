# SolutionComponentManager

## To use

Update the .vscode/launch.json configuration args to test various commands with debugging enabled.

Add the file `src\RunSettings.development.ts` (This file is ignored, DO NOT commit it to the repo), which is templated in `tests\RunSettings.development.template.ts`. Copy the file to the specified location, then modify the values for your environment. The tool currently does not support adding credentials at runtime.

Make sure to update the import paths to the following
 - `import { IAuthParams, GrantType } from './Authentication/AuthParams'`
 - `import { IEnvironmentDetails } from "./Authentication/EnvironmentDetails"`

To run directly build the project and execute from node in terminal.

- `npm run build`
- `node dist/index.js <argument>`

## Live build / debug

Use `npm run build:watch` to track file changes and run the debugger in VS Code.

## Contributing

DO NOT MODIFY THE MASTER BRANCH. 

Please create a separate branch and create pull requests to merge changes.
