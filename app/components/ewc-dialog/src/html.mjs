// all HTML as JS string

export default function get(assetBaseUrl = "./assets") {
  return getTemplateTag(`

<dialog aria-modal="true" class="ewc-dialog__container">
  <div class="ewc-dialog__container2">
    <div class="ewc-dialog__container3">
      <header class="ewc-dialog__header">
        <div class="ewc-dialog__title"></div>
        <button class="ewc-dialog__top-close-container1" type="button">
          <span class="ewc-dialog__top-close-container2">
            <img class="ewc-dialog__top-close-image" focusable="false" aria-hidden="true" src="${assetBaseUrl}/close-filled.svg"/>
          </span>
        </button>
      </header>
      <div class="ewc-dialog__body">
      </div>
    </div>
  </div>
</dialog>

`)}

// helper
function getTemplateTag(source) {
	const t = document.createElement('template')
	t.innerHTML = source
	return t.content
}
