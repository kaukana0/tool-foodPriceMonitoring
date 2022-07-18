import * as chart from "../components/chart/chart.mjs"


// this determines which of the boxes is currently multiselect
export class ModeEnum {
    static Undecided = -1
	static Country = 0
	static Unit = 1
	static Index = 2
	static Coicop = 3
}

class Mode extends ModeEnum {
	static currentMode = Mode.Undecided
	static isCurrently(mode) {return this.currentMode === mode}
	static set(mode) {this.currentMode = mode; return mode}
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


// param: mode; expected type: ModeEnum
export function update(data, mode) {
	if(typeof mode===undefined) {
		_update(data, Mode.currentMode)
	} else {
		_update(data, mode)
	}
}

function _update(data, mode) {

	const retVal = tryModeSwitch()
	const unitDisplay = " " + document.getElementById("selectUnit").currentText

	let modeToLegendElements = {}
	modeToLegendElements[Mode.Undecided] = data.countries
	modeToLegendElements[Mode.Country] = data.countries
	modeToLegendElements[Mode.Unit] = data.countries
	modeToLegendElements[Mode.Index] = data.countries
	modeToLegendElements[Mode.Coicop] = data.coicops

	chart.init("line", "chart", "legend", extract(data, mode), modeToLegendElements[mode], getRangeFromSlider(data.codes.time), unitDisplay)
	chart.setYLabel("chart", unitDisplay)


	function tryModeSwitch() {
		if(Mode.isCurrently(mode) || Mode.isCurrently(Mode.Undecided)) {
			if( Mode.getDOMElementByMode(mode).selectedKeys.length>1) {
				Mode.set(mode)
				switchSingleSelect(true, mode)
			} else {
				Mode.set(Mode.Undecided)
				switchSingleSelect(false, Mode.Undecided)
			}
			return true
		} else {
			return false
		}
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

			subset.value.unshift(selection)	// cut off the head (a string), we only want the rest (numerical values)
			retVal.push(subset.value)
		})

		return retVal
	}

	function switchSingleSelect(singleSelect, exceptThisOne) {
		if(singleSelect) {
			Mode.getDOMElements().forEach((el,idx) => {
				if(idx!==exceptThisOne) {el.removeAttribute("multiselect")}
			})
		} else {
			Mode.getDOMElements().forEach((el,idx) => {
				if(idx!==exceptThisOne) {el.setAttribute("multiselect", null)}
			})
		}
	}

	return retVal
}


// TODO: get this out of here
function getRangeFromSlider(values) {
	const sliderVal = document.getElementById("timeRange").value
	const achdulieba = values.slice(sliderVal)  //values.length - (values.length*sliderVal/100))
	return achdulieba
}
