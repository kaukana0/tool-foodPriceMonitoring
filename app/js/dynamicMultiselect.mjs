/*
Short description of the "dynamic multiselect" behaviour:
- the user can select multiple countries or indices or coicops
- multiselect in one box is only possible if there isn't already another box w/ multiple selections
- the legend and tooltip change depending on which box is currently multiselect
*/

import * as Chart from "../components/chart/chart.mjs"
import * as Extraction from "./extraction.mjs"


// this says which of the boxes can potentially be multiselect
export class ModeEnum {
	static Monism = -1	// all (three) can potentially be selected
	static Country = 0
	static Unit = 1		// the current mode will never be set to Unit; it's only there because it's also used as index for selectboxes
	static Index = 2
	static Coicop = 3
}

// a mode maps to a selectBox in the DOM.
class Mode extends ModeEnum {
	static current = Mode.Monism
	static isCurrently(mode) {return this.current === mode}
	static set(mode) {this.current = mode; return mode}
	static getDOMElementByMode(mode) { return getSelectboxDOMElements()[mode] }
}

// note that the array el's line up w/ the values from ModeEnum
export function getSelectboxDOMElements() {
	return [
		document.getElementById("selectCountry"),
		document.getElementById("selectUnit"),
		document.getElementById("selectIndex"),
		document.getElementById("selectCoicop")
	]
}

export function getCurrentMode() {
	return Mode.current
}

/*
expected parameter:

{
	data:...,   			// mandatory
	onFinished: function,	// callback; optional
	mode: ModeEnum,			// optional
	range: object			// {startIdx: Number, endIdx: Number} mandatory
}

returns true if a mode switch happened
*/
export function update(params) {
	const mode = params.hasOwnProperty("mode") ? params["mode"] : Mode.current
	const onFinished = params["onFinished"] ? params["onFinished"] : null
	return _update(params.data, mode, onFinished, params.range)
}

// note: maybe make this a promise (ie wrapping billboard's onFinished callback)
function _update(data, mode, onFinished, range) {
	const retVal = tryModeSwitch(mode)

	let modeToSeriesLabels = {}
	modeToSeriesLabels[Mode.Monism] = data.categories.countries
	modeToSeriesLabels[Mode.Country] = data.categories.countries
	// Mode.Unit omitted on purpose
	modeToSeriesLabels[Mode.Index] = data.categories.index
	modeToSeriesLabels[Mode.Coicop] = data.categories.coicop
	
	const cols = Extraction.get(data, Mode.current, range)
	cols.unshift(data.categories.time.slice(range.startIdx, range.endIdx))	// put categories (time) as first array

	Chart.init({
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
	Chart.setYLabel("chart", getYLabel())

	return retVal
}


// this logic is the "nucleus" of the multiselect behaviour
// returns true if a mode switch happened
function tryModeSwitch(mode) {
	const modeStored = Mode.current
	if(mode===Mode.Monism) {
		Mode.set(mode)
		switchAllToMultiSelect()
	} else {
		if( Mode.getDOMElementByMode(mode).selectedKeys.length>1 ) {
			Mode.set(mode)
			switchAllToSingleSelect(mode)
		} else {
			if( Mode.getDOMElementByMode(Mode.current).selectedKeys.length<=1 ) {
				Mode.set(Mode.Monism)
				switchAllToMultiSelect()
			}
		}
	}
	return Mode.current !== modeStored
}


function switchAllToSingleSelect(exceptThisOne) {
	getSelectboxDOMElements().forEach((el,idx) => {
		if(idx!==exceptThisOne) {el.removeAttribute("multiselect")}
	})
}


function switchAllToMultiSelect() {
	getSelectboxDOMElements().forEach((el,idx) => {
		if(idx!==Mode.Unit) {el.setAttribute("multiselect", null)}		// unit stays always single
	})
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
