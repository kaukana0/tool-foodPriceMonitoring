// cumulative regarding time dimension

export function process(inputData, output) {
    if(output.sourceData) {
        //console.debug("dims before merge: ", output.sourceData.size)
        //console.debug("#values before merge: ", Object.keys(output.sourceData.value).length)
        //console.debug("values before merge: ", output.sourceData.value)
        merge(inputData, output)
        //console.debug("dims after merge: ", output.sourceData.size)
        //console.debug("#values after merge: ", Object.keys(output.sourceData.value).length)
        //console.debug("values after merge: ", output.sourceData.value)
    } else {
        output.sourceData = inputData
    }
}


function merge(inputData, output) {
    interleaveTimeDimData(inputData, output)
    appendTimeDimMetadata(inputData, output)
}


function appendTimeDimMetadata(inputData, output) {
    // increase cardinality
    output.sourceData.size[output.sourceData.size.length-1] =
        parseInt(output.sourceData.size.slice(-1)[0]) + parseInt(inputData.size.slice(-1)[0])

    // append dim label
    output.sourceData.dimension.time.category.label = {...output.sourceData.dimension.time.category.label, ...inputData.dimension.time.category.label}

    // append dim index
    const offset = Object.keys(output.sourceData.dimension.time.category.index).length
    Object.entries(inputData.dimension.time.category.index).forEach(([key, value]) => {
        output.sourceData.dimension.time.category.index[key] = value+offset
    })
}


function interleaveTimeDimData(inputData, output) {
    // [1,2,4,26,33,time]
    const ab = interleave(
        output.sourceData.value,
        inputData.value,

        output.sourceData.size.reduce((a,b) => a*b),
        inputData.size.reduce((a,b) => a*b),

        output.sourceData.size.slice(-1)[0],
        inputData.size.slice(-1)[0]
    )
    output.sourceData.value = ab
}


// alternately take #nA elements from obj a and #nB elements from obj b.
function interleave(a, b, lA, lB, nA, nB) {
    let ab = {}
    let undefinedValues = 0

    for(let i=0,ia=0,ib=0,ca=0,cb=0; i<lA+lB; i++) {
        if(ca<nA) {
            if(a.hasOwnProperty(ia)) {
                ab[i] = a[ia]
            } else {
                undefinedValues++
            }
            ia++
            ca++
        } else {
            if(cb<nB) {
                if(b.hasOwnProperty(ib)) {
                    ab[i] = b[ib]
                } else {
                    undefinedValues++
                }
                ib++
                cb++
            } else {
                ca=0
                cb=0
                i--
            }
        }
    }

    const sparsity = (lA+lB)/undefinedValues
    if(sparsity > 2) {
        console.debug("sourceData processor: More than 50% of cells are empty.")
    }

    return ab
}

function testInterleave() {
    const a = {0:0, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6 ,7:7}
    const b = {0:10, 1:11, 2:12, 3:13, 4:14, 5:15, 6:16 ,7:17, 8:18, 9:19, 10:20, 11:21}
    console.log("TEST", interleave(a,b,2,3))   // [0, 1, 10, 11, 12, 2, 3, 13, 14, 15, 4, 5, 16, 17, 18, 6, 7, 19, 20, 21]
    console.log("TEST", interleave({0:"a",2:"b"},{0:"c",3:"d"},3,4))
}
//testInterleave();throw new Error()
