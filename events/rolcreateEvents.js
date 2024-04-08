const Discord = require("discord.js");
const channelSettings = require("../data/channelsData.json");

function roleCreate(role) {
  const serverID = role.guild.id;
  const logChannel = role.guild.channels.cache.find((ch) => ch.name === channelSettings.servers[serverID].botlogChannelName);
  
  if (!logChannel) {
    console.error("Log kanalı bulunamadı.");
    return;
  }

  const embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle('Rol Oluşturuldu')
    .addField('Oluşturulan Rol', `\`${role.name}\``)
    .addField('Rengi', `\`${role.hexColor}\``)
    .setTimestamp();
  logChannel.send(embed);
}

module.exports = roleCreate;
