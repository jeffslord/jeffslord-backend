const gamedig = require('gamedig');

function getServerStatus(gameType) {
    gamedig.query({
        type: gameType,
        host: 'terraria.jeffslord.com'
    }).then(state => {
        console.log(state);
    }).catch(err => {
        console.log("Server is offline");
    })
}

module.exports = {}