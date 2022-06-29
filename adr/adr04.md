# 4. Speed issue

Date: 2022-06

## Status

Accepted

## Context

On slow mobiles, selecting a country takes a few seconds to update the chart.
Reason ist jsonStat lib's Dice() operation (toTable() and t()) takes very long.

Lib docu states that it is more of a proof-of-concept than performance optimized and the currently only github issue adresses that very problem.

Options:

1. live with it
2. write own dice OP

## Decision

Pt 1, because - as of the project situation to date - the effort is higher than the benefit.

## Consequences

Obviously slow on some mobiles.
