const size = 16
const audio = new Audio('audio/success.mp3')
const main = document.querySelector('main')
var found = 0
var opened = 0
var table = []
var already = []
var lastOpened = null

for (let x = 0; x < (size / 4); x++) {
	for (let y = 0; y < (size / 4); y++) {
		let div
		if (!table[x]) {
			table[x] = []
			div = document.createElement('div')
			main.appendChild(div)
		}
		table[x][y] = null
		let id = getRandomId(0, size / 2 - 1)
		if (already.length == size / 2 - 1) already.splice(0)
		else already.push(id)
		div = document.querySelector(`div:nth-of-type(${x + 1})`)
		let span = document.createElement('span')
		span.setAttribute(`data-id`, id)
		span.setAttribute(`data-x-y`, `${x}-${y}`)
		let figure = document.createElement('figure')
		let img = document.createElement('img')
		img.src = `img/${id}.png`
		figure.appendChild(img)
		let figcaption = document.createElement('figcaption')
		figure.appendChild(figcaption)
		span.appendChild(figure)
		div.appendChild(span)
	}
}

function getRandomId(min, max) {
	let id = Math.floor(Math.random() * (max - min + 1)) + min
	if (already.includes(id)) return getRandomId(min, max)
	return id
}

function flipAll() {
	document.querySelectorAll('span').forEach(el => el.classList.remove('active'))
}

document.onclick = e => {
	if (document.querySelectorAll('span.active').length >= 2) return
	let el = e.target.parentNode.parentNode
	if (!el) return
	opened++
	if (el.classList.contains('found')) return flipAll()
	let cond1 = lastOpened && lastOpened.getAttribute('data-id') == el.getAttribute('data-id')
	let cond2 = lastOpened && lastOpened.getAttribute('data-x-y') != el.getAttribute('data-x-y')
	if (cond1 && cond2) {
		el.classList.add('found')
		lastOpened.classList.add('found')
		el.classList.remove('active')
		lastOpened.classList.remove('active')
		found++
		if (found >= size / 2) audio.src = 'audio/fanfare.mp3'
		else audio.src = 'audio/success.mp3'
		audio.currentTime = 0
		audio.play()
		opened = 0
		lastOpened = null
		return
	}
	audio.src = 'audio/score.mp3'
	audio.currentTime = 0
	audio.play()
	el.classList.add('active')
	if (opened >= 2) {
		opened = 0
		setTimeout(() => {
			flipAll()
		}, 1000)
		lastOpened = null
		return
	}
	lastOpened = el
}