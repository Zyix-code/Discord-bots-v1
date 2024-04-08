const Discord = require("discord.js");
const channelSettings = require("../data/channelsData.json");
const settings = require("../config/settings.json");

function messageDelete(message) {
  const serverID = message.guild.id;
  if (message.author.bot || message.content.startsWith(`${settings.prefix}`)) {
    return;
  }

  const logChannel = message.guild.channels.cache.find((channel) => channel.name === channelSettings.servers[serverID].botlogChannelName);
  if (!logChannel) {
    console.error("Log kanalı bulunamadı.");
    return;
  }

  const embed = new Discord.MessageEmbed()
    .setColor("#ff0000")
    .setTitle("Mesaj Silindi")
    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
    .addField("Silinen Mesaj", message.content)
    .addField("Silinen Mesajın Kanalı", message.channel.name)
    .setTimestamp();

  return logChannel.send(embed);
}

module.exports = messageDelete;
