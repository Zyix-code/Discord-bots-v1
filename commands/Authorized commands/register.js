const Discord = require("discord.js");
const fs = require("fs");
const auth = require("../../data/permissionsData.json");
const emojis = require('../../data/emojisData.json');
const channelSettings = require('../../data/channelsData.json');
module.exports.run = async (client, message, args) => {
  const serverID = message.guild.id;
  if (!auth.servers[serverID]) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Bu komudu kullanabilmek için ilk öncellikle **serverID** tanımlaması gerekiyor.\nBot sahibi ile iletişime geçiniz.`)
      .addField(`${emojis.king} Yapımcı`, `**.Zyix#0**`)
      .addField('Destek Sunucusu', 'https://discord.gg/3p4GAVvSU3');
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  if (!channelSettings.servers[serverID]) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Bu komudu kullanabilmek için ilk önce **serverID** tanımlamanız gerekiyor.\nBot sahibi ile iletişime geçiniz.`)
      .addField(`${emojis.king} Yapımcı`, `**.Zyix#0**`)
      .addField('Destek Sunucusu', 'https://discord.gg/3p4GAVvSU3');
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  if (
    !message.member.roles.cache.some((role) => role.name === auth.servers[serverID].serverOwnerRole) &&
    !message.member.roles.cache.some((role) => role.name === auth.servers[serverID].serverAuthoritativeRole) &&
    !message.member.roles.cache.some((role) => role.name === auth.servers[serverID].serverAdminRole) &&
    !message.member.roles.cache.some((role) => role.name === auth.servers[serverID].serverFemaleAuthoritativeRole) &&
    message.author.id !== auth.servers[serverID].ownerID
  ) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Bu komutu kullanabilmek için yetkiniz bulunmamaktadır.`);
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  let userTag = args[0];
  let userID;

  if (args[0]) {
    userID = args[0].replace(/[<@!>]/g, "");
  }

  if (!message.mentions.users.size && !args[0]) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
      .addField("Kullanım:", "`!kayıt [@Üye/ID] [İsim] [Yaş] [Cinsiyet = {erkek = e, Kadın = k} ]`")
      .addField("Örnek:", "`!kayıt @Elemmírë Selçuk 23 e`");
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  const user = client.users.cache.get(userID) || client.users.cache.find((u) => u.tag === userTag);
  if (!user) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Geçersiz kullanıcı etiketlendi veya belirtilen kullanıcı IDsi bulunamadı.`)
      .addField("Kullanım:", "`!kayıt [@Üye/ID] [İsim] [Yaş] [Cinsiyet = {erkek = e, Kadın = k} ]`")
      .addField("Örnek:", "`!kayıt @Elemmírë Selçuk 23 e`");
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  const logChannel = message.guild.channels.cache.find((channel) => channel.name === channelSettings.servers[serverID].botlogChannelName);
  if (!logChannel) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(
        `${message.author} Log kanalı bulunmadı. #${channelSettings.servers[serverID].botlogChannelName} adında bir metin kanalı oluşturmanız gerekiyor.`
      );
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  userTag = user.tag;
  const recordsData = JSON.parse(fs.readFileSync("data/recordsData.json", "utf8"));
  const moderatorID = message.author.id;
  if (!recordsData.servers[serverID]) {
    recordsData.servers[serverID] = {};
  }
  if (recordsData.servers[serverID]) {
    if (recordsData.servers[serverID][moderatorID]) {
      recordsData.servers[serverID][moderatorID] += 1;
    } else {
      recordsData.servers[serverID][moderatorID] = 1;
    }
  } else {
    recordsData.servers[serverID] = {
      [moderatorID]: 1
    };
  }
  fs.writeFileSync("data/recordsData.json", JSON.stringify(recordsData));
  const kayitSayisi = recordsData.servers[serverID][moderatorID];
  const mentionedUser = user;
  const username = args[1];
  const age = args[2];
  const gender = args[3];

  if (!username || !age || !gender) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Kayıt yapmak için kullanıcının ismi, yaşı ve cinsiyeti girilmelidir.`);
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  if (isNaN(age)) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Yaş bilgisi sayısal bir değer olmalıdır.`);
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }

  if (!isNaN(username.charAt(0))) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Kullanıcının adı sayı ile başlayamaz.`);
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  const member = message.guild.member(mentionedUser);
  if (member.roles.cache.some((role) => role.name === auth.servers[serverID].serverMaleMemberRole || role.name === auth.servers[serverID].serverFemaleMemberRole)) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Bu kullanıcı zaten kayıt edilmiş.`);
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed);
  }
  const targetRole = message.guild.roles.cache.find((role) => role.name === auth.servers[serverID].serverAdminRole);
  const roleEtiket = targetRole ? `<@&${targetRole.id}>` : auth.servers[serverID].serverAdminRole;
  let roleName;
  let genderText;
  if (gender === "e") {
    roleName = auth.servers[serverID].serverMaleMemberRole;
    genderText = "Erkek";
  } else if (gender === "k") {
    roleName = auth.servers[serverID].serverFemaleMemberRole;
    genderText = "Kadın";
  } else {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Geçersiz cinsiyet. Lütfen erkek ise 'e' kadın ise 'k' olarak belirtiniz.`);
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  const role = message.guild.roles.cache.find((r) => r.name === roleName);
  if (!role) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Kayıt rolü bulunamadı. [${roleName}] adında bir kayıt rolü oluşturmanız gerekiyor.`);
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  member.roles.add(role);
  member.setNickname(`${username} ${age}`);
  function getRecordIcon(count) {
    const intervals = [333, 666, 1000];
    const icons = ["🥉", "🥈", "🥇"];
    for (let i = intervals.length - 1; i >= 0; i--) {
      if (count >= intervals[i]) {
        return icons[i];
      }
    }
    return icons[0];
  }
  const recordIcon = getRecordIcon(kayitSayisi);
  const registerEmbed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setTitle("Yeni Kayıt")
    .addField("Kullanıcı", `<@${mentionedUser.id}>`)
    .addField("İsim", `\`${username}\``)
    .addField("Yaş", `\`${age}\``)
    .addField("Cinsiyet", `\`${genderText}\``)
    .addField("Kaydı Yapan Yetkili", `<@${message.author.id}>`)
    .addField("Kayıt Sayısı", `\`${kayitSayisi} ${recordIcon}\``)
    .setTimestamp();
  logChannel.send(registerEmbed);

  const welcomeChannel = message.guild.channels.cache.find((channel) => channel.name === channelSettings.servers[serverID].welcomeChanelName);

  if (welcomeChannel) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`Sunucumuza hoş geldin, ${username}! Burada keyifli vakit geçirmen dileğiyle. ${mentionedUser}`);
    return welcomeChannel.send(accessDeniedEmbed);
  } else {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`Hoş geldin mesajı gönderilecek bir kanal bulunmadı. Lütfen yetkili birisi ile iletişime geçiniz. ${roleEtiket}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
};
module.exports.config = {
  name: 'Kayıt Et',
  description: 'Belirli bir kullanıcıyı sunucuya kayıt eder ve yetki verir.',
  usage: '!kayıt [@Üye/ID] [İsim] [Yaş] [Cinsiyet]',
  aliases: ['kayıt'],
  category: 'yetkili'
};
