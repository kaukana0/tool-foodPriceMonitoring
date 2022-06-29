# 5. Build tooling

Date: 2022-06

## Status

Accepted

## Context

Options:

1. use the usual npm + bundler way
2. try to keep dependencies as minimal as possible and maximise control over them

## Decision

Pt 2, because - as of the project situation to date - it's a proof of concept approach and one aim is to be able to have this working in 5-10 years from now.

## Consequences

- manual treeshaking
- manual updating
- linux is required to comfortably create a distributable artifact
- no minification/uglification