const {
	SlashCommandBuilder,
	EmbedBuilder
  } = require('discord.js');
  const logger = require('pino')();
  const { Configuration, OpenAIApi } = require('openai');
  const { openaiKey } = require('../config.js');
  
  const generateImage = async (prompt) => {
	const configuration = new Configuration({
	  apiKey: openaiKey,
	});
	const openai = new OpenAIApi(configuration);
  
	const response = await openai.createImage({
	  prompt: prompt,
	  n: 1,
	  size: '1024x1024',
	}, {
	  timeout: 30000,
	});
	return response.data.data[0].url;

  };
  
  module.exports = {
	data: new SlashCommandBuilder()
	  .setName('imagegen')
	  .setDescription('Generates an image using DALL-E')
	  .addStringOption((option) =>
		option
		  .setName('prompt')
		  .setDescription('The prompt to base the image off of')
		  .setRequired(true),
	  ),
	async execute(interaction) {
	  // Delay the reply so the user knows the bot is working
	  await interaction.deferReply();
  
	  // Generate the image
	  const prompt = interaction.options.getString('prompt');
	  logger.info('Generating image with prompt: ' + prompt);
  
	  generateImage(prompt)
		.then(async (imageUrl) => {
		  // Create the embed with the image
		  const discordEmbed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle(prompt)
			.setImage(imageUrl)
			.setTimestamp();
  
		  // Send the reply
		  await interaction.editReply({
			embeds: [discordEmbed],
		  });
  
		  logger.info('Image sent to discord successfully!');
		})
		.catch((error) => {
		  logger.error('Error in generating image, error below');
		  logger.error(error);
		  interaction.editReply('Error with request, please try again.');
		});
	},
  };
  