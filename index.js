const config = require(`./settings/config.json`);
const { Client, Intents, Collection } = require('discord.js');
const colors = require("colors")
const Enmap = require("enmap")
const discord = require('discord.js')
const { Player } = require('discord-player');
const express = require("express");
const app = express();
const http = require("http"); 
const fetch = require('node-fetch');
const mongoose = require("mongoose");

const client = new Client({ 
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    intents: 98045,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: true
    },
    cacheWithLimits: {
        MessageManager: {
            sweepInterval: 300,
            sweepFilter: discord.Sweepers.filterByLifetime({
                lifetime: 60,

            })
        }
    },
  
    disableMentions: 'everyone'

});


mongoose.connect(config.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  client.logger.log(`> ✅ • Se ha cargado exitosamente la base de datos`, "success");
}).catch(() => {
  client.logger.log(`> ⛔ • Uh , creo que ha paso algo inesperado`, "error");
})


module.exports = client;
client.logger = require('./utils/logger');
client.config = config;
client.commands = new Collection();
client.slsCommands = new Collection();
client.categories = require("fs").readdirSync(`./commands`);
["eventHandler", "commandHandler", "slsCmdHandler"]
    .filter(Boolean)
    .forEach(h => {
      require(`./handlers/${h}`)(client);
});




client.on('error', error => client.logger.log(error, "error"));
client.on('warn', info => client.logger.log(info, "warn"));
process.on('unhandledRejection', error => client.logger.log("UNHANDLED_REJECTION\n" + error, "error"));
process.on('uncaughtException', error => {
    client.logger.log("UNCAUGHT_EXCEPTION\n" + error, "error");
    client.logger.log("Uh , paso algo inesperado , reiniciando...", "info");
    process.exit(1);
});






app.get("/", (request, response) => {
  console.log(`Estamos en la nube`);
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 60000);

client.login(process.env.TOKEN);