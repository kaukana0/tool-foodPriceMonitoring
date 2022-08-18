export function process(inputData, output) {

    // in the output, distinguish by siec
    const siec = Object.keys(inputData.dimension.siec.category.label)[0]
    if(output["bySiec"] === undefined) {
        output["bySiec"] = {}
    }
    if(output["bySiec"][siec] === undefined) {
        output["bySiec"][siec] = {}
        output["bySiec"][siec].cols = []
    }

    let x = Object.values(inputData.value)
    x.unshift(Object.keys(inputData.dimension.time.category.label)[0])
    output["bySiec"][siec].cols.push(x)
}
