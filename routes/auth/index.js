const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { User } = require("../../models");

router.post("/signup", async (req, res) => {
    try {
        const { name, email } = req.body;

        const newUser = new User({ name, email });

        const signedJWT = await jwt.sign(
            {
                id: newUser._id,
            },
            process.env.SecretKey
        );

        await newUser.save();

        res.send(signedJWT);
    } catch (e) {
        res.send(e.message);
    }
});

module.exports = router;
