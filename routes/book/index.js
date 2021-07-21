const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { Book } = require("../../models");

async function getID(auth) {
    if (!auth) {
        throw new Error("User not signedup");
    }

    const Token = auth.split(" ")[1];

    const { id } = await jwt.verify(Token, process.env.SecretKey);

    return id;
}

router.post("/", async (req, res) => {
    try {
        const { title, description } = req.body;

        const id = getID(req.headers["authorization"]);

        const newBook = new Book({ title, description, user: id });

        await newBook.save();

        res.send("book is created");
    } catch (e) {
        res.send(e);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const book = await Book.findOne({ user: id });

    book._id = 0;
    book.user = 0;

    res.json(book);
});

router.delete("/:email/:id", async (req, res) => {
    try {
        const { email: deleatedEmail, id } = req.params;

        const email = getID(req.headers["authorization"]);

        if (deleatedEmail !== email) {
            throw new Error("you can not deleat book");
        }

        await Book.deleteOne({ _id: id });
        console.log(id);
        res.send("book is deleated");
    } catch (e) {
        res.send(e);
    }
});

module.exports = router;
