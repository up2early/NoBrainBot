require("dotenv").config();

module.exports = {
	token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  openaiKey: process.env.OPENAI_KEY,
};
