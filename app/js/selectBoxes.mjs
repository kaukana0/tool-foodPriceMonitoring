import {ModeEnum, getSelectboxDOMElements} from "./dynamicMultiselect.mjs"

export function init(data, onSelect) {

	// TODOqq
	var groups = new Map()
	groups.set("EA", {})
	groups.set("SE", {})

	document.getElementById("selectCountry").box.data = [data.categories.countries, groups]
	document.getElementById("selectCountry").box.onSelect = () => onSelect(ModeEnum.Country)

	document.getElementById("selectUnit").box.data = [data.categories.unit, null]
	document.getElementById("selectUnit").box.onSelect = () => onSelect(ModeEnum.Unit)

	document.getElementById("selectIndex").box.data = [data.categories.index, null]
	document.getElementById("selectIndex").box.onSelect = () => onSelect(ModeEnum.Index)

	document.getElementById("selectCoicop").box.data = [data.categories.coicop, null]
	document.getElementById("selectCoicop").box.onSelect = () => onSelect(ModeEnum.Coicop)

	onSelect(ModeEnum.Monism)
}

// makes label for given box say "I'm multiselect" and all others "I'm single select"
export function updateLabels(boxId) {

	const [a,b,c,d] = getSelectboxDOMElements()

	a.setAttribute("labelright", "Selectable")
	b.setAttribute("labelright", "Selectable")
	c.setAttribute("labelright", "Selectable")
	d.setAttribute("labelright", "Selectable")

	a.setAttribute("labelleft", "Country")
	b.setAttribute("labelleft", "Unit")
	c.setAttribute("labelleft", "Index")
	d.setAttribute("labelleft", "COICOP")

	b.setAttribute("labelNumber", 1)

	switch(boxId) {
		case ModeEnum.Unit:
		case ModeEnum.Monism:	// unit and monism look the same
			a.setAttribute("labelNumber", "X")
			c.setAttribute("labelNumber", "X")
			d.setAttribute("labelNumber", "X")
		break
		default:
			a.setAttribute("labelNumber", boxId===ModeEnum.Country ? "X":1)
			c.setAttribute("labelNumber", boxId===ModeEnum.Index ? "X":1)
			d.setAttribute("labelNumber", boxId===ModeEnum.Coicop ? "X":1)
	}
}

export function switchAllToSingleSelect(exceptThisOne) {
	getSelectboxDOMElements().forEach((el,idx) => {
		if(idx!==exceptThisOne) {el.box.setAttribute("multiselect","false")}
	})
}

export function switchAllToMultiSelect() {
	getSelectboxDOMElements().forEach((el,idx) => {
		if(idx!==ModeEnum.Unit) {el.box.setAttribute("multiselect", "true")}		// unit stays always single
	})
}

// iso country code (EU, AT, ...)
// unit: "index" or "percentage"
// index: HICP, PPI, ACPI, or IPI
// coicop: CP011 etc.
export function select(country, unit, index, coicop) {
	if(country) document.getElementById("selectCountry").box.selected = [country]
	const units = {percentage:"PCH_M12", index:"I15"}
	if(unit) { document.getElementById("selectUnit").box.selected = [units[unit]] }
	if(index) { document.getElementById("selectIndex").box.selected = [index] }
	if(coicop) { document.getElementById("selectCoicop").box.selected = [coicop] }
}

export function getSelections() {
	const c = Object.keys(document.getElementById("selectCountry").box.selected[0])[0]
	const u = Object.keys(document.getElementById("selectUnit").box.selected[0])[0]
	const units = {PCH_M12:"percentage", I15:"index"}
	const i = Object.keys(document.getElementById("selectIndex").box.selected[0])[0]
	const o = Object.keys(document.getElementById("selectCoicop").box.selected[0])[0]
	const b = [c,units[u],i,o]
	console.log(b)
	return b
}