# the big picture

- index - sets up the layout using bootstrap and a bunch of WebComponents
- main - does init stuff, wires incoming data to DOM elements
- pipeline - fetch data (from file or network) pick what's neccessary, shape/arrange/prepare it for further usage using "pipeline processors"
- dynamicMultiselect - sits in between main and components (i.e. selectboxes and chart). handles switching boxes between multi/singleselect.
- extraction: does OLAP style data transformation (i.e. extraction by dice-operation) to a format expected by components (i.e. chart)
