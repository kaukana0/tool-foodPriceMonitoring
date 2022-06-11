# 1. Overall Code Structure

Date: 2022-04

## Status

Accepted

## Context

The structure should be able to support many developers.
That's why there is a "toolbox", containing many components (.mjs files and web-components).
Each component is it's own git repo.
So each component can easily be reused as-is, branched off, specialised and modified to whatever each developer needs.
When creating a new project (i.e. visualization or chart), the components from the toolbox can be incorporated by using "git submodule add ..." in a certain version (commit), even of a certain branch.
And since every component is in a different git repo, there is independence, which lets a developer select exactly the versions they need for each component.

## Decision

Initial components include:

- title
- footer
- dropdown box (support for multi-select and displaying images)
- meta tags
- nav bar
- fetching data (from any location, network or file)
- processing data in a unified way ("pipeline")


## Consequences

