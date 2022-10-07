export function process(input,output) {
    if( output && output.sourceData && output.sourceData.dimension && output.sourceData.dimension.time && output.sourceData.dimension.time.category && output.sourceData.dimension.time.category.label ) {
        output.categories.time = Object.keys(output.sourceData.dimension.time.category.label).map(function (el, i) {
            return el.slice(-2) + "-" + el.substring(0,4)
        });
    } else {
        console.error("processor timeMonthly: invalid input")
    }
}
