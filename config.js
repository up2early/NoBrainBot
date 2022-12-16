require("dotenv").config();

module.exports = {
	token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  testGuildId: process.env.TEST_GUILD_ID,
  imgBBKey: process.env.IMG_BB_KEY,
  openAiKey: process.env.OPENAI_API_KEY
};
