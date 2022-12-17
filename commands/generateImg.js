const fetch = require("node-fetch");
const {
	SlashCommandBuilder,
	EmbedBuilder,
} = require("discord.js");
const { imgBBKey } = require("../config.js");
const imgbbUploader = require("imgbb-uploader");
const logger = require('pino')()

module.exports = {
	data: new SlashCommandBuilder()
		.setName("generate_img")
		.setDescription("Generates an image using stable diffusion")
		.addStringOption((option) =>
			option
				.setName("prompt")
				.setDescription("The prompt to base the image off of")
				.setRequired(true),
		),
	async execute(interaction) {
		// Delay the reply so the user knows the bot is working
		await interaction.deferReply();

		const prompt = interaction.options.getString("prompt");
		logger.info("Generating image with prompt: " + prompt);

		// Send the prompt to the Hugging Face API
		await fetch(
			"https://up2early-stabilityai-stable-diffusion-2.hf.space/run/predict",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					data: [prompt],
				}),
			},
		)
			.then((r) => r.json())
			.then((r) => {
				logger.info("Image generated, uploading to imgBB...");

				// Prepare image for uploading
				const base64Img = r.data[0].split(",")[1];

				// Upload the image to imgBB
				imgbbUploader({
					apiKey: imgBBKey,
					base64string: base64Img,
					name: "prompt",
				})
					.then((response) => {
						logger.info("Image uploaded to imgBB, sending to Discord...");

						// Get the URL
						imageURL = response.url;

						// Create the embed image
						const discordEmbed = new EmbedBuilder()
							.setColor(0x0099ff)
							.setTitle(prompt)
							.setImage(imageURL)
							.setTimestamp();

						// send the reply
						return interaction.editReply({
							embeds: [discordEmbed],
						});
					})
			})
			.catch((error) => {
				logger.error("Error in request chain, error below");
				logger.error(error);
				return interaction.editReply(
					"Error with request, please try again."
				);
			});

	},
};
