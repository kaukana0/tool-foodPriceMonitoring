import JSONstat from "../../redist/jsonStat/import.mjs"
export function process(inputData, output) {
    output.source = JSONstat(inputData)
}