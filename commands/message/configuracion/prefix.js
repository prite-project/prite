const { MessageEmbed, Client, Message } = require("discord.js")
const GuildSettings = require("../../../models/settings.js")

module.exports = {
    name: "prefix",
    description: "Cambia el prefix del bot",
    category: "configuracion",
    syntax: "prefix <nuevo prefix>",
    cooldown: 10,
    aliases: "setprefix",
    permissions: ["ADMINISTRATOR"],

	/**
	 * @param {Client} client 
	 * @param {Message} message 
	 */

    run: async (client, message, args, config) => {
        if (!args[0]) return message.channel.send(`${config.mal} ¿ Y el prefix ?`)
        if (args[0].length > 5) return message.channel.send(config.mal + "El prefix no debe ser mayor a 5 caracteres")

        try {

            let storedSettings = await GuildSettings.findOne({ GuildID: message.guild.id });
            if (!storedSettings) {
                // If there are no settings stored for this guild, we create them and try to retrive them again.
                const newSettings = new GuildSettings({ GuildID: message.guild.id, });
                await newSettings.save().catch((e) => {
                    console.log(e);
                });
                storedSettings = await GuildSettings.findOne({ GuildID: message.guild.id });
            }

            storedSettings.Prefix = args[0];
            await storedSettings.save().catch((e) => {
                console.log(e);
            });

            message.channel.send(config.bien + ` Prefix cambiado a **${args[0]}**`)

        } catch (error) {
            message.channel.send(config.mal + " Uy , paso algo inesperado");
            console.log("ERROR :: " + error)
        }

    }
}