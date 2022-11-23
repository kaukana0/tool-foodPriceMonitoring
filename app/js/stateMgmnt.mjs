// unfinished feature (feature flag = false)
// anything participating has to implement store() and restore()

import {getURLParameterValue} from "../components/util/util.mjs"



export function store() {
    _store("selectCountry")
    _store("selectUnit")
    _store("selectIndex")
    _store("selectCoicop")
    _store("timeRange")
}


export function restore() {
    _restore("selectCountry")
    _restore("selectUnit")
    _restore("selectIndex")
    _restore("selectCoicop")
    _restore("timeRange")
}


function _store(id) {
    const data = JSON.stringify(document.getElementById(id).getState())    
    window.localStorage.setItem(id, data)
}


function _restore(id) {
    let data = fromUrlParam(id)
    if(!data) {
        data = fromLocalStorage(id)
    }

    if(data) {
        document.getElementById(id).setState(data)
    } else {
        //console.log("No state restored for " + id)
    }
}


function fromUrlParam(id) {
    const param = id
    const data = getURLParameterValue(param)
    if(data) {
        //console.log("restore from URL parameter for " + id)
        return data
    } else {
        return null
    }
}


function fromLocalStorage(id) {
    const s = window.localStorage.getItem(id)
    if(s) {
        const data = JSON.parse(s);
        console.log("restore from local storage for " + id)
        window.localStorage.removeItem(id);
        return data
    } else {
        return null
    }
}
