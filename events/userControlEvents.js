const Discord = require("discord.js");
const channelSettings = require("../data/channelsData.json");
const auth = require("../data/permissionsData.json");
const emojis = require('../data/emojisData.json');
function userControl(member, inviterTag, guildInviteData) {
  const serverID = message.guild.id;
  const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === channelSettings.servers[serverID].welcomeChanelName);
  const modRole = member.guild.roles.cache.find((role) => role.name === auth.serverAdminRole);
  const userName = member.user.tag.split("#")[0];
  const accountCreatedAt = member.user.createdAt;
  const now = new Date();
  const accountAge = now - accountCreatedAt;
  const accountAgeInDays = Math.floor(accountAge / (1000 * 60 * 60 * 24));
  const reliabilityMessage = accountAgeInDays < 60 ? `Güvenilirlik durumu: ${emojis.crossMark} Güvensiz!` : `Güvenilirlik durumu: ${emojis.checkMark} Güvenilir!`;
  const userAvatar = member.user.displayAvatarURL({ dynamic: true, size: 128 });
  if (!welcomeChannel) {
    console.log(`Welcome mesajlarını gönderilecek kanal bulunamadı. ${channelSettings.servers[serverID].welcomeChanelName} kanalı oluşturunuz.`);
  }
  welcomeChannel.send(`<@&${modRole.id}>, ${member.user} sunucuya giriş yaptı.`);
  const embed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setAuthor(`Hoş Geldin!`, 'https://gamerpapers.com/wp-content/uploads/2022/01/b53271dc3ca94cc8ecb8fa770ebdc187.jpg')
    .setDescription(`${emojis.smallBlueDiamond} **Yeni Bir Kullanıcı Katıldı, 👋 ${userName}!**\n
    ${emojis.smallBlueDiamond} **Sunucumuza hoş geldin ${member.user}**\n
    ${emojis.smallBlueDiamond} **Senin ile birlikte ${member.guild.memberCount} kişiyiz.**\n
    ${emojis.smallBlueDiamond} **Kayıt olmak için yetkili birisini beklemen yeterlidir.**\n
    ${emojis.smallBlueDiamond} **Davet eden kişi:** ${inviterTag} **Davet Sayısı:** \`${guildInviteData.uses}\` \n
    ${emojis.smallBlueDiamond} **Hesap oluşturma tarihi:** \`${member.user.createdAt.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}\`\n
    ${emojis.smallBlueDiamond} **Sunucuya katılma tarihi:** \`${member.joinedAt.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}\`\n
    ${emojis.smallBlueDiamond} **${reliabilityMessage}**\n`)
    .setThumbnail(userAvatar)
    .setTimestamp()
    .setFooter(".zyix", 'https://gamerpapers.com/wp-content/uploads/2022/01/b53271dc3ca94cc8ecb8fa770ebdc187.jpg');
  welcomeChannel.send(embed);
}

module.exports = userControl;
