import * as l10n from "../components/l10n/lang.mjs"
import * as dm from "./dynamicMultiselect.mjs"
import * as state from "./stateMgmnt.mjs"
import "../components/dropdownBox/dropdownBox.mjs"

import * as pipeline from "../components/pipeline/pipeline.mjs"
import {replaceEuInRawData} from '../components/util/util.mjs'
import { process as extractOriginalRawData } from "../components/processorOriginalRawData/originalRawData.mjs"

import { process as renameCountries } from "../components/processorCountryNames/countryNames.mjs"
import { process as defineCountryColors } from "../components/processorCountryColors/countryColors.mjs"
import { process as defineCountryOrder } from "../components/processorCountryOrder/countryOrder.mjs"
import { process as extractCountries } from "../components/processorCountries/processor.mjs"

import { process as extractIndicators } from "./pipelineProcessors/indicators.mjs"

import { process as defineIndexColors } from "./pipelineProcessors/indexColors.mjs"


import { process as extractTimeMonthly } from "./pipelineProcessors/timeMonthly.mjs"


l10n.init(
	"en",
	{
		en: './translations/en.json',
		fr: './translations/fr.json'
	},
	() => {	run() }
)


function run() {
	const processingCfg = [
		{
			//input: "https://ec.europa.eu/eurostat/databrowser-backend/api/extraction/1.0/LIVE/false/json/en/PRC_FSC_IDX$DEFAULTVIEW?cacheId=1649754000000-2.6.5%2520-%25202022-03-30%252013%253A02",
			//input : "./persistedData/data0722.json",

			//input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/PRC_FSC_IDX?format=JSON&lang=en&sinceTimePeriod=2015-01"
			//input : "./persistedData/data2015-01.json",

			//input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/PRC_FSC_IDX?format=JSON&lang=en&freq=M&unit=I15&unit=PCH_M12&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop=CP011&coicop=CP0111&coicop=CP01113&coicop=CP0112&coicop=CP01121&coicop=CP01122&coicop=CP01123&coicop=CP01124&coicop=CP0113&coicop=CP0114&coicop=CP01141&coicop=CP01144&coicop=CP01145&coicop=CP01147&coicop=CP0115&coicop=CP01151&coicop=CP01153&coicop=CP01154&coicop=CP0116&coicop=CP0117&coicop=CP01174&coicop=CP01181&coicop=CP0121&coicop=CP01223&coicop=CP02121&coicop=CP0213&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&sinceTimePeriod=2014-01",
			input : "./persistedData/data2014-01.json",

			processors: [defineCountryOrder, defineCountryColors, extractCountries, renameCountries, extractIndicators, extractTimeMonthly, extractOriginalRawData, defineIndexColors]
		}
	]

	pipeline.run(
		processingCfg,
		(data) => {
			if(data	&& Object.keys(data).length > 0 && Object.getPrototypeOf(data) === Object.prototype) {
				try {
					const max = data.categories.time.length
					const left = max-13
					dm.setRange({begin: left, end: max})

					suppressInput()
					initRangeSlider(data, left, max)
					updateSlider(data.categories.time[left], data.categories.time[max-1])
					initSelectBoxes(data)
					updateSelectboxes(dm.ModeEnum.Country, data)	// implicit allowInput

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

function initSelectBoxes(data) {
	document.getElementById("selectCountry").data = [data.categories.countries, data.groupChanges]
	document.getElementById("selectCountry").callback = () => updateSelectboxes(dm.ModeEnum.Country, data)

	document.getElementById("selectUnit").data = [data.categories.unit, null]
	document.getElementById("selectUnit").callback = () => updateSelectboxes(dm.ModeEnum.Unit, data)

	document.getElementById("selectIndex").data = [data.categories.index, null]
	document.getElementById("selectIndex").callback = () => updateSelectboxes(dm.ModeEnum.Index, data)

	document.getElementById("selectCoicop").data = [data.categories.coicop, null]
	document.getElementById("selectCoicop").callback = () => updateSelectboxes(dm.ModeEnum.Coicop, data)

	state.restore()
}

function updateSelectboxes(boxId, data) {
	suppressInput()
	// the operation stresses the render-tread so much it can't even draw the loading indicator in time...  :-o
	setTimeout(() => dm.update({data:data, mode:boxId, onFinished:allowInput}), 40)
	//state.store()
}


function initRangeSlider(data, left, max) {
	const el = document.getElementById("timeRange")
	el.setAttribute("mingap", Math.max(0.1*max,8))
	el.setAttribute("min", 0)
	el.setAttribute("max", max)
	el.setAttribute("valuer", max)	// first right, because it's bigger and they depend on each other
	el.setAttribute("valuel", left)
	//el.setAttribute("textl", data.categories.time[left])
	//el.setAttribute("textr", data.categories.time[max-1])
	updateSlider(data.categories.time[left], data.categories.time[max-1])
	el.addEventListener('dragging', (e) => {
		//el.setAttribute("textl", data.categories.time[e.detail.left])
		//el.setAttribute("textr", data.categories.time[e.detail.right-1])
		
	})
	el.addEventListener('selected', (e) => {
		suppressInput()
		dm.setRange({begin: e.detail.left, end: e.detail.right})
		// the operation stresses the render-tread so much it can't even draw the loading indicator in time...  m-(
		setTimeout(() => dm.update({data:data, onFinished:allowInput}), 40)
	})
}

function updateSlider(leftText, rightText) {
	document.getElementById("timeRange").setAttribute("textl", leftText)
	document.getElementById("timeRange").setAttribute("textr", rightText)
}

const allowInput = _allowInput.bind(this, true)
const suppressInput	= _allowInput.bind(this, false)
function _allowInput(isAllowed) {
	document.getElementById("loadingIndicator").style.display = isAllowed ? "none" : "block"
	//document.body.style.cursor = isAllowed ? "" : "wait";

	document.getElementById("selectCountry").setLocked(!isAllowed)
	document.getElementById("selectUnit").setLocked(!isAllowed)
	document.getElementById("selectIndex").setLocked(!isAllowed)
	document.getElementById("selectCoicop").setLocked(!isAllowed)
	document.getElementById("timeRange").setLocked(!isAllowed)
}
