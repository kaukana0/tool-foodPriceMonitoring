# 4. Speed issue

Date: 2022-06
Revision: 2022-09

## Status

Accepted, Revised

## Context

On slow mobiles, selecting a country takes a few seconds to update the chart.
Reason ist jsonStat lib's Dice() operation (toTable() and t()) takes very long.

Lib docu states that it is more of a proof-of-concept than performance optimized and the currently only github issue adresses that very problem.

Options:

1. live with it
2. write own dice OP

## Decision

~~Pt 1, because - as of the project situation to date - the effort is higher than the benefit. 2022-09~~

Pt 2, because recently more data became available (many years back) and the problem became obviously a showstopper.

Alternative would have been, at this point in development time (2022-09), to not load all data up-front and to do a server request on each user interaction. That means changing architecture of the app (pipeline, getting metadata before data or putting metadata in some files so not loading it from datasource, etc...).

## Consequences

~~Obviously slow on some mobiles.  2022-09~~

Slow (at least ~5s on decent network) on initial load of the page.
Possible remedy: put raw data (compressed) in localstorage and check on page load metadata (SDMX API has it) if things have updated on the server.
