import * as slider from "./slider.mjs"
import * as selectBoxes from "./selectBoxes.mjs"

import * as l10n from "../components/l10n/lang.mjs"
import * as dm from "./dynamicMultiselect.mjs"
import "../components/dropdownBox/dropdownBox.mjs"

import * as pipeline from "../components/pipeline/pipeline.mjs"
import {replaceEuInRawData} from '../components/util/util.mjs'
import { process as retrieveSourceData } from "./pipelineProcessors/sourceData.mjs"

import { process as renameCountries } from "../components/processorCountryNames/countryNames.mjs"
import { process as defineCountryColors } from "../components/processorCountryColors/countryColors.mjs"
import { process as defineCountryOrder } from "../components/processorCountryOrder/countryOrder.mjs"
import { process as extractCountries } from "../components/processorCountries/processor.mjs"

import { process as extractIndicators } from "./pipelineProcessors/indicators.mjs"

import { process as defineIndexColors } from "./pipelineProcessors/indexColors.mjs"

import { process as extractTimeMonthly } from "./pipelineProcessors/timeMonthly.mjs"

import * as cache from "./cache.mjs"

// relevant only for development
//import { get as getFakeData } from "../components/dataGenerator/fpmToolFakeData.mjs"


l10n.init(
	"en",
	{
		en: './translations/en.json',
		fr: './translations/fr.json'
	},
	() => run()
)


function run() {

	if(cache.init()) { cache.clear() }

	const processingCfg = [
		{
			//input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/PRC_FSC_IDX?format=JSON&lang=en&freq=M&unit=I15&unit=PCH_M12&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop=CP011&coicop=CP0111&coicop=CP01113&coicop=CP0112&coicop=CP01121&coicop=CP01122&coicop=CP01123&coicop=CP01124&coicop=CP0113&coicop=CP0114&coicop=CP01141&coicop=CP01144&coicop=CP01145&coicop=CP01147&coicop=CP0115&coicop=CP01151&coicop=CP01153&coicop=CP01154&coicop=CP0116&coicop=CP0117&coicop=CP01174&coicop=CP01181&coicop=CP0121&coicop=CP01223&coicop=CP02121&coicop=CP0213&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&startPeriod=2005-01&endPeriod=2009-12",
			input: "./persistedData/2005-01-2009-12.dat",
			cache: {
				store: (data) => cache.store(data, "2005data"),
				restore: () => cache.restore("2005data")
			},
			processors: [retrieveSourceData]
		},
		{
			//input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/PRC_FSC_IDX?format=JSON&lang=en&freq=M&unit=I15&unit=PCH_M12&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop=CP011&coicop=CP0111&coicop=CP01113&coicop=CP0112&coicop=CP01121&coicop=CP01122&coicop=CP01123&coicop=CP01124&coicop=CP0113&coicop=CP0114&coicop=CP01141&coicop=CP01144&coicop=CP01145&coicop=CP01147&coicop=CP0115&coicop=CP01151&coicop=CP01153&coicop=CP01154&coicop=CP0116&coicop=CP0117&coicop=CP01174&coicop=CP01181&coicop=CP0121&coicop=CP01223&coicop=CP02121&coicop=CP0213&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&startPeriod=2010-01&endPeriod=2014-12",
			input: "./persistedData/2010-01-2014-12.dat",
			cache: {
				store: (data) => cache.store(data, "2010data"),
				restore: () => cache.restore("2010data")
			},
			processors: [retrieveSourceData]
		},
		{
			//input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/PRC_FSC_IDX?format=JSON&lang=en&freq=M&unit=I15&unit=PCH_M12&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop=CP011&coicop=CP0111&coicop=CP01113&coicop=CP0112&coicop=CP01121&coicop=CP01122&coicop=CP01123&coicop=CP01124&coicop=CP0113&coicop=CP0114&coicop=CP01141&coicop=CP01144&coicop=CP01145&coicop=CP01147&coicop=CP0115&coicop=CP01151&coicop=CP01153&coicop=CP01154&coicop=CP0116&coicop=CP0117&coicop=CP01174&coicop=CP01181&coicop=CP0121&coicop=CP01223&coicop=CP02121&coicop=CP0213&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&startPeriod=2015-01&endPeriod=2019-12",
			input: "./persistedData/2015-01-2019-12.dat",
			cache: {
				store: (data) => cache.store(data, "2015data"),
				restore: () => cache.restore("2015data")
			},
			processors: [retrieveSourceData]
		},
		{
			// see footer in index.html for the data-source web-frontend (from which this URL is retrieved)
			input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/PRC_FSC_IDX?format=JSON&lang=en&freq=M&unit=I15&unit=PCH_M12&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop=CP011&coicop=CP0111&coicop=CP01113&coicop=CP0112&coicop=CP01121&coicop=CP01122&coicop=CP01123&coicop=CP01124&coicop=CP0113&coicop=CP0114&coicop=CP01141&coicop=CP01144&coicop=CP01145&coicop=CP01147&coicop=CP0115&coicop=CP01151&coicop=CP01153&coicop=CP01154&coicop=CP0116&coicop=CP0117&coicop=CP01174&coicop=CP01181&coicop=CP0121&coicop=CP01223&coicop=CP02121&coicop=CP0213&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&sinceTimePeriod=2020-01",
			cache: {
				store: (data) => cache.store(data, "2020data"),
				restore: () => cache.restore("2020data")
			},
			processors: [retrieveSourceData, defineIndexColors, defineCountryOrder, defineCountryColors, extractCountries, renameCountries, extractIndicators, extractTimeMonthly]
		}
	]

	pipeline.run(
		processingCfg,
		(data) => {
			if(data	&& Object.keys(data).length > 0 && Object.getPrototypeOf(data) === Object.prototype) {
				try {
					const max = data.categories.time.length
					const left = 15*12		// 	jan/2020 (data starts 01/2005)
					slider.init(data, left, max, onSliderSelected.bind(this, data))
					selectBoxes.init(data, onBoxSelected.bind(this, data))
					document.getElementById("timeRange").style.visibility="visible";
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

function onSliderSelected(data, e) {
	suppressInput()
	setTimeout(() => dm.update({data:data, range:e.detail, onFinished:allowInput}), 40)
}

function onBoxSelected(data, boxId) {
	suppressInput()
	setTimeout(() => {
		const rangeIndices = document.getElementById("timeRange").getIndices()
		dm.update({data:data, mode:boxId, range:rangeIndices, onFinished:allowInput})
	}, 40)
}

const allowInput = _allowInput.bind(this, true)
const suppressInput	= _allowInput.bind(this, false)	// block UI interaction for some UI elements

function _allowInput(isAllowed) {
	document.getElementById("loadingIndicator").style.display = isAllowed ? "none" : "block"
	document.getElementById("selectCountry").setLocked(!isAllowed)
	document.getElementById("selectUnit").setLocked(!isAllowed)
	document.getElementById("selectIndex").setLocked(!isAllowed)
	document.getElementById("selectCoicop").setLocked(!isAllowed)
	document.getElementById("timeRange").setLocked(!isAllowed)
}
