const {
	SlashCommandBuilder,
	EmbedBuilder
} = require('discord.js');
const logger = require('pino')();
const { Configuration, OpenAIApi, error: OpenAIError } = require('openai');
const { openaiKey } = require('../config.js');

const generateImage = async (prompt) => {
	const configuration = new Configuration({
		apiKey: openaiKey,
	});
	const openai = new OpenAIApi(configuration);

	try {
		const response = await openai.createImage({
			prompt: prompt,
			n: 1,
			size: '1024x1024',
		}, {
			timeout: 30000,
		});
		return response.data.data[0].url;
	} catch (error) {
		if (error instanceof OpenAIError.RateLimitError) {
			logger.error('Rate limit error:', error);
			throw new Error('Rate limit exceeded, please try again later.');
		} else if (error instanceof OpenAIError.APIError) {
			logger.error('API error:', error);
			throw new Error('An error occurred with the API, please try again later.');
		} else {
			logger.error('Unexpected error:', error);
			throw new Error('An unexpected error occurred, please try again later.');
		}
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dalle')
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

		try {
			const imageUrl = await generateImage(prompt);
			console.log("Attaching image with URL: ", imageUrl)

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
		} catch (error) {
			logger.error('Error in generating image, error below');
			logger.error(error);
			interaction.editReply(error.message);
		}
	},
};
