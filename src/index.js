const {Client, Intents}= require('discord.js');
const client = new Client({ allowedMentions: {parse: ['users']}, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const config = require('../config.json');
const logger = require('@greencoast/logger');
const handler = require('./handler/handler')

client.on("ready", () => {
    logger.log(`Logged in as ${client.user.tag}`);
    setInterval(() => {
        logger.log("Automatically saving learned words.")
        handler.save();
    }, 5 * 60 * 1000);
});

client.on("messageCreate", async(message) => {
    if(message.author.bot) return;
	if(message.guild && message.guild.id !== config.allowedGuild) return;
    if(message.channel.id !== config.allowedChannel) return;

    if(config.ownerId === message.author.id && message.content.startsWith(`${config.prefix}save`)) {
        logger.log("Manually saving learned words.");
        message.channel.send(":warning: Saving learned words...")
        return handler.save();
    }

	if(!config.acceptMentions && message.mentions.users.size > 0) 
        return message.channel.send("Mentions are disabled!");

    let args = message.content.split(" ");

    if(config.training) {
        if(config.logs) logger.log(`Training with phrase "${args.join(" ")}"`)
        handler.train(args);
    }

    if(config.enabled) { 
        let sentenceArgs = handler.createSentence([]);
        message.channel.send(sentenceArgs.join(" "));
    }
});

client.login(config.token);