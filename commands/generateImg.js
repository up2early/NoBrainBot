const fetch = require("node-fetch");
const {
	SlashCommandBuilder,
	EmbedBuilder,
} = require("discord.js");
const { imgBBKey } = require("../config.js");
const imgbbUploader = require("imgbb-uploader");
const logger = require('pino')()

const generateUploadPost = async (interaction) => {

	const prompt = interaction.options.getString("prompt");
	logger.info("Generating image with prompt: " + prompt);

	const base64Img = await generateImg(prompt);
	logger.info("Image generated, uploading to imgBB...");

	const imageURL = await uploadImg(base64Img);
	logger.info("Image uploaded, sending embed to discord");

	// Create the embed image
	const discordEmbed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle(prompt)
		.setImage(imageURL)
		.setTimestamp();

	// send the reply
	await interaction.editReply({
		embeds: [discordEmbed],
	})

	logger.info("Image sent to discord successfully!");
}

const generateImg = async (prompt) => {
	let base64Img;

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
			// Select just the image data
			base64Img = r.data[0].split(",")[1];
		})
		.catch((error) => {
			logger.error("Error in generating image, error below");
			logger.error(error);
			interaction.editReply(
				"Error with request, please try again."
			);
		});

	return base64Img;
}

const uploadImg = async (base64Img) => {
	let imageURL;

	// Upload the image to imgBB
	await imgbbUploader({
		apiKey: imgBBKey,
		base64string: base64Img,
		name: "prompt",
	})
		.then((response) => {
			imageURL = response.url;

		})
		.catch((error) => {
			logger.error("Error in uploading image, error below");
			logger.error(error);
			interaction.editReply(
				"Error with request, please try again."
			);
		});

	return imageURL;
}

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
	execute(interaction) {

		// Delay the reply so the user knows the bot is working
		interaction.deferReply();

		// Generate the image
		generateUploadPost(interaction);
	},
};
