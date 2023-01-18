function analytics_onError() {
	console.error("analytics: load failed, no analytics will be sent")
}

function analytics_onLoad() {
	let analyticsOptions = {
        instance: "ec.europa.eu",
        siteID: 59,
        mode: "manual",
		siteSection:"Economy",
        customVariables: [
          ['asset-type', 'visualisation'],
          ['asset-title', 'food-price-monitor'],
          ['release', '2022']
        ]
    }
    try {
        estatAnalytics_addTools()
        estatAnalytics_addAnalytics(analyticsOptions)
    } catch(e) {
        console.error("analytics:",e)
    }
    console.debug("analytics: loaded")
    estatAnalytics_registerReadyCallback(() => console.debug("analytics: ready"))
}