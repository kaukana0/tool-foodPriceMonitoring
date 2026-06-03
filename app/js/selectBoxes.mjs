import {ModeEnum, getSelectboxDOMElements} from "./dynamicMultiselect.mjs"

export function init(data, onSelected) {

	// a bit hacky...
	var groups = new Map()
	groups.set("AT", {})
	groups.set("IS", {})

	const sc = document.getElementById("selectCountry").box
	sc.data = [data.categories.countries, groups]
	sc.onSelect = (_0,_1,isDeselect) => isDeselect || sc.selected.size < 7
	sc.onSelected = () => onSelected(ModeEnum.Country)

	document.getElementById("selectUnit").box.data = [data.categories.unit, null]
	document.getElementById("selectUnit").box.onSelected = () => onSelected(ModeEnum.Unit)
	
	document.getElementById("selectIndex").box.data = [data.categories.index, null]
	document.getElementById("selectIndex").box.onSelected = () => onSelected(ModeEnum.Index)

	const so = document.getElementById("selectCoicop").box
	so.data = [data.categories.coicop18shortened, null]
	so.onSelect = (_0,_1,isDeselect) => isDeselect || so.selected.size < 7
	so.onSelected = () => onSelected(ModeEnum.Coicop)
}

// makes label for given box say "I'm multiselect" and all others "I'm single select"
export function updateLabels(boxId) {

	const [a,b,c,d] = getSelectboxDOMElements()

	a.setAttribute("labelright", "selectable")
	b.setAttribute("labelright", "selectable")
	c.setAttribute("labelright", "selectable")
	d.setAttribute("labelright", "selectable")

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
// arrays expected
export function select(country, unit, index, coicop) {
	if(country.length>0) { 
		//setTimeout(()=>document.getElementById("selectCountry").box.selected = country  , 0)
		document.getElementById("selectCountry").box.selected = country
	}
	if(unit.length>0) {
		//setTimeout(()=>document.getElementById("selectUnit").box.selected = unit  , 0)
		document.getElementById("selectUnit").box.selected = unit
	}
	if(index.length>0) {
		//setTimeout(()=>document.getElementById("selectIndex").box.selected = index , 0)
		document.getElementById("selectIndex").box.selected = index
	}
	if(coicop.length>0) {
		//setTimeout(()=>document.getElementById("selectCoicop").box.selected = coicop , 0)
		document.getElementById("selectCoicop").box.selected = coicop 
	}
}

export function getSelections() {
	const c = Object.keys(document.getElementById("selectCountry").box.selected[0])[0]
	const u = Object.keys(document.getElementById("selectUnit").box.selected[0])[0]
	const units = {PCH_M12:"percentage", I15:"index"}
	const i = Object.keys(document.getElementById("selectIndex").box.selected[0])[0]
	const o = Object.keys(document.getElementById("selectCoicop").box.selected[0])[0]
	const b = [c,units[u],i,o]
	return b
}