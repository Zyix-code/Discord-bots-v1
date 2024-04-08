const Discord = require("discord.js");
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
  const mutedChannel = message.guild.channels.cache.find((channel) => channel.name === channelSettings.servers[serverID].mutedChannelName);
  if (!message.mentions.users.size && !args[0]) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
      .addField("Kullanım:", "`!susturma-kaldır [@Üye/ID]`")
      .addField("Örnek:", "`!susturma-kaldır @Elemmírë`");
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  let taggedUser;
  if (message.mentions.members.size > 0) {
    taggedUser = message.mentions.members.first();
  } else {
    const userID = args.shift();
    try {
      taggedUser = await message.guild.members.fetch(userID);
    } catch (error) {
      const accessDeniedEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`${message.author} Geçersiz kullanıcı etiketlendi veya belirtilen kullanıcı IDsi bulunamadı.`)
        .addField("Kullanım:", "`!susturma-kaldır [@Üye/ID]`")
        .addField("Örnek:", "`!susturma-kaldır @Elemmírë`");
      message.react(`${emojis.crossMark}`);
      return message.channel.send(accessDeniedEmbed).then(cmf => {
        cmf.delete({ timeout: 5000 })
      });
    }
  }
  const muteRole = message.guild.roles.cache.find((role) => role.name === `${auth.servers[serverID].serverMutedRole}`); // Susturma rolünün adını buraya yazın
  if (!taggedUser.roles.cache.has(muteRole.id)) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Bu ${taggedUser} kullanıcının mute işlemi bulunmamaktadır.`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  if (!mutedChannel) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Mute kanalı bulunmadı. #${channelSettings.servers[serverID].mutedChannelName} adında bir metin kanalı oluşturmanız gerekiyor.`);
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  try {
    await taggedUser.roles.remove(muteRole);
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription(`${message.author} Bu ${taggedUser} kullanıcının mute işlemi kaldırıldı.`);
    message.react(`${emojis.checkMark}`);
    return mutedChannel.send(accessDeniedEmbed);
  } catch (error) {
    console.error("Unmute işlemi sırasında bir hata oluştu:", error);
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Unmute işlemi sırasında bir hata oluştu.`);
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
};
module.exports.config = {
  name: 'Susturmayı Kaldır',
  description: 'Belirli bir kullanıcının mute işlemini kaldırır',
  usage: '!susturma-kaldır [@Üye/ID]',
  aliases: ['susturma-kaldır'],
  category: 'yetkili'
};
