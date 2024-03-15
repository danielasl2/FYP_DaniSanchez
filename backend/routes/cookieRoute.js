const express = require('express');
const router = express.Router();
const Cookie = require('../model/cookie');


router.patch('/block/:id', async (req, res) => {
    const { id } = req.params;
    const { blockedStatus, userId } = req.body;

    try {
        const cookie = await Cookie.findOne({ _id: id, userId });
        if (!cookie) {
            return res.status(404).send('Cookie not found or you cannot change it');
        }

        cookie.blockedStatus = blockedStatus;
        await cookie.save();
        res.json(cookie);  
    } catch (error) {
        console.error(`Error updating cookie status: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    const { userId } = req.query;
    try {
        const cookies = await Cookie.find({ userId: userId });
        res.json(cookies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
       //console.log('Receive cooies: ', req.body.cookies);
        const cookies = req.body.cookies.map(cookie => {
            if (!cookie.userId) {
                throw new Error('userId is required for cookie');
            }
            return cookie;
        });
        const responses = [];
        for (const cookie of cookies) {
            const cookieId = `${cookie.domain}-${cookie.name}`;
            cookie.session = !cookie.expirationDate;
            
            let foundCookie = await Cookie.findOne({ identifier: cookieId, userId: cookie.userId });
            if (foundCookie) {
                Object.assign(foundCookie, cookie);
                await foundCookie.save();
                responses.push({ action: 'updated', cookie: foundCookie });
            } else {
                const newCookie = new Cookie({ ...cookie, identifier: cookieId, userId: cookie.userId });
                await newCookie.save();
            //  console.log('Saved new cookie: ', newCookie)
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
