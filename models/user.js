const { Schema, model } = require("mongoose");

const User = new Schema({
	name: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

module.exports = new model("users", User);
