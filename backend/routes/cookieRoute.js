const express = require('express');
const router = express.Router();
const Cookie = require('../model/cookie');

router.patch('/block/:id', async (req, res) => {
    try {
        const cookieId = req.params.id;
        const blockedStatus = req.body.blockedStatus;
        console.log(`Updating cookie ${cookieId} with blockedStatus: ${blockedStatus}`);

        const updatedCookie = await Cookie.findByIdAndUpdate(
            cookieId, 
            { blockedStatus }, 
            { new: true }
        );

        if (!updatedCookie) {
            return res.status(404).send('Cookie not found');
        }
        res.status(200).json(updatedCookie);
    } catch (error) {
        console.error(`Error updating cookie: ${error}`);
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

router.post('/', async (req, res) => {
    try {
        const cookies = req.body.cookies;
        const responses = [];

        for (const cookie of cookies) {
            const cookieId = `${cookie.domain}-${cookie.name}`;
            let foundCookie = await CookieModel.findOne({ identifier: cookieId });

            if (foundCookie) {
                Object.assign(foundCookie, cookie);
                await foundCookie.save();
                responses.push({ action: 'updated', cookie: foundCookie });
            } else {
                const newCookie = new CookieModel({ ...cookie, identifier: cookieId });
                await newCookie.save();
                responses.push({ action: 'created', cookie: newCookie });
            }
        }

        res.status(201).json(responses);
    } catch (error) {
        console.error('Error saving cookies:', error);
        res.status(500).send('Error saving cookies');
    }
});

module.exports = router;