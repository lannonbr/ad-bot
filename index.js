require("dotenv").config();
const { Client, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log("Discord bot is ready");
});

client.on("messageCreate", async (msg) => {
  if (!msg.author.bot) {
    await msg.channel.send({
      content: `You sent: ${msg.content}`,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
