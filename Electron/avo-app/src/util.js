const { networkInterfaces } = require('os');
const http = require('http');


const getIp = () => {
    const nets = networkInterfaces();
    var results = "";

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                results = net.address;
            }
        }
    }
    return results
}

const sendCommand = (ip, url) => {
    // Creating the Promise
    return new Promise(function(resolve, reject) {
        // Checking for valide inputs
        if (ip === undefined || ip <= 7 || url === undefined || typeof url !== "string") return reject(new Error(`Unable to create CMD! missing args - IP: ${ip}, URL: ""${url}""`));
        // Creating the CMD    
        let cmd = "http://" + ip + ":4430/titan/" + url;
        // Making a request
        const req = http.get(cmd, res => {            
            // Checking for errorcodes
            if (res.statusCode !== 200) return reject(new Error(`Request Failed! - Code: ${res.statusCode}, Trying to run: ""${cmd}""`));
            // Formating data From BUFFER to utf8
            res.on('data', buffer => {
                // Formating string an removing ""
                let result = buffer.toString('utf8').slice(1, -1);
                resolve(result) // Returning Value
            })
        })
        // Error handeling
        req.on('error', error => {
            return reject(new Error(`BAD request! - Code: "Host not reached", Trying to run: ""${cmd}""`, error))
          })
        
    })
}

module.exports = {
    getIp,
    sendCommand
}