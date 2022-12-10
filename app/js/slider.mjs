export function init(data, left, max, onSelect) {
	const el = document.getElementById("timeRange")
	el.setAttribute("min", 0)
	el.setAttribute("max", max)
	el.setAttribute("valuer", max)	// first right, because it's bigger and they depend on one another (via mingap)
	el.setAttribute("valuel", left)
	el.addEventListener('dragging', (e) => {
		update(data.categories.time[e.detail.startIdx], data.categories.time[e.detail.endIdx-1])
	})
	el.addEventListener('selected', e => {
		update(data.categories.time[e.detail.startIdx], data.categories.time[e.detail.endIdx-1])
		onSelect(e)
	})
	// this last because left might want to be too far to the right, 
	// overstepping mingap. left eventually gets overruled by mingap.
	// implcitly calls update (through events fired by slider)
	el.setAttribute("mingap", getMingap(document.getElementById("chart").clientWidth))
}

export function update(leftText, rightText) {
	document.getElementById("timeRange").setAttribute("textl", leftText)
	document.getElementById("timeRange").setAttribute("textr", rightText)
}

// to avoid overlapping of slider handles (resulting in inaccessible handle)
// make the smallest user selectable range dependent of draw area width.
function getMingap(width) {
	return [
		[576, 12*5],
		[768, 12*3],
		[992, 12*2],
		[1200, 6*3],
		[1400, 12],
		[Number.MAX_VALUE, 9]
	].filter(([w, _]) => {return width<w})[0][1]
}