const { Client, Message, MessageEmbed, Discord, MessageAttachment } = require("discord.js")
const canvacord = require("canvacord");

module.exports = {
    name: "trigger",
    description: "¿De mal humor?",
    category: "imagenes",
    aliases: ["puteado"],
    syntax: "trigger <mencion>",
    cooldown: 5,
    permissions: ["SEND_MESSAGES"],
    run: async (client, message, args) => {



        let avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await canvacord.Canvas.trigger(avatar);
        let attachment = new MessageAttachment(image, "triggered.gif");
        message.channel.send({ files: [attachment] });

    }
}