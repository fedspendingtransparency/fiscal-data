# Fiscal Data React/JSX/TSX Style Guide

This document serves as a coding style guide to promote consistency in the code. 

Functional Component style over Classes
Typescript over Prop Types

The overall structure of this document draws from the [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react#readme). 

### Table of Contents

1. [Basics](#basics)
1. [GraphQL Queries](#graphql-queries)
1. [Class vs Functional Components](#class-vs-functional-components)
1. [Ordering](#ordering)
1. [Naming](#naming)
1. [Props](#props)
1. [Files](#files)
1. [Methods](#methods)
1. [Quotes](#quotes)
1. [Tests](#tests)
1. [Console use](#console)

### Basics

### GraphQL Queries
GraphQL queries (I.E. `useStaticQuery`, `query`) will be in a dedicated files that export one and only one query.

Naming of query should correlate with the queried data (source).

### Class vs Functional Components
FDG uses functional components over classes. 

### Ordering
FDG uses functional components over classes. Ordering for components 
1. `useState` or other custom hooks
1. local/`private` variables  
1. local/`private` functions
1. `useEffect`
1. component `return`

### Naming
Following [Airbnb style guide](https://github.com/airbnb/javascript/tree/master/react#naming) for Naming

### Props
New components should be written in Typescript. 

`Types` should be placed in the `fdg-types.ts` file.
`interface`s should be in separate files and located in `src/models`.

### Files
Styles and unit test files will be in the same directory as their corresponding component.
Interface and type files that will/may be used by multiple components should be in the `models` folder.
`src/page-sections` folder for all page-sections used throughout the site.

### Methods
Bind event handlers for the render method in the constructor.

### Quotes
Always use double quotes (`"`) for JSX attributes, but single quotes (`'`) for all other JS.

### Tests
When _needed_, use `data-testid` to when testing.
> This allows for the use of `getByTestId` in the React Testing Library.

Newly written tests should make use of the React Testing Library. When advantageous, unit tests 
not using the React Testing Library should be refactored to do so.

### Console
Use of `console.log` should only being used while debugging code in progress or 
troubleshooting. For `console` calls that will remain in the code, use `console.info`, 
`console.warn`, or `console.error` as appropriate.
