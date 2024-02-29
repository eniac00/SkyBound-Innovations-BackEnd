const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: "Hello from test route" });
})

router.post('/', (req, res) => {
    console.log(req.body);
    res.status(200).json({ message: "recieved"});
})

module.exports = router;