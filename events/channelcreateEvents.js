const Discord = require("discord.js");
const channelSettings = require("../data/channelsData.json");

function channelCreate(channel) {
  const serverID = channel.guild.id;
  const logChannel = channel.guild.channels.cache.find((ch) => ch.name === channelSettings.servers[serverID].botlogChannelName);

  if (!logChannel) {
    console.error("Log kanalı bulunamadı.");
    return;
  }
  const channelType = channel.type === 'text' ? 'Metin Kanalı' : channel.type === 'voice' ? 'Ses Kanalı' : 'Bilinmeyen Kanal';
  const embed = new Discord.MessageEmbed()
    .setColor('GREEN') 
    .setTitle('Kanal Oluşturuldu')
    .addField('Oluşturulan Kanal', `\`${channel.name}\``)
    .addField('Kanal ID', `\`${channel.id}\``)
    .addField('Türü', `\`${channelType}\``)
    .setTimestamp();

  logChannel.send(embed);
}

module.exports = channelCreate;
