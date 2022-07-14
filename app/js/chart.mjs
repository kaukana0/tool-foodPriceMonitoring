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
	static getSelections() {
		return [
			document.getElementById("selectCountry").selectedKeys,
			document.getElementById("selectUnit").selectedKeys,
			document.getElementById("selectIndex").selectedKeys,
			document.getElementById("selectCoicop").selectedKeys
		]
	}
	static getSelectionsByMode(mode) { return this.getSelections()[mode] }
}


export function blrgh(k, v, data, mode) {
    if(Mode.isCurrently(mode) || Mode.isCurrently(Mode.Undecided)) {
		if(Mode.getSelectionsByMode(mode).length>1) {
			Mode.set(mode)
			makeOthersSingleSelect(true)
		} else {
			Mode.set(Mode.Undecided)
			makeOthersSingleSelect(false)
		}
		grx(data, mode)
	} else {
		update(k, v, data)
	}

	function grx(data, mode) {
        const selections = Mode.getSelections()
		let cols = []
		let x = "k"
// TODO - why u no worki?        const mapModeToDim = {
// TODO - why u no worki?            Mode.Country: "geo",
// TODO - why u no worki?            Mode.Unit: "unit",
// TODO - why u no worki?            Mode.Index: "indx",
// TODO - why u no worki?            Mode.Coicop: "coicop"
// TODO - why u no worki?        }
        const mapModeToDim = {
            0: "geo",
            1: "unit",
            2: "indx",
            3: "coicop"
        }
		selections[mode].forEach(selection => {
			// first assume all are singleselect
            const diceDims = {
                unit: selections[ModeEnum.Unit],
                indx: selections[ModeEnum.Index],
                coicop: selections[ModeEnum.Coicop],
                geo: selections[ModeEnum.Country]
            }
			// actually one can be multiselect - so overwrite accordingly
            diceDims[mapModeToDim[mode]] = selection
			var subset = data.source.Dice(
                diceDims,
				{
					clone: true
				}
			);
			subset.value.unshift(selection)
			cols.push(subset.value)
		})
	
		const unitDisplay = " " + document.getElementById("selectUnit").currentText
		chart.init("line", "chart", "legend", cols, data.countries, getRangeFromSlider(data.codes.time), unitDisplay)
		chart.setYLabel("chart", unitDisplay)
	}

	function makeOthersSingleSelect(single) {
		if(single) {
			document.getElementById("selectIndex").removeAttribute("multiselect")
			document.getElementById("selectCountry").removeAttribute("multiselect")
		} else {
			document.getElementById("selectIndex").setAttribute("multiselect", null)
			document.getElementById("selectCountry").setAttribute("multiselect", null)
		}
	}
}

export function update(k, v, data) {
	blrgh(k, v, data, mode, Mode.currentMode)
}

// TODO: get this out of here
function getRangeFromSlider(values) {
	const sliderVal = document.getElementById("timeRange").value
	const achdulieba = values.slice(sliderVal)  //values.length - (values.length*sliderVal/100))
	return achdulieba
}
