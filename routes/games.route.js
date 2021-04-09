const express = require('express');
const router = express.Router();

router.get('/servers/:game/status', (req, res) => {
    let serverType = req.params.game;
    res.send(serverType);
})

module.exports = router;
