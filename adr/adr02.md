# 2. WEB components and bootstrap

Date: 2022-04

## Status

Accepted

## Context

The navbar component ideally uses shadow DOM.
But apparently bootstrap js within shadow DOM just doesn't work (CSS is no problem though).

Sources:
https://stackoverflow.com/questions/66687295/not-able-use-bootstrap-within-shadow-root-of-custom-elements

These are the alternatives:

1. making the component use just light DOM
2. using shadow DOM's slot mechanism
    note: content injected into shadow DOM via slot are effectively in light dom
    https://stackoverflow.com/questions/57022282/alternatives-to-bootstrap-js-does-not-work-inside-shadow-dom/57043382#57043382

## Decision

We go for 1 because 2 doesn't have any advantage (as of known right now) and is more complicated to understand (slot mechanism).

## Consequences

Advantage of some code encapsulation (flexibility and html looks nice), drawback of not using shadow dom (CSS conflicts etc.).
