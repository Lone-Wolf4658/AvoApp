
const {ipcRenderer} = require('electron'); 


ipcRenderer.on("ipStatus", (event, status) => {
    console.log(status.ip + "Version: " + status.softV)
    document.getElementById("ipDisplay").innerHTML = "Console IP: " + status.ip + " Running: V" + status.softV.slice(1,-1);
});

// Sending Event to index.js
// Request for the localIP
const ipSubmit = event => {
    const ip = event.target.elements.ip.value;
    if (ip === "") return false;
    ipcRenderer.send("check-new-ip", ip);
}

// Getting Event from index.js
// Respons for the localIP
ipcRenderer.on("console-ip", (event, ip) => {
    let ipDisplay = document.getElementById("ipDisplay")
    if (ip) {
        console.log("Console IP: " + ip.ip + " Running: V" + ip.runtimeVersion)
        ipDisplay.innerHTML = "Console IP: " + ip.ip + " Running: V" + ip.runtimeVersion;
    } else {
        ipDisplay.innerHTML = "Host not reached on: " + ip.ip + ":4430"
    }
});

// Sending Event to index.js
// Request for the localIP
const getLocalIp = event => {
    event.preventDefault();
    ipcRenderer.send("get-Local-Ip");
}
// Getting Event from index.js
// Respons for the localIP
ipcRenderer.on("new-Local-Ip", (event, ip) => {
    document.getElementById("ip").value = ip;
});