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
	static Unit = 1		// there'll never be a mode set to Unit, it's only there because it's also used as index for selectboxes
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
	end: 0
}

export function setRange(_range) {
	range = {...range, ..._range}
}


// expected type for param "mode": ModeEnum
// returns true if a mode switch happened
// mode is an optional parameter
export function update(data, mode) {
	if(mode===undefined) {
		_update(data, Mode.current)
	} else {
		_update(data, mode)
	}
}


function _update(data, mode) {
	
	const retVal = tryModeSwitch()
	
	let modeToLegendElements = {}
	modeToLegendElements[Mode.Country] = data.countries
	// Mode.Unit omitted on purpose
	modeToLegendElements[Mode.Index] = data.indices
	modeToLegendElements[Mode.Coicop] = data.coicops

	const unitDisplay = " " + document.getElementById("selectUnit").currentText
	chart.init("line", "chart", "legend", 
		extract(data, Mode.current), 
		modeToLegendElements[Mode.current], 
		data.codes.time.slice(range.begin, range.end), 		// cut off elements in front, similar to the data
		unitDisplay)
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

			subset.value = subset.value.slice(range.begin, range.end)	// cut off elements in front

			// put "column header" (a string) in front of the numerical values,
			// because that's the expected format for "columns" in billboard.js
			// the "col-header" is displayed in the legend.
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