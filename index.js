const Avolites = require('./Avolites.js')
const { openStreamDeck } = require('elgato-stream-deck')
const myDeck = openStreamDeck()
const profile = require('./profile.json')

const ip = "10.52.189.233"
const avo = new Avolites(ip)






myDeck.on('down', (keyIndex) => {
    const key = profile.keys[keyIndex]
    if (key === undefined) return;
    key.actions.forEach(act => {
        if (act.action === "down" || act.action === "flash") {
            avo[act.event](...act.vars)
            
        }
    });
    
})
myDeck.on('up', (keyIndex) => {
    const key = profile.keys[keyIndex]
    if (key === undefined) return;
    key.actions.forEach(act => {
        if (act.action === "up") {
            avo[act.event](...act.vars)
        }
    });
    
})




myDeck.on('error', (error) => {
	console.error(error)
})