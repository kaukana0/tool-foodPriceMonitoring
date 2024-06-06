import HTML from  "./html.mjs"		// keep this file html free
import CSS from  "./css.mjs"			// keep this file css free


export default class Element extends HTMLElement {

	#isInitialized

	constructor() {	
		super()
	}

	connectedCallback() {
		if(!this.#isInitialized) {
			this.appendChild(HTML(
				this.getAttribute("email"),
				this.getAttribute("subject")
			))
			this.appendChild(CSS())
			this.#isInitialized = true
		}
	}

}

window.customElements.define('ewc-footer-links', Element)
