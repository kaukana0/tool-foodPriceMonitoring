
export function applyEclClasses() {
	apply(".ewc-dialog__container", 						"ecl-modal ecl-modal--l")
	apply(".ewc-dialog__container2",						"ecl-modal__container")
	apply(".ewc-dialog__container3",						"ecl-modal__content ecl-col-12 ecl-col-m-10 ecl-col-l-8")
	apply(".ewc-dialog__header", 								"ecl-modal__header")
	apply(".ewc-dialog__title", 								"ecl-modal__header-content")
	apply(".ewc-dialog__top-close-container1", 	"ecl-button ecl-button--tertiary ecl-modal__close ecl-button--icon-only")
	apply(".ewc-dialog__top-close-container2", 	"ecl-button__container")
	apply(".ewc-dialog__top-close-image", 			"ecl-icon ecl-icon--m ecl-button__icon")
	apply(".ewc-dialog__body", 									"ecl-modal__body")
}

export function applyBootstrapClasses() {
	// if neccessary
}

export function applyTailwindClasses() {
	// if neccessary
}

// helper: add all classes given in "classes" to element given in "selector"
function apply(selector, classes) {
	classes.split(" ").forEach(function (cls) {
		if(cls) { document.querySelectorAll(selector).forEach(e=>e.classList.add(cls)) }
	})
}
