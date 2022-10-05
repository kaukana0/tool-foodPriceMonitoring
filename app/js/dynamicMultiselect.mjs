/*
Short description of the "dynamic multiselect" behaviour:
- the user can select multiple countries or indices or coicops
- multiselect in one box is only possible if there isn't already another box w/ multiple selections
- the legend and tooltip change depending on which box is currently multiselect
*/

import * as chart from "../components/chart/chart.mjs"

const USE_JSONSTAT=false
//import JSONstat from "../redist/jsonStat/import.mjs"



// this says which of the boxes can potentially be multiselect
export class ModeEnum {
	static Country = 0
	static Unit = 1		// the current mode will never be set to Unit; it's only there because it's also used as index for selectboxes
	static Index = 2
	static Coicop = 3
}

// a mode maps to a selectBox in the DOM.
class Mode extends ModeEnum {
	static current = Mode.Country	// this box is currently multiselect - in here, we're in that mode.
	static isCurrently(mode) {return this.current === mode}
	static set(mode) {this.current = mode; return mode}
	// note that the array el's line up w/ the values from superclass
	static getDOMElements() {
		return [
			document.getElementById("selectCountry"),
			document.getElementById("selectUnit"),
			document.getElementById("selectIndex"),
			document.getElementById("selectCoicop")
		]
	}
	static getDOMElementByMode(mode) { return this.getDOMElements()[mode] }
}

let range = {
	begin: 0,
	end: -0
}

export function setRange(_range) {
	//range = {...range, ..._range}
	range.begin = Number(_range.begin)
	range.end = Number(_range.end)
}


/*
expected parameter:

{
	data:...,   			// mandatory
	onFinished: function,	// callback; optional
	mode: ModeEnum			// optional
}

returns true if a mode switch happened
*/
export function update(params) {
	const mode = params["mode"] ? params["mode"] : Mode.current
	const onFinished = params["onFinished"] ? params["onFinished"] : null
	_update(params.data, mode, onFinished)
}



function _update(data, mode, onFinished) {
	
	const retVal = tryModeSwitch(mode)
	let modeToSeriesLabels = {}
	modeToSeriesLabels[Mode.Country] = data.categories.countries
	// Mode.Unit omitted on purpose
	modeToSeriesLabels[Mode.Index] = data.categories.index
	modeToSeriesLabels[Mode.Coicop] = data.categories.coicop
	
	const cols = extract(data, Mode.current)
	cols.unshift(data.categories.time.slice(range.begin, range.end))	// put categories (time) as first array

	chart.init({
		type: "line",
		chartDOMElementId: "chart",
		legendDOMElementId: "legend",
		cols: cols,
		fixColors: {...data.countryColors, ...data.indexColors},
		palette: data.colorPalette,
		seriesLabels: modeToSeriesLabels[Mode.current],
		suffixText: getTooltipSuffix(),
		isRotated: false,
		onFinished: onFinished
	})
	chart.setYLabel("chart", getYLabel())


	// this logic is the "nucleus" of the multiselect behaviour
	function tryModeSwitch(mode) {
		const modeStored = Mode.current
		if( Mode.getDOMElementByMode(mode).selectedKeys.length>1 ) {
			Mode.set(mode)
			switchAllToSingleSelect(mode)
		} else {
			if( Mode.getDOMElementByMode(Mode.current).selectedKeys.length<=1 ) {
				Mode.set(Mode.Country)
				switchAllToMultiSelect()
			}
		}
		return modeStored == Mode.current
	}

	function extract(data, mode) {
		let retVal = []
        const selectBoxes = Mode.getDOMElements()
		const mapModeToDim = {}
		mapModeToDim[Mode.Country] = "geo"
		mapModeToDim[Mode.Unit] = "unit"
		mapModeToDim[Mode.Index] = "indx"
		mapModeToDim[Mode.Coicop] = "coicop"

		// getting data of all (user) selected series one by one
		selectBoxes[mode].selectedKeys.forEach(selection => {
			// first assume all are singleselect
            const diceDims = {
                unit: selectBoxes[ModeEnum.Unit].selectedKeys,
                indx: selectBoxes[ModeEnum.Index].selectedKeys,
                coicop: selectBoxes[ModeEnum.Coicop].selectedKeys,
                geo: selectBoxes[ModeEnum.Country].selectedKeys
            }
			// but actually one can be multiselect - according to a mode - so overwrite accordingly
            diceDims[mapModeToDim[mode]] = [selection]

			let seriesData
			if(USE_JSONSTAT) {
				seriesData = extractWithJsonStat(data, diceDims)
				// cut off elements in front and at the end, according to a range (ie timerange), because it extracted too much
				seriesData = seriesData.slice(range.begin, range.end)
			} else {
				seriesData = extractWithSpeedOptimizedAlgo(data.originalRawInputData, diceDims)
			}


			// put "column header" (a string) in front of the numerical values,
			// because that's the expected format for "columns" in billboard.js
			// the "col-header" is displayed in the legend.
			// col-header is actually the series' key.
			seriesData.unshift(selection)

			retVal.push(seriesData)
		})

		return retVal
	}

	function switchAllToSingleSelect(exceptThisOne) {
		Mode.getDOMElements().forEach((el,idx) => {
			if(idx!==exceptThisOne) {el.removeAttribute("multiselect")}
		})
	}

	function switchAllToMultiSelect() {
		Mode.getDOMElements().forEach((el,idx) => {
			if(idx!==Mode.Unit) {el.setAttribute("multiselect", null)}		// unit stays always single
		})
	}
	return retVal
}


function getTooltipSuffix() {
	let retVal = document.getElementById("selectUnit").currentText
	if(retVal.startsWith("Index")) {
		retVal = ""
	} else if(retVal.startsWith("Percentage")) {
		retVal = "%"
	}
	return retVal
}


function getYLabel() {
	return document.getElementById("selectUnit").currentText
}


// https://github.com/jsonstat/toolkit/issues/1  	LOL. see also adr04.md
function extractWithJsonStat(data, diceDims) {
	var subset = JSONstat(data.originalRawInputData).Dice(
		diceDims,
		{ clone: true }
	)
	return subset.value
}


// Note: data.value might be an array or an object (see https://json-stat.org/format/#value).
function extractWithSpeedOptimizedAlgo(data, diceDims) {
	let retVal = []

	function arr2num(arr, size) {
		const ndims=size.length
		let num=0
		let mult=1
		for(let i=0; i<ndims; i++) {
			mult *= (i>0) ? size[ndims-i] : 1
			num += mult*arr[ndims-i-1]
		}
		return num;
	}

	for(let iu=0; iu<diceDims["unit"].length; iu++) {	// index for unit
		const aiu = data.dimension.unit.category.index[diceDims["unit"][iu]]		// (result-)array index for unit
		for(let ii=0; ii<diceDims["indx"].length; ii++) {
			const aii = data.dimension.indx.category.index[diceDims["indx"][ii]]
			for(let ic=0; ic<diceDims["coicop"].length; ic++) {
				const aic = data.dimension.coicop.category.index[diceDims["coicop"][ic]]
				for(let ig=0; ig<diceDims["geo"].length; ig++) {
					const aig = data.dimension.geo.category.index[diceDims["geo"][ig]]
					for(let it=range.begin; it<range.end; it++) {
						const i = arr2num([0,aiu,aii,aic,aig,it], data.size)
						if(data.value[i]) {
							retVal.push(data.value[i])
						} else {
							retVal.push(null)
						}
					}
				}
			}
		}
	}

	return retVal
}
