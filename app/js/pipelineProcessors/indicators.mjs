export function process(input,output) {
    output.codes = {}
    output.codes.unit = new Map(Object.entries(input.dimension.unit.category.label))
    output.codes.index = new Map(Object.entries(input.dimension.indx.category.label))
    output.codes.coicop = new Map(Object.entries(input.dimension.coicop.category.label))
}
