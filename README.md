# FDG

UI for `fiscaldata.treasury.gov`

## Style Guide
FDG has a [coding style guide](style-guide.md) that is a work in progress.

## Getting Started
You will need to have Node installed to run this project.
Clone this project using this command:
`git clone https://github.com/fedspendingtransparency/fiscal-data.git`

Install dependencies:
`npm install --legacy-peer-deps`

Start the project on a local server:
`npm run develop-dev`

You can run unit tests with:
`npm run test`

You can run unit tests with _coverage_ via: 
`npm run test:coverage`

Update the snapshots used in the unit tests with:
`npm run updateSnapshots`


## API Keys for Local Builds
The build pulls consumer price index data from the Bureau of Labor Statistics and GDP data from the
Bureau of Economic Analysis. Both require a free registration key.

**You do not need keys to run the project.** Without them the build uses the sample responses
committed under `static/data/`, so the site builds and runs normally, the CPI and GDP figures on the 
explainer pages will simply be out of date, and the build log will say so. 

To build with live data, register for your own keys (both are free and issued instantly):

* BLS: https://data.bls.gov/registrationEngine/
* BEA: https://apps.bea.gov/API/signup/

Then copy the template and fill in your values:

`cp .env.example .env`

`.env` is git-ignored. Never commit real keys, and never paste them into source files, anything
committed to the repository is public. 

## Troubleshoot Issues
Sometimes there might be issues when running `npm install`. Here are a few tips for 
resolving some of these issues. First run the following command:
`npm config list`
`npm install --verbose`

If the installation hangs for more han 10 minutes, type the following on your keyboard:
`[ctrl] + C` to close out the process. This should either continue running or end the installation.
Then type the following command to clean your cache and re-install:
`npm cache clean --force`
`npm install --verbose`

Sometimes the issue might be that you're missing a binding.node file in your `~/<user>/node/` directory.
Check with the dev team about adding the following files to your node folder located in your Windows user directory:
`C:/Users/<user>/node/win32-x64-72_binding.node`
`C:/Users/<user>/node/win32-x64-83_binding.node`

When you're done adding the files try to run the project locally by typing the following command:
`npm run develop-dev`

To view the app on your browser, go to the local host address
`http://localhost:8000/`

When switching branches that contain new packages run:
`npm install --verbose`


## Gatsby Builds
For builds with silent warnings that are also optimized, you can run the gatsby build and serve the app using:
`gatsby build`
`npm run serve`

To remove gatsby cache files when switching environments
`gatsby clean`


## Environment Builds
To see dev builds go to
`https://dev-fiscaldata.treasury.gov`

