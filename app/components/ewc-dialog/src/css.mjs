// all CSS as JS string

export default function get() {
  return getStyleTag(`

.ewc-dialog__container {
	border: 0;
	border-radius: 4px;
}

.ewc-dialog__container::backdrop {
	background-color: rgb(0,0,0);
	background-color: rgba(0,0,0,0.4);
}

`)}


// helper
function getStyleTag(source) {
	const t = document.createElement('style')
	t.innerText = source
	return t
}
