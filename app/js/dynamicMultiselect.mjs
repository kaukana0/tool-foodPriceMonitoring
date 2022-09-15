/*
Short description of the "dynamic multiselect" behaviour:
- the user can select multiple countries or indices or coicops
- multiselect in one box is only possible if there isn't already another box w/ multiple selections
- the legend and tooltip change depending on which box is currently multiselect
*/

import * as chart from "../components/chart/chart.mjs"


// this determines which of the boxes is currently multiselect
export class ModeEnum {
	static Country = 0
	static Unit = 1		// the mode will never be set to Unit; it's only there because it's also used as index for selectboxes
	static Index = 2
	static Coicop = 3
}

class Mode extends ModeEnum {
	static current = Mode.Country
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
	range = {...range, ..._range}
}


// expected type for param "mode": ModeEnum
// returns true if a mode switch happened
// mode is an optional parameter
export function update(data, mode, onFinished) {
	if(mode===undefined) {
		_update(data, Mode.current, onFinished)
	} else {
		_update(data, mode, onFinished)
	}
}


function _update(data, mode, onFinished) {
	
	const retVal = tryModeSwitch()
	
	let modeToSeriesLabels = {}
	modeToSeriesLabels[Mode.Country] = data.countries
	// Mode.Unit omitted on purpose
	modeToSeriesLabels[Mode.Index] = data.indices
	modeToSeriesLabels[Mode.Coicop] = data.coicops

	const unitDisplay = " " + document.getElementById("selectUnit").currentText
	
	const cols = extract(data, Mode.current)
	cols.unshift(data.codes.time.slice(range.begin, range.end))	// put categories (time) as first array

	chart.init({
		type: "line",
		chartDOMElementId: "chart",
		legendDOMElementId: "legend",
		cols: cols,
		fixColors: data.countryColors,
		palette: data.colorPalette,
		seriesLabels: modeToSeriesLabels[Mode.current],
		suffixText: unitDisplay,
		isRotated: false,
		onFinished: onFinished
	})
	chart.setYLabel("chart", unitDisplay)


	// this logic is the "nucleus" of the multiselect behaviour
	function tryModeSwitch() {
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

		selectBoxes[mode].selectedKeys.forEach(selection => {
			// first assume all are singleselect
            const diceDims = {
                unit: selectBoxes[ModeEnum.Unit].selectedKeys,
                indx: selectBoxes[ModeEnum.Index].selectedKeys,
                coicop: selectBoxes[ModeEnum.Coicop].selectedKeys,
                geo: selectBoxes[ModeEnum.Country].selectedKeys
            }
			// but actually one can be multiselect - according to a mode - so overwrite accordingly
            diceDims[mapModeToDim[mode]] = selection

			var subset = data.source.Dice(
                diceDims,
				{ clone: true }
			)

			// cut off elements in front and at the end, according to a range (ie timerange)
			subset.value = subset.value.slice(range.begin, range.end)

			// put "column header" (a string) in front of the numerical values,
			// because that's the expected format for "columns" in billboard.js
			// the "col-header" is displayed in the legend.
			// col-header is actually the series' key.
			subset.value.unshift(selection)

			retVal.push(subset.value)
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
