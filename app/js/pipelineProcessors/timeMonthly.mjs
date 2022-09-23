export function process(input,output) {
    if( input && input.dimension && input.dimension.time && input.dimension.time.category && input.dimension.time.category.label ) {
        output.categories.time = Object.keys(input.dimension.time.category.label).map(function (el, i) {
            return el.slice(-2) + "-" + el.substring(0,4)
        });
    } else {
        console.error("processor timeMonthly: invalid input")
    }
}
