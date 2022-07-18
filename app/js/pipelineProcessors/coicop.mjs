export function process(inputData, output) {
    output.coicops = new Map()         // ordered by insertion

    // use Optional Chaining once available
    if(inputData && inputData.dimension && inputData.dimension.coicop && inputData.dimension.coicop.category && inputData.dimension.coicop.category.label) {
        for (const k in inputData.dimension.coicop.category.label) {
            output.coicops.set(k, inputData.dimension.coicop.category.label[k])
        }
    } else {
        console.error("processorCoicop: invalid input")
    }
}
