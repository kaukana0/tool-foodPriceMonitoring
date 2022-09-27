export function process(input,output) {
    if(!output.categories) {
        output.categories = {}
    }

    // use Optional Chaining once available
    if(input && input.dimension && 
        input.dimension.unit && input.dimension.unit.category && input.dimension.unit.category.label &&
        input.dimension.indx && input.dimension.indx.category && input.dimension.indx.category.label &&
        input.dimension.coicop && input.dimension.coicop.category && input.dimension.coicop.category.label
    ) {
        output.categories.unit = new Map(Object.entries(input.dimension.unit.category.label))
        output.categories.index = getIndices(input.dimension.indx.category.label)
        output.categories.coicop = new Map(Object.entries(input.dimension.coicop.category.label))
    } else {
        console.error("processor indicators: invalid input")
    }
}

// this whole ugly thing just to get HICP topmost...
function getIndices(bla) {
    let retVal = new Map()
    const o = bla
    if(o["HICP"]) {retVal.set("HICP", o["HICP"])}
    for (const e in o) { retVal.set(e, o[e]) }
    return retVal
}