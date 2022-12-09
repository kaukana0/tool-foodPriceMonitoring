function analytics_onError() {
	console.error("analytics: load failed, no analytics will be sent")
}

function analytics_onLoad() {
	let analyticsOptions = {
        instance: "ec.europa.eu",
        siteID: 59,
        mode: "manual",
		siteSection:"Food Price Monitoring (WIP)",
        customVariables: [
          ['asset-type', 'visualisation'],
          ['asset-title', 'Food Price Monitoring'],
          ['reference-period', '2021'],
          ['release', '2021']
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