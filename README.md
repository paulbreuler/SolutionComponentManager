# SolutionComponentManager

![CDS Assistant CLI](./readmeResources/CLI-Screenshot.png)

## How to use (Important!)

Update the .vscode/launch.json configuration args to test various commands with debugging enabled.

Add the file `src\RunSettings.development.ts` (This file is ignored, DO NOT commit it to the repo), which is templated in `tests\RunSettings.development.template.ts`. Copy the file to the specified location, then modify the values for your environment. The tool currently does not support adding credentials at runtime.

Make sure to update the import paths to the following
```TypeScript
import { IAuthParams, GrantType } from './Authentication/AuthParams'
import { IEnvironmentDetails } from './Authentication/EnvironmentDetails'
 ```

### Examples
To run directly build the project and execute from node in terminal.

``` bash
npm i
npm run build
node dist/index <argument>
```

Get solution summary example:

```bash
node dist/index GetSolutionComponentsSummaries b0367b29-ed8a-ea11-a812-000d3a579ca6
```

Output:
```
[2020-4-22 16:26:37] | INFO: Retrieving components for solution with ID: b0367b29-ed8a-ea11-a812-000d3a579ca6
[2020-4-22 16:26:38] | INFO: Success - Data written to file: ./output/solComponentSummaries_b0367b29-ed8a-ea11-a812-000d3a579ca6_2020422_162638.json
```

Compare two solution summaries example:
```bash
node dist/index CompareSolutionSummaries --solutionPathA 'output\solComponentSummaries_65f50035-1568-4fe3-8c91-23029097202d_2021019_232642.json' --solutionPathB 'output\solComponentSummaries_496c3d5b-7b5a-eb11-a812-000d3a8c9261_2021019_225254.json' --outputAsTable true
```

Output:
```
[2021-0-20 17:25:18] | INFO: Comparing solution output\solComponentSummaries_65f50035-1568-4fe3-8c91-23029097202d_2021019_232642.json to solution output\solComponentSummaries_496c3d5b-7b5a-eb11-a812-000d3a8c9261_2021019_225254.json
[2021-0-20 17:25:18] | INFO: Comparison Result: false
[2021-0-20 17:25:18] | INFO: There are 3 unique result(s) From solutionPathA: [{"componentType":62,"displayName":"CRM Hub","uniqueName":"CRMHub","isManaged":true},{"componentType":80,"displayName":"CRM Hub","uniqueName":"CRMHub","isManaged":true},{"componentType":61,"displayName":"Legacy_Crm_Icon.png","uniqueName":"msdyn_/Images/Legacy_Crm_Icon.png","isManaged":true}]
[2021-0-20 17:25:18] | INFO: There are 1 unique result(s) From solutionPathB: [{"componentType":1,"displayName":"Account","uniqueName":"account","isManaged":true}]
[2021-0-20 17:25:18] | INFO:
┌──────────┬───────────────┬─────────────────────┬───────────────────────────────────┬───────────┐
│ Solution │ componentType │ displayName         │ uniqueName                        │ isManaged │
├──────────┼───────────────┼─────────────────────┼───────────────────────────────────┼───────────┤
│ A        │ 62            │ CRM Hub             │ CRMHub                            │ true      │
├──────────┼───────────────┼─────────────────────┼───────────────────────────────────┼───────────┤
│ A        │ 80            │ CRM Hub             │ CRMHub                            │ true      │
├──────────┼───────────────┼─────────────────────┼───────────────────────────────────┼───────────┤
│ A        │ 61            │ Legacy_Crm_Icon.png │ msdyn_/Images/Legacy_Crm_Icon.png │ true      │
├──────────┼───────────────┼─────────────────────┼───────────────────────────────────┼───────────┤
│ B        │ 1             │ Account             │ account                           │ true      │
└──────────┴───────────────┴─────────────────────┴───────────────────────────────────┴───────────┘
```

## Live build / debug

Use `npm run build:watch` to track file changes and run the debugger in VS Code.

## Contributing

DO NOT MODIFY THE MASTER BRANCH. 

Please create a separate branch and create pull requests to merge changes.
