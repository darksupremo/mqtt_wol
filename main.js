// ESM syntax is supported.
export {}

const mqtt = require('mqtt');
const NodeSSH = require('node-ssh')
const wol = require('node-wol');

const prefix = "wol/";
const {
    WOL_HOST,
    WOL_USER,
    WOL_PASS,
    WOL_MAC,
    WOL_BROADCAST_ADDR,
    MQ_HOST,
    MQ_USER,
    MQ_PASS
} = process.env;

console.log(`WOL_HOST: ${WOL_HOST}`)
console.log(`WOL_USER: ${WOL_USER}`)
console.log(`WOL_PASS: ${WOL_PASS}`)
console.log(`WOL_MAC: ${WOL_MAC}`)
console.log(`WOL_BROADCAST_ADDR: ${WOL_BROADCAST_ADDR}`)
console.log(`MQ_HOST: ${MQ_HOST}`)
console.log(`MQ_USER: ${MQ_USER}`)
console.log(`MQ_PASS: ${MQ_PASS}`)

if (!WOL_HOST || !WOL_USER || !WOL_PASS || !WOL_MAC || !WOL_BROADCAST_ADDR || !MQ_HOST || !MQ_USER || !MQ_PASS) {
    console.log("Environment vars not configured");
    process.exit();
}

const client  = mqtt.connect(`mqtt://${MQ_HOST}`, {
    username: MQ_USER,
    password: MQ_PASS
});

client.on('connect', function () {
    client.subscribe(`${prefix}#`);
});

client.on('message', function (topic, message) {
    const cmd = topic.split("/")[1];
    const value = parseInt(message.toString());
    if (cmd.toLowerCase() === 'toggle') {
        console.log(`rcv ${value}`)
        if (value <= 0) {
            shutdown();
        } else {
            wake();
        }
    }

});

const wake = function () {
    console.log("wake")
    wol.wake(WOL_MAC, {
        address: WOL_BROADCAST_ADDR
    }, function(error) {
        if(error) {
            console.log(`WOL Error: ${error}`)
            return
        }
        console.log("WOL Sent")
    });
}

const shutdown = function() {
    console.log("shutdown")
    let ssh = new NodeSSH()
    ssh.connect({
        host: WOL_HOST,
        username: WOL_USER,
        password: WOL_PASS
    }).then(function () {
        ssh.execCommand('shutdown /h', {}).then(function(result) {
            console.log('STDOUT: ' + result.stdout);
            console.log('STDERR: ' + result.stderr);

            if (ssh.connection) {
                // ignore dispose error on windows
                ssh.connection.on('error', function() { /* No Op */ })
                ssh.dispose()
            }
        })
    })
}
