// ייבוא של מונגוס
const mongoose = require('mongoose');
// ייבוא של הפרטים מהכונפיג
const {config} = require("../config/secret")

main().catch(err => console.log(err));
// התחברות למונגוס
async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.nvsnpui.mongodb.net/nasimovShop`);
  console.log("mongo connect...")
}