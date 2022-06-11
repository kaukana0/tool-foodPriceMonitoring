import JSONstat from "../../redist/jsonStat/import.mjs"

export function process(input,output) {
    output.codes.time = Object.keys(input.dimension.time.category.label).map(function (el, i) {
        return el.slice(-2) + "-" + el.substring(0,4)
    });
}
