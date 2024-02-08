const express = require("express");
const { URL }  = require("../db");
const validUrl = require("valid-url");
const { customAlphabet } = require ('nanoid');
const { authMiddleware} = require("../middleware");

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const baseUrl = process.env.BASEURI;

const router = express.Router();

router.get('/:code', async (req, res) => {
    console.log("inside code");
    try {
        const { code } = req.params;
        const url = await URL.findOne({
            urlCode: code
        });
        if (url) {
            url.clicks++;
            await url.save();
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json('No URL Found');
        }

    }
    catch (err) {
        console.error(err);
        res.status(500).json('Server Error');
    }
});

router.get("/my/links", authMiddleware, async(req, res) => {
    const user = req.userId;
    const userlinks = await URL.find({ user })
    res.json(userlinks);
});

router.post("/shorten", authMiddleware , async (req, res) => {
    console.log("inside short")
    const { longUrl, urlCode } = req.body;


    try {

        if (!validUrl.isUri(longUrl)) {
            return res.status(401).json({ error: "Invalid Url" });
        }


        if (urlCode) {
            const existingCodeBookmark = await URL.findOne({ urlCode });

            if (existingCodeBookmark) {
                return res.status(400).json({ error: `Code ${urlCode} already in use. Please choose a different code.` });
            }
        }

        const existingURL = await URL.findOne({ longUrl });

        if (existingURL && !urlCode) {
            return res.json({ urlCode: existingURL.urlCode });
        }

        let generatedCode = customAlphabet(alphabet,10)();
        const shortUrl = `${baseUrl}/url/${generatedCode}`;

        const newURL = new URL({
            urlCode: generatedCode,
            longUrl,
            shortUrl,
            user: req.userId
        });
        await newURL.save();
        res.status(201).json({ urlCode: generatedCode });
    } catch (error) {
        console.error('Error shortening URL:', error);
        res.status(500).json({ error: 'Failed to shorten URL' });
    }

});

router.delete("/delete/:urlCode", async (req,res) => {
        const { urlCode } = req.params;
        const url = await URL.findOneAndDelete({ urlCode })
        if(url){
            return res.status(200).json(url)
        }else {
            return res.status(404).json({"message": "error occurred"})
        }
})

router.put("/update/:urlCode", async(req,res) => {

    console.log("inside update");
    const { urlCode }= req.params;
    const { newurl } = req.query;
    if (!validUrl.isUri(newurl)) {
        return res.status(401).json({ error: "Invalid Url" });
    }
    const url = await URL.findOneAndUpdate({ urlCode },{ longUrl: newurl})
    if(url){
        return res.status(200).json(url)
    }else {
        return res.status(404).json({"message": "error occurred"})
    }
})

module.exports = router;