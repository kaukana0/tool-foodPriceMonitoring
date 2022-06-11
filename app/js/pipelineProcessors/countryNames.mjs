export function process(inputData, output) {
    const names = {
        DE: "Germany",
        EU: "European Union"
    }
    for (const key in names) {
        if(output.countries.has(key)) {
            output.countries.set(key,names[key])
        }
    }
}