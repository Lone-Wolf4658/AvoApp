const http = require('http');

module.exports = class Avolites {
    constructor(ip) {
        this.dev = true;
        this.dryFire = false;
        this.ip = ip;
        this.timeout = 100;
    }
    
    tapTempo(userNR){
        if (userNR !== undefined){
            if (typeof userNR === 'number' && userNR > 0){
                const cmd = `script/2/Macros/Run?macroId=Avolites.Macros.Copy`
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


} 