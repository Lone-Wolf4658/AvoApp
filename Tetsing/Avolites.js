const http = require('http');

module.exports = class Avolites {
    constructor(ip) {
        this.dev = true;
        this.dryFire = false;
        this.ip = ip;
        this.timeout = 100;
        this.bpm1;
        this.bpmDiff = []
    }
    


    tapTempo(userNR){
        const prevTime = this.bpm1
        const newTime = new Date
        this.bpm1 = newTime
        var difference = Math.abs(prevTime-newTime)
        var bpm = Math.floor(60000 / difference)
        if (!bpm) return
        this.bpmDiff.unshift(bpm)
        var ar1 = this.bpmDiff
        const sum = (ar1[0] + ar1[1] + ar1[2])
        var newBpm = sum/3
        // 1000 ms = 1sec
        // 1min = 60 sec = 60000 ms
        
    
        if (userNR !== undefined && newBpm !== undefined){
            if (typeof userNR === 'number' && userNR > 0 && typeof newBpm === 'number' && newBpm >= 0){
                const cmd = `script/2/Masters/SetSpeed?handle_titanId=${userNR}&value=${newBpm}`
                this.sendCommand(cmd)
            }
        }
    }


    flashPlayback(userNR){
        if (userNR !== undefined){
            if (typeof userNR === 'number' && userNR > 0){
                const cmd = `script/2/Playbacks/FlashPlayback?handle=${userNR}`
                this.sendCommand(cmd)
            }
        }
    }

    playbackAtPercentage(userNR, percentage, alwaysRefire = true ){
        if (userNR !== undefined && percentage !== undefined){
            if (typeof userNR === 'number' && userNR > 0 && typeof percentage === 'number' && percentage <= 1 && percentage >= 0){
                const level = percentage*100
                const cmd = `script/2/Playbacks/FirePlaybackAtLevel?handle=${userNR}&level=${level}&alwaysRefire=${alwaysRefire}`
                this.sendCommand(cmd)
            }
        }
    }


    sendCommand(uri){
        if (this.ip !== undefined && uri !== undefined){
            var cmd = "http://" + this.ip + ":4430/titan/" + uri;
            if (this.dryFire){
                console.log('\x1b[41m' + "DRY!" +'\x1b[0m' , 'sendCommand:', 200, cmd);
            } else {
                http.get(cmd, res => {
                    if (res.statusCode !== 200) {
                        
                        console.log('\x1b[41m' + 'sendCommand:', res.statusCode, cmd);
                    } else {
                        if (this.dev){
                            console.log('sendCommand:', res.statusCode, cmd);
                        } 
                    }
                    
                });
            }
            
        }
    }

  


    sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    } 

    sumArr(arr){
        return arr => arr.reduce((a,b) => a + b, 0)
    }

} 