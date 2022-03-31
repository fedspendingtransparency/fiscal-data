# FDG

UI for `fiscaldata.treasury.gov`

## Style Guide
FDG has a [coding style guide](style-guide.md) that is a work in progress.

## Getting Started
You will need to have Node installed to run this project.
Clone this project using this command:
`git clone https://github.com/fedspendingtransparency/dtg.git`

Install dependencies:
`npm install`

Start the project on a local server:
`npm start`

You can run unit tests with:
`npm run test`

You can run unit tests with _coverage_ via: 
`npm run tst`

Update the snapshots used in the unit tests with:
`npm run updateSnapshots`

## Post-Build Tests
Post build (integration) tests can be run for any environment once you've run a 
build (for any environment). The post-build test uses Puppeteer and 
defaults to port `9898`. If you have difficulty with using that port,
you can `npm config set post_build_test_port=<port>`. 
