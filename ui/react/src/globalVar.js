let vars = {}

export function getGlobalVar(name) {
    return vars[name]
}

export function setGlobalVar(name, value) {
    vars[name] = value
}