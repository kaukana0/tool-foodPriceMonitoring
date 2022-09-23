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
        output.categories.index = new Map(Object.entries(input.dimension.indx.category.label))
        output.categories.coicop = new Map(Object.entries(input.dimension.coicop.category.label))
    } else {
        console.error("processor indicators: invalid input")
    }
}
