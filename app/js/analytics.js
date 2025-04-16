function analytics_onError() {
	console.error("analytics: load failed, no analytics will be sent")
}

function analytics_onLoad() {
	let analyticsOptions = {
        instance: "ec.europa.eu",
        siteID: 'a441974e-4574-4f0a-9ed2-f90fb8547bb7',
        mode: "manual",
		siteSection:"Economy",
        customVariables: [
          ['asset-type', 'visualisation'],
          ['asset-title', 'food-price-monitor'],
          ['release', '2024']
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