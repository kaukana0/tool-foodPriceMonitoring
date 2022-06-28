import "../components/dropdownBox/dropdownBox.mjs"
import * as chart from "../components/chart/chart.mjs"
import * as l10n from "../components/l10n/lang.mjs"
import * as meta from "../components/metaTags/metaTags.mjs"

import * as pipeline from "../components/pipeline/pipeline.mjs"
import { process as extractOriginalRawData } from "./pipelineProcessors/originalRawData.mjs"
import { process as extractIndicators } from "./pipelineProcessors/indicators.mjs"
import { process as extractTimeMonthly } from "./pipelineProcessors/timeMonthly.mjs"
import { process as defineCountryOrder } from "./pipelineProcessors/countryOrder.mjs"
import { process as extractCountries } from "../components/processorCountries/processor.mjs"
import { process as renameCountries } from "./pipelineProcessors/countryNames.mjs"


init(run)


function init(callback) {
	console.log("pixel ratio: ", window.devicePixelRatio)
	
	l10n.init("en", {
		'en': './l10n/en.json',
		'fr': './l10n/fr.json'
	},
	() => {
		meta.init(l10n._('title.main'), l10n._('title.main'), "some.jpg", 100, 100)
		callback()
	})
}


function run() {
	const processingCfg = [
		{
			input : "./persistedData/data.json",
			//input: "https://ec.europa.eu/eurostat/databrowser-backend/api/extraction/1.0/LIVE/false/json/en/PRC_FSC_IDX$DEFAULTVIEW?cacheId=1649754000000-2.6.5%2520-%25202022-03-30%252013%253A02",
			processors: [defineCountryOrder, extractCountries, renameCountries, extractIndicators, extractTimeMonthly, extractOriginalRawData]
		}
	]

	pipeline.run(
		processingCfg,
		(data) => {
			if(data	&& Object.keys(data).length > 0 && Object.getPrototypeOf(data) === Object.prototype) {
				try {
					document.getElementById("selectCountry").data = [data.countries, data.groupChanges]
					document.getElementById("selectCountry").callback = (k, v) => updateChart(k, v, data)
		
					document.getElementById("selectUnit").data = [data.codes.unit, null]
					document.getElementById("selectUnit").callback = (k, v) => updateChart(k, v, data)
		
					document.getElementById("selectIndex").data = [data.codes.index, null]
					document.getElementById("selectIndex").callback = (k, v) => updateChart(k, v, data)
		
					// trick: setting data after callback only here lastly 
					// makes the chart update initially only 1 time w/ all 4 initial selections correctly set
					// drawback: chart complains 3 times about unset callbacks...
					document.getElementById("selectCoicop").callback = (k, v) => updateChart(k, v, data)
					document.getElementById("selectCoicop").data = [data.codes.coicop, null]
		
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


function updateChart(key, val, data) {
	const countryKeys = document.getElementById("selectCountry").selectedKeys
	const unit = document.getElementById("selectUnit").selectedKeys
	const index = document.getElementById("selectIndex").selectedKeys
	const coicop = document.getElementById("selectCoicop").selectedKeys

	let cols = []
	countryKeys.forEach(country => {
		var subset = data.source.Dice(
			{
				unit: unit,
				indx: index,
				coicop: coicop,
				geo: country
			},
			{
				clone: true
			}
		);
		subset.value.unshift(country)
		cols.push(subset.value)
	})

	const unitDisplay = " " + document.getElementById("selectUnit").currentText
	chart.init("line", "#chart", "#legend", cols, data.countries, data.codes.time, unitDisplay)
	chart.setYLabel(unitDisplay)
}


function replaceEuInRawData(arrayBuffer) {
	var dataView = new DataView(arrayBuffer);
	var decoder = new TextDecoder('utf8');
	try {
		var obj = JSON.parse(decoder.decode(dataView).replaceAll('EU27_2020', 'EU'));
		return obj
	} catch(e) {
		console.error("main: invalid (json) or no data. native error follows.\n\n", e)
		return {}
	}
}
