const express = require('express');
const router = express.Router();
const Cookie = require('../model/cookie');


router.patch('/cookies/block/:id', async (req, res) => {
    try {
        const cookieId = req.params.id;
        const blockedStatus = req.body.blockedStatus;

        const updatedCookie = await Cookie.findByIdAndUpdate(cookieId, { blockedStatus }, { new: true });
        if (!updatedCookie) {
            return res.status(404).send('Cookie not found');
        }
        res.status(200).json(updatedCookie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const cookies = await Cookie.find({});
        res.json(cookies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;