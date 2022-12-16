const fetch = require("node-fetch");
const {
	SlashCommandBuilder,
	AttachmentBuilder,
	MessageAttachment,
	EmbedBuilder,
} = require("discord.js");
const { imgBBKey } = require("../config.js");
const imgbbUploader = require("imgbb-uploader");

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
		await interaction.deferReply();
		const prompt = interaction.options.getString("prompt");
		fetch(
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
				let base64Img = r.data[0].split(",")[1];
				let imageBuf = new Buffer.from(base64Img, "base64");
				const image = new AttachmentBuilder(imageBuf, {
					name: "test.jpeg",
					description: "none",
				});

				imgbbUploader({
					apiKey: imgBBKey,
					base64string: base64Img,
					name: "prompt",
				})
					.then((response) => {
						const exampleEmbed = new EmbedBuilder()
							.setColor(0x0099ff)
							.setTitle(prompt)
							.setURL(response.url_viewer)
							.setImage(response.url)
							.setTimestamp();

						interaction.editReply({
							embeds: [exampleEmbed],
						});
					})
					.catch((error) => {
						interaction.editReply(
							"Error sending request to huggingface, please try again."
						);
					});
			});
	},
};
