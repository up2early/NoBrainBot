const {
	SlashCommandBuilder,
	EmbedBuilder,
	AttachmentBuilder
} = require('discord.js');
const { OpenAI } = require('openai');
const logger = require('pino')();

const generateImage = async (prompt) => {
	const client = new OpenAI();

	const image = await client.images.generate({ 
		model: "dall-e-3",
		prompt: prompt,
	});


	return image.data[0].url;
}

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
			logger.info("Attaching image with URL: " + imageUrl)

			attachmentName = Date.now() + ".jpg";
			const attachment = new AttachmentBuilder(imageUrl).setName(attachmentName);

			// Create the embed with the image
			const discordEmbed = new EmbedBuilder()
				.setColor(0x0099ff)
				.setTitle(prompt)
				.setImage('attachment://' + attachmentName)
				.setTimestamp();

			// Send the reply
			await interaction.editReply({
				embeds: [discordEmbed], files: [attachment]
			});

			logger.info('Image sent to discord successfully!');
		} catch (error) {
			if (error.response) {
				logger.error('Error generating image, reason: ' + error.response.data.error.message);
				interaction.editReply(error.response.data.error.message);
			  } else {
				logger.error('Error generating image, reason: ', error.message);
				interaction.editReply(error.message);
			  }
		}
	},
};
