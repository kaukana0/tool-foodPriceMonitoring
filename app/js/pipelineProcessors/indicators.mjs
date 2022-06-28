export function process(input,output) {
    output.codes = {}

    // use Optional Chaining once available
    if(input && input.dimension && 
        input.dimension.unit && input.dimension.unit.category && input.dimension.unit.category.label &&
        input.dimension.indx && input.dimension.indx.category && input.dimension.indx.category.label &&
        input.dimension.coicop && input.dimension.coicop.category && input.dimension.coicop.category.label
    ) {
        output.codes.unit = new Map(Object.entries(input.dimension.unit.category.label))
        output.codes.index = new Map(Object.entries(input.dimension.indx.category.label))
        output.codes.coicop = new Map(Object.entries(input.dimension.coicop.category.label))
    } else {
        console.error("processor indicators: invalid input")
    }
}
