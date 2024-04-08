const fs = require('fs');
const Discord = require('discord.js');
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
    !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverOwnerRole) &&
    !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverAuthoritativeRole) &&
    !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverAdminRole) &&
    !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverFemaleAuthoritativeRole) &&
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
    userID = args[0].replace(/[<@!>]/g, '');
  }

  if (!message.mentions.users.size && !args[0]) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
      .addField('Kullanım:', '`!kayıt-sıfırla [@Üye/ID]`')
      .addField('Örnek:', '`!kayıt-sıfırla @Elemmírë `');
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }

  const user = client.users.cache.get(userID) || client.users.cache.find(u => u.tag === userTag);
  const taggedMember = message.mentions.members.first() || user;

  if (!user) {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Geçersiz kullanıcı etiketlendi veya belirtilen kullanıcı IDsi bulunamadı.`)
      .addField('Kullanım:', '`!kayıt-sıfırla [@Üye/ID]`')
      .addField('Örnek:', '`!kayıt-sıfırla @Elemmírë `');
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
  function resetRecord(userID) {
    const data = fs.readFileSync('data/recordsData.json', 'utf8');
    const recordsData = JSON.parse(data);
    recordsData.servers[serverID][userID] = 0;
    const updatedData = JSON.stringify(recordsData);
    fs.writeFileSync('data/recordsData.json', updatedData, 'utf8');
  }
  try {
    const logChannel = message.guild.channels.cache.find(channel => channel.name === channelSettings.servers[serverID].botlogChannelName);
    const recordsData = JSON.parse(fs.readFileSync("data/recordsData.json", "utf8"));
    if (logChannel) {
      if (!recordsData.servers[serverID]) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
          .setColor('RED')
          .setDescription(`${message.author} Kayıt sıfırlanamadı. Geçerli bir \`sunucuID\` bulunmadı.
          Yetkili birisi ile iletişime geçiniz!`)
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
          cmf.delete({ timeout: 5000 })
        });
      }
      else {
        resetRecord(user.id);
        const accessDeniedEmbed = new Discord.MessageEmbed()
          .setColor('GREEN')
          .setDescription(`${message.author} tarafından ${taggedMember.toString()} kullanıcının kayıt sayısı sıfırlandı.`);
        message.react(`${emojis.checkMark}`);
        return logChannel.send(accessDeniedEmbed)
      }
    } else {
      const accessDeniedEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`Log kanalı bulunamadı. Log kanalı oluşturun: ${logChannelName}`);
      return message.channel.send(accessDeniedEmbed).then(cmf => {
        cmf.delete({ timeout: 5000 })
      });
    }
  } catch (error) {
    console.error('Kayıt sayısı sıfırlanırken bir hata oluştu.', error);
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Kayıt sayısı sıfırlanırken bir hata oluştu.`);
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
};
module.exports.config = {
  name: 'Kayıt Sıfırla',
  description: 'Etiketlenen kullanıcının kayıt sayısını sıfırlar.',
  usage: '!kayıt-sıfırla [@Üye/ID]',
  aliases: ['kayıt-sıfırla'],
  category: 'yetkili'
};
