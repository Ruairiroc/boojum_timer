const express = require('express');
const router = express.Router();

router.get('/timers', (req, res) =>{
    res.send('test');
});
