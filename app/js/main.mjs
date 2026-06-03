import { init as iFrameResize } from "./iframeResize.mjs"
import * as slider from "./slider.mjs"
import * as selectBoxes from "./selectBoxes.mjs"

import * as l10n from "../components/l10n/lang.mjs"
import * as dm from "./dynamicMultiselect.mjs"

import * as pipeline from "../components/pipeline/pipeline.mjs"
import { replaceEuInRawData,  getURLParameterValue } from '../components/util/util.mjs'
import { process as retrieveSourceData } from "./pipelineProcessors/sourceData.mjs"

import { process as renameCountries } from "../components/processorCountryNames/countryNames.mjs"
import { process as defineCountryColors } from "../components/processorCountryColors/countryColors.mjs"
import { process as defineCountryOrder } from "../components/processorCountryOrder/countryOrder.mjs"
import { process as extractCountries } from "../components/processorCountries/processor.mjs"

import { process as extractIndicators } from "./pipelineProcessors/indicators.mjs"

import { process as defineIndexColors } from "./pipelineProcessors/indexColors.mjs"

import { process as extractTimeMonthly } from "./pipelineProcessors/timeMonthly.mjs"

import createShortenedLabels from "./pipelineProcessors/createShortenedCoicop18Labels.mjs"

import * as cache from "./cache.mjs"

import * as DialogStyling from "../components/ewc-dialog/src/externalStyling.mjs"

import {getURLFromOGTag} from "../components/util/util.mjs"


// relevant only for development
//import { get as getFakeData } from "../components/dataGenerator/fpmToolFakeData.mjs"


iFrameResize()	// shrink chart when embedded; based on some assumptions about how it is embedded

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
	
	DialogStyling.applyEclClasses()

	setupGlobalInfoClick(l10n._("info"))
	setupSharing({
		text:l10n._("title.main"),
		hashTags: l10n._("hashtags"),
		mailSubject: "Explore the " + l10n._("title.main"),
		mailBody: `Explore the ${l10n._("title.main")} and its selection of indicators:

${getURLFromOGTag()}`
	})
	document.getElementsByTagName("ecl-like-social-share")[0].callback = embedModalCallback

	const processingCfg = [
/* not this time range, because it has missing data
		{
			// input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_fpmt_m?format=JSON&lang=en&freq=M&unit=I25&unit=RCH_A&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop18=CP011&coicop18=CP01111&coicop18=CP011131&coicop18=CP011139&coicop18=CP01115&coicop18=CP01122&coicop18=CP011221&coicop18=CP011222&coicop18=CP011223&coicop18=CP011224&coicop18=CP011225&coicop18=CP011226&coicop18=CP0113&coicop18=CP0114&coicop18=CP01141&coicop18=CP01142&coicop18=CP01145&coicop18=CP01146&coicop18=CP01148&coicop18=CP0115&coicop18=CP01151&coicop18=CP011513&coicop18=CP01152&coicop18=CP0116&coicop18=CP01162&coicop18=CP01166&coicop18=CP01167&coicop18=CP01168&coicop18=CP0117&coicop18=CP011751&coicop18=CP01181&coicop18=CP01185&coicop18=CP01186&coicop18=CP01193&coicop18=CP01210&coicop18=CP01220&coicop18=CP01230&coicop18=CP01240&coicop18=CP02121&coicop18=CP02130&coicop18=CP0230&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&startPeriod=1995-01&endPeriod=2000-01",
			input: "./persistedData/1995-01-1999-12.dat",
			cache: {
				store: (data) => cache.store(data, "1995data"),
				restore: () => cache.restore("1995data")
			},
			processors: [retrieveSourceData]
		},
*/
		{
			//input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_fpmt_m?format=JSON&lang=en&freq=M&unit=I25&unit=RCH_A&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop18=CP011&coicop18=CP01111&coicop18=CP011131&coicop18=CP011139&coicop18=CP01115&coicop18=CP01122&coicop18=CP011221&coicop18=CP011222&coicop18=CP011223&coicop18=CP011224&coicop18=CP011225&coicop18=CP011226&coicop18=CP0113&coicop18=CP0114&coicop18=CP01141&coicop18=CP01142&coicop18=CP01145&coicop18=CP01146&coicop18=CP01148&coicop18=CP0115&coicop18=CP01151&coicop18=CP011513&coicop18=CP01152&coicop18=CP0116&coicop18=CP01162&coicop18=CP01166&coicop18=CP01167&coicop18=CP01168&coicop18=CP0117&coicop18=CP011751&coicop18=CP01181&coicop18=CP01185&coicop18=CP01186&coicop18=CP01193&coicop18=CP01210&coicop18=CP01220&coicop18=CP01230&coicop18=CP01240&coicop18=CP02121&coicop18=CP02130&coicop18=CP0230&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&startPeriod=2000-01&endPeriod=2005-01",
			input: "./persistedData/2000-01-2004-12.dat",
			cache: {
				store: (data) => cache.store(data, "2000data"),
				restore: () => cache.restore("2000data")
			},
			processors: [retrieveSourceData]
		},
		{
			//input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_fpmt_m?format=JSON&lang=en&freq=M&unit=I25&unit=RCH_A&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop18=CP011&coicop18=CP01111&coicop18=CP011131&coicop18=CP011139&coicop18=CP01115&coicop18=CP01122&coicop18=CP011221&coicop18=CP011222&coicop18=CP011223&coicop18=CP011224&coicop18=CP011225&coicop18=CP011226&coicop18=CP0113&coicop18=CP0114&coicop18=CP01141&coicop18=CP01142&coicop18=CP01145&coicop18=CP01146&coicop18=CP01148&coicop18=CP0115&coicop18=CP01151&coicop18=CP011513&coicop18=CP01152&coicop18=CP0116&coicop18=CP01162&coicop18=CP01166&coicop18=CP01167&coicop18=CP01168&coicop18=CP0117&coicop18=CP011751&coicop18=CP01181&coicop18=CP01185&coicop18=CP01186&coicop18=CP01193&coicop18=CP01210&coicop18=CP01220&coicop18=CP01230&coicop18=CP01240&coicop18=CP02121&coicop18=CP02130&coicop18=CP0230&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&startPeriod=2005-01&endPeriod=2010-01",
			input: "./persistedData/2005-01-2009-12.dat",
			cache: {
				store: (data) => cache.store(data, "2005data"),
				restore: () => cache.restore("2005data")
			},
			processors: [retrieveSourceData]
		},
		{
			// input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_fpmt_m?format=JSON&lang=en&freq=M&unit=I25&unit=RCH_A&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop18=CP011&coicop18=CP01111&coicop18=CP011131&coicop18=CP011139&coicop18=CP01115&coicop18=CP01122&coicop18=CP011221&coicop18=CP011222&coicop18=CP011223&coicop18=CP011224&coicop18=CP011225&coicop18=CP011226&coicop18=CP0113&coicop18=CP0114&coicop18=CP01141&coicop18=CP01142&coicop18=CP01145&coicop18=CP01146&coicop18=CP01148&coicop18=CP0115&coicop18=CP01151&coicop18=CP011513&coicop18=CP01152&coicop18=CP0116&coicop18=CP01162&coicop18=CP01166&coicop18=CP01167&coicop18=CP01168&coicop18=CP0117&coicop18=CP011751&coicop18=CP01181&coicop18=CP01185&coicop18=CP01186&coicop18=CP01193&coicop18=CP01210&coicop18=CP01220&coicop18=CP01230&coicop18=CP01240&coicop18=CP02121&coicop18=CP02130&coicop18=CP0230&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&startPeriod=2010-01&endPeriod=2015-01",
			input: "./persistedData/2010-01-2014-12.dat",
			cache: {
				store: (data) => cache.store(data, "2010data"),
				restore: () => cache.restore("2010data")
			},
			processors: [retrieveSourceData]
		},
		{
			// input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_fpmt_m?format=JSON&lang=en&freq=M&unit=I25&unit=RCH_A&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop18=CP011&coicop18=CP01111&coicop18=CP011131&coicop18=CP011139&coicop18=CP01115&coicop18=CP01122&coicop18=CP011221&coicop18=CP011222&coicop18=CP011223&coicop18=CP011224&coicop18=CP011225&coicop18=CP011226&coicop18=CP0113&coicop18=CP0114&coicop18=CP01141&coicop18=CP01142&coicop18=CP01145&coicop18=CP01146&coicop18=CP01148&coicop18=CP0115&coicop18=CP01151&coicop18=CP011513&coicop18=CP01152&coicop18=CP0116&coicop18=CP01162&coicop18=CP01166&coicop18=CP01167&coicop18=CP01168&coicop18=CP0117&coicop18=CP011751&coicop18=CP01181&coicop18=CP01185&coicop18=CP01186&coicop18=CP01193&coicop18=CP01210&coicop18=CP01220&coicop18=CP01230&coicop18=CP01240&coicop18=CP02121&coicop18=CP02130&coicop18=CP0230&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&startPeriod=2015-01&endPeriod=2020-01",
			input: "./persistedData/2015-01-2019-12.dat",
			cache: {
				store: (data) => cache.store(data, "2015data"),
				restore: () => cache.restore("2015data")
			},
			processors: [retrieveSourceData]
		},
		{
			// see footer in index.html for the data-source (which is the base for this URL)
			input: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_fpmt_m?format=JSON&lang=en&freq=M&unit=I25&unit=RCH_A&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop18=CP011&coicop18=CP01111&coicop18=CP011131&coicop18=CP011139&coicop18=CP01115&coicop18=CP01122&coicop18=CP011221&coicop18=CP011222&coicop18=CP011223&coicop18=CP011224&coicop18=CP011225&coicop18=CP011226&coicop18=CP0113&coicop18=CP0114&coicop18=CP01141&coicop18=CP01142&coicop18=CP01145&coicop18=CP01146&coicop18=CP01148&coicop18=CP0115&coicop18=CP01151&coicop18=CP011513&coicop18=CP01152&coicop18=CP0116&coicop18=CP01162&coicop18=CP01166&coicop18=CP01167&coicop18=CP01168&coicop18=CP0117&coicop18=CP011751&coicop18=CP01181&coicop18=CP01185&coicop18=CP01186&coicop18=CP01193&coicop18=CP01210&coicop18=CP01220&coicop18=CP01230&coicop18=CP01240&coicop18=CP02121&coicop18=CP02130&coicop18=CP0230&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&sinceTimePeriod=2020-01",
			//cache: {
			//	store: (data) => cache.store(data, "2020data"),
			//	restore: () => cache.restore("2020data")
			//},
			processors: [retrieveSourceData, defineIndexColors, defineCountryOrder, defineCountryColors, extractCountries, renameCountries, extractIndicators, extractTimeMonthly, createShortenedLabels]
		}
	]

	pipeline.run(
		processingCfg,
		(data) => {
			if(data	&& Object.keys(data).length > 0 && Object.getPrototypeOf(data) === Object.prototype) {
				try {
					const max = data.categories.time.length
					const left = getURLParameterValue("startIdx") ? getURLParameterValue("startIdx") : 240		// data starts 01-2000, the 240th index is 01-2020 (#months)
					slider.init(data, left, max, onSliderSelected.bind(this, data))

					selectBoxes.init(data, onBoxSelected.bind(this, data))	// initially doesn't call onBoxSelected

					document.getElementById("timeRange").style.visibility="visible"

					const [mode,country,unit,index,coicop] = getInitialSelectionFromUrl()
					selectBoxes.select(country,unit,index,coicop)
					onBoxSelected(data,mode)		// initial onBoxSelected
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
	setTimeout(() => dm.update({data:data, range:e.detail, onFinished:allowInput}), 400)
}

function onBoxSelected(data, boxId) {
	suppressInput()
	setTimeout(() => {
		//updateUrl()	// TODO new feature
		const rangeIndices = document.getElementById("timeRange").getIndices()
		dm.update({data:data, mode:boxId, range:rangeIndices, onFinished:allowInput})
	}, 40)
}

const allowInput = _allowInput.bind(this, true)
const suppressInput	= _allowInput.bind(this, false)	// block UI interaction for some UI elements

function _allowInput(isAllowed) {
	document.getElementById("loadingIndicator").style.display = isAllowed ? "none" : "block"
	document.getElementById("selectCountry").box.locked = !isAllowed
	document.getElementById("selectUnit").box.locked = !isAllowed
	document.getElementById("selectIndex").box.locked = !isAllowed
	document.getElementById("selectCoicop").box.locked = !isAllowed
	document.getElementById("timeRange").setLocked(!isAllowed)
}

function getInitialSelectionFromUrl() {
	const a = getURLParameterValue("country") ? getURLParameterValue("country").split(",") : []
	const b = getURLParameterValue("unit") ? [getURLParameterValue("unit")] : []
	const c = getURLParameterValue("indx") ? getURLParameterValue("indx").split(",") : []
	const d = getURLParameterValue("coicop18") ? getURLParameterValue("coicop18").split(",") : []
	let mode = dm.ModeEnum.Monism
	if(a.length>1) {mode=dm.ModeEnum.Country}
	// unit is omitted on purpose becaus it's singleselect
	if(c.length>1) {mode=dm.ModeEnum.Index}
	if(d.length>1) {mode=dm.ModeEnum.Coicop}
	return[mode,a,b,c,d]
}

function updateUrl() {
	const [c,u,i,o] = selectBoxes.getSelections()
	const urlFrag = `?country=${c}&unit=${u}&index=${i}&coicop18=${o}`
	window.history.replaceState(null, document.title, window.location.origin+urlFrag)
}

export function setupGlobalInfoClick(txt) {
  document.getElementById("globalInfoButton").addEventListener("action", () => {
		const el = document.getElementsByTagName("ewc-dialog")[0]
    el.title = "Information"
    el.bodyHtml = txt
		el.visible = true
  })
}

export function setupSharing(cfg) {
  const btn = document.getElementById("sharingButton")
  const sharingMenu = document.getElementsByTagName("ecl-like-social-share")[0]

	btn.addEventListener("action", () => { sharingMenu.toggleVisibility() })

  sharingMenu.setAttribute("text", cfg.text)
  sharingMenu.setAttribute("hashTags", cfg.hashTags)
  sharingMenu.setAttribute("mailSubject", cfg.mailSubject)
  sharingMenu.setAttribute("mailBody", cfg.mailBody)
}


function embedModalCallback(url) {
	const el = document.getElementsByTagName("ewc-dialog")[0]
	el.title = "Embed visualisation"
	el.textContent = `<iframe width="100%" height="800" src="${url}index.html"></iframe>`
	el.visible = true
}
