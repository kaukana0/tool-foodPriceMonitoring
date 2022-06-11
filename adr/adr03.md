# 3. Declarative vertical sizing and bootstrap

Date: 2022-05

## Status

WIP

## Context

Assume that in a bootstrap container there are a bunch of rows.

There is no way to tell bootstrap: "some rows should be as high as their content, and the remaining rows should take up the remaining horizontal space automatically - possibly even with a given proportion". In essence, grow automatically in height.
The proportion could be - for instance - if there are 3 elements 20:60:20.

Some alternative approaches:

1. 10 years ago, there were css-expressions like:
    - height: expression(this.parentElement.height - (this.offsetHeight + this.clientTop)
    - but that's not supported anymore
2. do it programmatically in an imperative fashion
3. fiddle with "max-height" and "min-height" for each row until it fits

## Decision

3 because it it works, has the least amount of code and is declarative.

## Consequences

Probably some special cases might not be able to be addressed.