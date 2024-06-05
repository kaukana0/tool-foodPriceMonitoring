import HTML from  "./html.mjs"		// keep this file html free
import CSS from  "./css.mjs"			// keep this file css free


export default class Element extends HTMLElement {

	#isInitialized=false

	constructor() {	
		super()	
	}
	
	connectedCallback() {
		if(this.#isInitialized) { return } else { this.#isInitialized=true }

		this.appendChild(HTML(this.getAttribute("assetBaseURL") ?? undefined))
		this.appendChild(CSS())
		this.querySelector(".ewc-dialog__top-close-container1").addEventListener("click", e=> {this.visible = false})		
	}

	set title(val) {
		this.querySelector(".ewc-dialog__title").textContent = val
	}

	set bodyHtml(val) {
		this.querySelector(".ewc-dialog__body").innerHTML = val
	}

	set textContent(val) {
		this.querySelector(".ewc-dialog__body").textContent = val
	}

	set visible(val) {
		if(!this.querySelector(".ewc-dialog__container")) { return }
		if(val===true) {
			this.querySelector(".ewc-dialog__container").showModal()
		} else {
			this.querySelector(".ewc-dialog__container").close()
		}
	}

}

window.customElements.define('ewc-dialog', Element)
