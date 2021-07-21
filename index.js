const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

const { auth, book } = require("./routes");

// for post request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", auth);
app.use("/api/book", book);

async function start() {
    try {
        await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log("server run on port 8000");
        });
    } catch (e) {
        console.log(e);
    }
}

start();
