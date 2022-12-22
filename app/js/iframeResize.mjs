// see also chart.css

function inIframe() {
	try {
			return window.self !== window.top
	} catch (e) {
			return true
	}
}


export function init() {
  console.log("main: in iframe:",inIframe())
  if(inIframe()) {
    document.getElementById("chartcontainer").style.maxHeight="52%";
    document.getElementById("chart").style.maxHeight="100%";
  }
}
