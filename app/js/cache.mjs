import * as zip from "../../redist/lz-string.mjs"

// returns true if at least one day has elapsed since data was last stored. false otherwise.
export function init() {
    window.addEventListener('keydown', e => {
        if(e.ctrlKey && e.shiftKey && e.key==="F") {
            console.debug("clearing localstore")
            localStorage.clear()
        }
    })

    const id = "lastUpdate"
    const lastUpdate = window.localStorage.getItem(id)
    if(lastUpdate) {
        const last = Date.parse(lastUpdate)
        const oneDay = 1000*60*60*24
        if(Date.now()-last > oneDay) {
            window.localStorage.removeItem("lastUpdate")
            return true
        }
    } else {
        window.localStorage.setItem(id, Date())
    }

    return false
}

export function store(data, id) {
    if(!window.localStorage.getItem(id)) {
        const dataString = JSON.stringify(data)
        const dc = zip.LZString.compress(dataString)
        console.log( `caching into localstore w/ id '${id}'. data [MB] original=${dataString.length/1024/1024}, compressed=${dc.length/1024/1024}` )
        window.localStorage.setItem(id, dc)
    }
}

export function restore(id) {
    let retVal
    const d = window.localStorage.getItem(id)
    if(d) {
        console.debug(`using cached data. localstore id=${id}`)
        retVal = zip.LZString.decompress(d)
    }
    return retVal
}

export function remove(id) {
    window.localStorage.removeItem(id)
}

