import {ModeEnum} from "./dynamicMultiselect.mjs"

export function init(data, onSelect) {
	document.getElementById("selectCountry").data = [data.categories.countries, data.groupChanges]
	document.getElementById("selectCountry").callback = () => onSelect(ModeEnum.Country)

	document.getElementById("selectUnit").data = [data.categories.unit, null]
	document.getElementById("selectUnit").callback = () => onSelect(ModeEnum.Unit)

	document.getElementById("selectIndex").data = [data.categories.index, null]
	document.getElementById("selectIndex").callback = () => onSelect(ModeEnum.Index)

	document.getElementById("selectCoicop").data = [data.categories.coicop, null]
	document.getElementById("selectCoicop").callback = () => onSelect(ModeEnum.Coicop)

	onSelect(ModeEnum.Monism)
}

// makes label for given box say "I'm multiselect" and all others "I'm single select"
export function updateLabels(boxId) {
	if(boxId===ModeEnum.Monism) {
		document.getElementById("lCm").style.display = "inline"
		document.getElementById("lCo").style.display = "none"
		document.getElementById("lIm").style.display = "inline"
		document.getElementById("lIo").style.display = "none"
		document.getElementById("lPm").style.display = "inline"
		document.getElementById("lPo").style.display = "none"
	} else {
		document.getElementById("lCm").style.display = boxId===ModeEnum.Country ? "inline" : "none"
		document.getElementById("lCo").style.display = boxId===ModeEnum.Country ? "none" : "inline"
		
		document.getElementById("lIm").style.display = boxId===ModeEnum.Index ? "inline" : "none"
		document.getElementById("lIo").style.display = boxId===ModeEnum.Index ? "none" : "inline"
		
		document.getElementById("lPm").style.display = boxId===ModeEnum.Coicop ? "inline" : "none"
		document.getElementById("lPo").style.display = boxId===ModeEnum.Coicop ? "none" : "inline"
	}
}
