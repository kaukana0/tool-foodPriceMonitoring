# 5. x axis ticks and labels

Date: 2022-10

## Status

Accepted

## Context

Which ticks are labeled depends on available draw width, data points to display and font-width of the labels.
The data starts at 2004.

We could either base the labelling on determination of the width of a label (via TextMetrics.width or puting text in a Div and getting it's with).
Or base it on controlling number of ticks and ticks in between labels.

## Decision

Idea 1 was discovered when the second idea was already almost completely implemented. Because time is limited and it's a bit vague which problems have to be solved when implementing the first alternative, the second approach is ultimately chosen.

## Consequences

The first 20 years are "manually" designed to fit well, after that, an automatism kicks in.

The x axis will be perfect until ca. 2028, after that - of course depending on number of datapoints selected and display width, too few labels or overlapping might occur.

When implementing the fist idea the x axis will be perfect at all times.
