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

        const id = await getID(req.headers["authorization"]);

        const newBook = new Book({ title, description, userid: id });

        await newBook.save();

        res.send("book is created");
    } catch (e) {
        res.send(e.message);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const userId = await getID(req.headers["authorization"]);

    const book = await Book.findOne({ _id: id, userId });

    book.userid = 0;

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
        res.send(e.message);
    }
});

module.exports = router;
