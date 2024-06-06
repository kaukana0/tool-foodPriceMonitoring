// all CSS as JS string

export default function get() {
  return getStyleTag(`

ewc-footer-links {
	display: flex;
	padding: 0 5% 0 5%;
}

.ewc-footer-links__container {
	width: 100%;
	height: 100%;
	display:flex;
	justify-content: space-between;
	gap: 20px;
}


.ewc-footer-links__links {
	font-size: 1rem;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	color: #0E47CB; 
}

.ewc-footer-links__links a span {
	white-space: nowrap;
}

.ewc-footer-links__links:hover{
	color:#082b7a;
} 

.ewc-footer-links__links:visited {
	color: #510dcd;
}
.ewc-footer-links__email {
	font-size: 1rem;
	display:flex;
	justify-content: space-evenly; 
	align-items: center; 
}

.ewc-footer-links__icon {
	width: 1.2rem;
	height: 1.2rem; 
	margin-right:5px;
	color: #0E47CB;
}

`)}


// helper
function getStyleTag(source) {
	const t = document.createElement('style')
	t.innerText = source
	return t
}
