require("dotenv").config();

module.exports = {
  mongoURI: "mongodb+srv://admin2:yhQgrZXc8Cjl3QC6@cluster0.r2dy9.mongodb.net/FlatsApi?retryWrites=true&w=majority",
  nodeENV: process.env.NODE_ENV,
  secretOrKey: process.env.SECRET_KEY

};
