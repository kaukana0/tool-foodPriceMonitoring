import {ModeEnum, getSelectboxDOMElements} from "./dynamicMultiselect.mjs"

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

	switch(boxId) {
		case ModeEnum.Unit:
		case ModeEnum.Monism:	// unit and monism look the same
			document.getElementById("lCm").style.display = "inline"
			document.getElementById("lCo").style.display = "none"
			document.getElementById("lIm").style.display = "inline"
			document.getElementById("lIo").style.display = "none"
			document.getElementById("lPm").style.display = "inline"
			document.getElementById("lPo").style.display = "none"
		break
		default:
			document.getElementById("lCm").style.display = boxId===ModeEnum.Country ? "inline" : "none"
			document.getElementById("lCo").style.display = boxId===ModeEnum.Country ? "none" : "inline"
			
			document.getElementById("lIm").style.display = boxId===ModeEnum.Index ? "inline" : "none"
			document.getElementById("lIo").style.display = boxId===ModeEnum.Index ? "none" : "inline"
			
			document.getElementById("lPm").style.display = boxId===ModeEnum.Coicop ? "inline" : "none"
			document.getElementById("lPo").style.display = boxId===ModeEnum.Coicop ? "none" : "inline"
	}
}

export function switchAllToSingleSelect(exceptThisOne) {
	getSelectboxDOMElements().forEach((el,idx) => {
		if(idx!==exceptThisOne) {el.removeAttribute("multiselect")}
	})
}

export function switchAllToMultiSelect() {
	getSelectboxDOMElements().forEach((el,idx) => {
		if(idx!==ModeEnum.Unit) {el.setAttribute("multiselect", null)}		// unit stays always single
	})
}

// iso country code (EU, AT, ...)
// unit: "index" or "percentage"
// index: HICP, PPI, ACPI, or IPI
// coicop: CP011 etc.
export function select(country, unit, index, coicop) {
	document.getElementById("selectCountry").setSelectedByKey(country)
	const units = {percentage:"PCH_M12", index:"I15"}
	document.getElementById("selectUnit").setSelectedByKey(units[unit])
	document.getElementById("selectIndex").setSelectedByKey(index)
	document.getElementById("selectCoicop").setSelectedByKey(coicop)
}

export function getSelections() {
	const c = Object.keys(document.getElementById("selectCountry").selected[0])[0]
	const u = Object.keys(document.getElementById("selectUnit").selected[0])[0]
	const units = {PCH_M12:"percentage", I15:"index"}
	const i = Object.keys(document.getElementById("selectIndex").selected[0])[0]
	const o = Object.keys(document.getElementById("selectCoicop").selected[0])[0]
	return [c,units[u],i,o]
}