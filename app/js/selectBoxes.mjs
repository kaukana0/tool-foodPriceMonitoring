import {ModeEnum, getSelectboxDOMElements} from "./dynamicMultiselect.mjs"

export function init(data, onSelected) {

	// a bit hacky...
	var groups = new Map()
	groups.set("EA", {})
	groups.set("SE", {})

	const sc = document.getElementById("selectCountry").box
	sc.data = [data.categories.countries, groups]
	sc.onSelect = (_0,_1,isDeselect) => isDeselect || sc.selected.size < 7
	sc.onSelected = () => onSelected(ModeEnum.Country)

	document.getElementById("selectUnit").box.data = [data.categories.unit, null]
	document.getElementById("selectUnit").box.onSelected = () => onSelected(ModeEnum.Unit)
	
	document.getElementById("selectIndex").box.data = [data.categories.index, null]
	document.getElementById("selectIndex").box.onSelected = () => onSelected(ModeEnum.Index)

	const so = document.getElementById("selectCoicop").box
	so.data = [data.categories.coicop, null]
	so.onSelect = (_0,_1,isDeselect) => isDeselect || so.selected.size < 7
	so.onSelected = () => onSelected(ModeEnum.Coicop)

	onSelected(ModeEnum.Monism)
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
			a.setAttribute("labelNumber", "6")
			c.setAttribute("labelNumber", "3")
			d.setAttribute("labelNumber", "6")
		break
		default:
			a.setAttribute("labelNumber", boxId===ModeEnum.Country ? 7-a.box.selected.size:1)
			c.setAttribute("labelNumber", boxId===ModeEnum.Index ? 4-c.box.selected.size:1)
			d.setAttribute("labelNumber", boxId===ModeEnum.Coicop ? 7-d.box.selected.size:1)
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