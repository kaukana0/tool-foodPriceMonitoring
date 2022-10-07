# 5. Data range from web API too small

Date: 2022-10

## Status

In work

## Context

From the dissemination web API the max timerange - for our dataset in this project - can be ca. 8 years. But the data goes back to 2004 (18 years by now).

## Decision

Split all data in multiple parts.
Put some (older) data on the app's webserver in a file.
Get more recent data from web API.
Implement a merge function.

## Consequences

A bookmark to the origin dataset (which is most likely rolling - using "fixed time - last x months") - would not contain data from first data part.

The merge function could also be utilized for potential chunk loading (see also adr04 "speed issue").

Would be good if merge implementation was supported by the pipeline.
