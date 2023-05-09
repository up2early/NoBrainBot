const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");
const logger = require('pino')()
const { Configuration, OpenAIApi } = require("openai");
const { openaiKey } = require("../config.js");

const generateResponse = async (prompt) => {

  const configuration = new Configuration({
    apiKey: openaiKey,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }, {
    timeout: 30000,
  });
  return response.data.choices[0].text;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chatgpt")
    .setDescription("Generates a response using GPT-3")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The prompt to base the response off of")
        .setRequired(true),
    ),
  async execute(interaction) {

    // Delay the reply so the user knows the bot is working
    await interaction.deferReply();

    // Generate the response
    const prompt = interaction.options.getString("prompt");
    logger.info("Generating response with prompt: " + prompt);

    generateResponse(prompt)
      .then(async (response) => {

        // Create the embed image
        const discordEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(prompt)
          .setDescription(response)
          .setTimestamp();

        // send the reply
        await interaction.editReply({
          embeds: [discordEmbed],
        });

        logger.info("Response sent to discord successfully!");
      })
      .catch((error) => {
        if (error.response) {
          logger.error('Error generating response, reason: ' + error.response.data.error.message);
          interaction.editReply(error.response.data.error.message);
        } else {
          logger.error('Error generating response, reason: ', error.message);
          interaction.editReply(error.message);
        }
      });
  },
};
