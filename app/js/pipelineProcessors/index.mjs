export function process(inputData, output) {
    output.indices = new Map()         // ordered by insertion

    // use Optional Chaining once available
    if(inputData && inputData.dimension && inputData.dimension.indx && inputData.dimension.indx.category && inputData.dimension.indx.category.label) {
        for (const k in inputData.dimension.indx.category.label) {
            output.indices.set(k, inputData.dimension.indx.category.label[k])
        }
    } else {
        console.error("processorIndex: invalid input")
    }
}