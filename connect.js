const mongoose = require('mongoose');
const password  = process.env.MONGODB_PASSWORD;

async function main(){
    await mongoose.connect(`mongodb+srv://anushkashukla3003:${password}@mealbridge.v0vnw.mongodb.net/?retryWrites=true&w=majority&appName=mealbridge`);
}

module.exports = main;