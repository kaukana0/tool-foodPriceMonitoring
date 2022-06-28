export function process(inputData, output) {
    if(output && output.countries) {
        const names = {
            DE: "Germany",
            EU: "European Union"
        }
        for (const key in names) {
            if(output.countries.has(key)) {
                output.countries.set(key,names[key])
            }
        }
    } else {
        console.error("processor countryNames: invalid input")
    }
}