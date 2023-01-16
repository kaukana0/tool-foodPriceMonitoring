// relevant only for development/troubleshooting
//import JSONstat from "../redist/jsonStat/import.mjs"
//const USE_JSONSTAT=true

// relevant only for development/troubleshooting
//import * as Visualizer from "../../components/multiDimAccess/visualizer.mjs"
//const VISUALIZE_DATA=true	// only works with non-jsonstat extraction. see comments in visualizer.mjs.

import * as MultiDim from "../components/multiDimAccess/multiDimAccess.mjs"
import {ModeEnum, getSelectboxDOMElements} from "./dynamicMultiselect.mjs"


function getDiceDims(mode, selectBoxes, selection) {
    const mapModeToDim = {}
    mapModeToDim[ModeEnum.Country] = "geo"
    mapModeToDim[ModeEnum.Unit] = "unit"
    mapModeToDim[ModeEnum.Index] = "indx"
    mapModeToDim[ModeEnum.Coicop] = "coicop"
    // first assume all are singleselect
    const diceDims = {
        unit: selectBoxes[ModeEnum.Unit].selectedKeys[0],
        indx: selectBoxes[ModeEnum.Index].selectedKeys[0],
        coicop: selectBoxes[ModeEnum.Coicop].selectedKeys[0],
        geo: selectBoxes[ModeEnum.Country].selectedKeys[0]
    }
    // but actually one COULD be multiselect - according to a mode - so overwrite accordingly
    if(mode !== ModeEnum.Monism) {
        diceDims[mapModeToDim[mode]] = selection
    }
    return diceDims
}

function getSeriesData(data, diceDims, selection, range) {
    let seriesData
    if(typeof USE_JSONSTAT === 'undefined') {
        seriesData = extractWithSpeedOptimizedAlgo(data.sourceData, diceDims, range)
    } else {
        console.warn("dynamicMultiselect: using JsonStat")
        seriesData = extractWithJsonStat(data, diceDims)
        // cut off elements in front and at the end, according to a range (ie timerange), because it extracted too much
        seriesData = seriesData.slice(range.startIdx, range.endIdx)
    }

    // put "column header" (a string) in front of the numerical values,
    // because that's the expected format for "columns" in billboard.js
    // the "col-header" is displayed in the legend.
    // col-header is actually the series' key.
    seriesData.unshift(selection)
    return seriesData
}

export function get(data, mode, range) {
    let retVal = []
    const selectBoxes = getSelectboxDOMElements()

    if(typeof VISUALIZE_DATA !== 'undefined') {
        startImage(data.sourceData)
    }

    if(mode === ModeEnum.Monism) {
        const selection = selectBoxes[ModeEnum.Country].selectedKeys[0]		// only one is selected
        const diceDims = getDiceDims(mode, selectBoxes, selection)
        retVal.push(getSeriesData(data, diceDims, selection, range))
    } else {
        // getting data of all (user) selected series one by one
        selectBoxes[mode].selectedKeys.forEach(selection => {
            const diceDims = getDiceDims(mode, selectBoxes, selection)
            retVal.push(getSeriesData(data, diceDims, selection, range))
        })
    }

    if(typeof VISUALIZE_DATA !== 'undefined') {
        Visualizer.endImage()
    }

    return retVal
}

// https://github.com/jsonstat/toolkit/issues/1  	LOL. see also adr04.md
function extractWithJsonStat(data, diceDims) {
	var subset = JSONstat(data.sourceData).Dice(
		diceDims,
		{ clone: true }
	)
	return subset.value
}

// Note: data.value might be an array or an object (see https://json-stat.org/format/#value).
function extractWithSpeedOptimizedAlgo(data, diceDims, range) {
	let retVal = []
	const valence = MultiDim.calcOrdinalValence(data.size)
	const aiu = data.dimension.unit.category.index[diceDims["unit"]]
	const aii = data.dimension.indx.category.index[diceDims["indx"]]
	const aic = data.dimension.coicop.category.index[diceDims["coicop"]]
	const aig = data.dimension.geo.category.index[diceDims["geo"]]

	for(let it=range.startIdx; it<range.endIdx; it++) {
		const i = MultiDim.getIndex(valence, [0,aiu,aii,aic,aig,it])
		if(typeof data.value[i] === 'undefined') {
			retVal.push(null)
		} else {
			retVal.push(data.value[i])
		}
		if(typeof VISUALIZE_DATA !== 'undefined') {
			Visualizer.drawPixelI(i, 255,0,0,255)
		}
	}

    return retVal
}

function startImage(data) {
	Visualizer.startImage("someCanvas")
	const len = MultiDim.cartesianProduct(data.size)
	for(let i=0; i<len; i++) {
		if(data.value.hasOwnProperty(i)) {
			Visualizer.drawPixelI(i, 0,128,0,255)
		} else {
			Visualizer.drawPixelI(i, 0,0,0,255)
		}
	}
}
