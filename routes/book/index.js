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

	const userid = await getID(req.headers["authorization"]);

	const book = await Book.findOne({ _id: id, userid });

	if (!book) res.send("book is not found");

	res.json(book);
});

router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const userid = await getID(req.headers["authorization"]);

		const book = await Book.findOne({ _id: id, userid }).catch((e) => {
			throw new Error("id is wrong");
		});

		if (!book) res.send("book is not found");

		await book.remove();

		res.send("book is deleated");
	} catch (e) {
		res.send(e.message);
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description } = req.body;

		const userid = await getID(req.headers["authorization"]);

		await Book.findOneAndUpdate({ _id: id, userid }, { title, description });

		res.send("book is updated");
	} catch (e) {
		res.send(e.message);
	}
});

router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { name, value } = req.body;

		const userid = await getID(req.headers["authorization"]);

		const book = await Book.findOne({ _id: id, userid }).catch((e) => {
			throw new Error("id is wrong");
		});

		if (!book) res.send("book is not found");

		book[name] = value;

		book.save();
		res.send("book field is updated");
	} catch (e) {
		res.send(e.message);
	}
});

module.exports = router;
