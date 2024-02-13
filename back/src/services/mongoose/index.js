const mongoose = require("mongoose");
require("dotenv").config();
const mongoURL = process.env.MONGODB_URL;

mongoose.set("strictQuery", true);

async function main() {
    try {
        await mongoose.connect(mongoURL);
        console.log('Conectamos ao MongoDB');
    } catch (err) {
        console.error(err);
    }
}

main();

module.exports = main;