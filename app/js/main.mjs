import * as dm from "./dynamicMultiselect.mjs"
import "../components/dropdownBox/dropdownBox.mjs"
import * as l10n from "../components/l10n/lang.mjs"
import * as meta from "../components/metaTags/metaTags.mjs"

import * as pipeline from "../components/pipeline/pipeline.mjs"
import { process as extractOriginalRawData } from "../components/processorOriginalRawData/originalRawData.mjs"
import { process as renameCountries } from "../components/processorCountryNames/countryNames.mjs"
import { process as defineCountryOrder } from "../components/processorCountryOrder/countryOrder.mjs"
import { process as extractTimeMonthly } from "./pipelineProcessors/timeMonthly.mjs"

import { process as extractCountries } from "../components/processorCountries/processor.mjs"
import { process as extractCoicop } from "./pipelineProcessors/coicop.mjs"
import { process as extractIndex } from "./pipelineProcessors/index.mjs"
import { process as extractIndicators } from "./pipelineProcessors/indicators.mjs"


init(run)


function init(callback) {
	l10n.init("en", {
		'en': './translations/en.json',
		'fr': './translations/fr.json'
	},
	() => {
		meta.init(l10n._('title.main'), l10n._('title.main'), "some.jpg", 100, 100)
		callback()
	})
}


function run() {
	const processingCfg = [
		{
			input : "./persistedData/data0722.json",
			//input: "https://ec.europa.eu/eurostat/databrowser-backend/api/extraction/1.0/LIVE/false/json/en/PRC_FSC_IDX$DEFAULTVIEW?cacheId=1649754000000-2.6.5%2520-%25202022-03-30%252013%253A02",
			processors: [defineCountryOrder, extractCountries, renameCountries, extractIndicators, extractTimeMonthly, extractOriginalRawData, extractCoicop, extractIndex]
		}
	]

	pipeline.run(
		processingCfg,
		(data) => {
			if(data	&& Object.keys(data).length > 0 && Object.getPrototypeOf(data) === Object.prototype) {
				try {
					initRangeSlider(data)
					initSelectBoxes(data)
					document.getElementById("loadingIndicator").style.display = "none"
				} catch(e) {
					displayFailure(e)
				}
			} else {
				displayFailure("emtpy data")
			}
		},
		(e) => {
			displayFailure(e)
		},
		replaceEuInRawData
	)


	function displayFailure(e) {
		console.error(e)
		document.getElementById("loadingIndicator").style.display = "none"
		document.getElementById("errorMessage").style.display = "block"
	}

}

function replaceEuInRawData(arrayBuffer) {
	var dataView = new DataView(arrayBuffer)
	var decoder = new TextDecoder('utf8')
	try {
		var obj = JSON.parse(decoder.decode(dataView).replaceAll('EU27_2020', 'EU'))
		return obj
	} catch(e) {
		console.error("main: invalid (json) or no data. native error follows.\n\n", e)
		return {}
	}
}

function initSelectBoxes(data) {
	document.getElementById("selectCountry").data = [data.countries, data.groupChanges]
	document.getElementById("selectCountry").callback = (k, v) => dm.update(data, dm.ModeEnum.Country)

	document.getElementById("selectUnit").data = [data.codes.unit, null]
	document.getElementById("selectUnit").callback = (k, v) => dm.update(data, dm.ModeEnum.Unit)

	document.getElementById("selectIndex").data = [data.codes.index, null]
	document.getElementById("selectIndex").callback = (k, v) => dm.update(data, dm.ModeEnum.Index)

	// trick: setting data after callback only here lastly 
	// makes the chart update initially only 1 time w/ all 4 initial selections correctly set
	// drawback: 3 selectboxes complain about unset callbacks (because callback is set after data)...
	document.getElementById("selectCoicop").callback = (k, v) => dm.update(data, dm.ModeEnum.Coicop)
	document.getElementById("selectCoicop").data = [data.codes.coicop, null]
}

function initRangeSlider(data) {
	const max = data.codes.time.length
	const left = max>50 ? Math.round(Number(max*0.5)) : 0
	const el = document.getElementById("timeRange")

	el.setAttribute("max", max)
	el.setAttribute("min", 0)
	el.setAttribute("mingap", Math.min(0.1*max,1))
	el.setAttribute("valueL", left)
	el.setAttribute("valueR", max)
	el.setAttribute("textl", data.codes.time[left])
	el.setAttribute("textr", data.codes.time[max-1])
	dm.setRange({begin: left, end: max})

	el.addEventListener('change', (e) => {
		el.setAttribute("textl", data.codes.time[e.detail.left])
		el.setAttribute("textr", data.codes.time[e.detail.right-1])
		dm.setRange({begin: e.detail.left, end: e.detail.right})
		dm.update(data)
	})
}