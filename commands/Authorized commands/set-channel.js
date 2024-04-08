const fs = require('fs');
const Discord = require('discord.js');
const emojis = require('../../data/emojisData.json');
const auth = require("../../data/permissionsData.json");
const channelSettingsFilePath = 'data/channelsData.json';

module.exports.run = async (client, message, args) => {
  const channelSettings = JSON.parse(fs.readFileSync(channelSettingsFilePath, 'utf8'));
  const serverID = message.guild.id;
  try {
    fs.writeFileSync(channelSettingsFilePath, JSON.stringify(channelSettings, null, 2));
  } catch (err) {
    console.error("channelsDataJson kaydedilirken bir hata oluştu:", err);
  }
  if (!channelSettings.servers.hasOwnProperty(serverID)) {
    channelSettings.servers[serverID] = {
      welcomeChanelName: "default-welcome-channel",
      botlogChannelName: "default-botlog-channel",
      rulesChannelName: "default-rules-channel",
      mutedChannelName: "default-muted-channel"
    };
  }
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

  const channelNames = {
    welcomeChanelName: 'Üye Karşılama Kanalı',
    botlogChannelName: 'Bot Log Kanalı',
    rulesChannelName: 'Kurallar Kanalı',
    mutedChannelName: 'Muted Kanalı',
  };
  const channelAliases = {
    'hoşgeldin-kanalı': 'welcomeChanelName',
    'botlog-kanalı': 'botlogChannelName',
    'kurallar-kanalı': 'rulesChannelName',
    'susturma-kanalı': 'mutedChannelName',
  };

  if (args.length === 1) {
    const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Kanal Adları')
      .setDescription('Yanlış kanal türü girdiniz. Aşağıda bulunan kanal türlerinden birisini kullanarak kanal adını güncelleyebilirsiniz.')
      .addField('Örnek kullanım: ', '`!kanal-düzenle [hoşgeldin-kanalı] [yeni-kanal-adı]`');
    Object.entries(channelNames).forEach(([key, value]) => {
      const aliases = Object.keys(channelAliases).filter(alias => channelAliases[alias] === key);
      const aliasesText = aliases.length > 0 ? aliases.join(' / ') : 'Tanımlanmamış';
      embed.addField(value, `\n`, true);
      const channelSetting = channelSettings.servers[serverID][key] !== '' ? `\`${channelSettings.servers[serverID][key]}\`` : 'Tanımlanmamış';
      embed.addField('Kullanım', `${aliasesText}`, true);
      embed.addField('Tanımlı Kanal', `${channelSetting}`, true);
    });
    message.react(`${emojis.crossMark}`);
    return message.channel.send(embed);
  }

  if (args.length >= 2) {
    const channelTypeAlias = args[0];
    const channelName = args.slice(1).join(' ');
    const channelType = channelAliases[channelTypeAlias];
    if (!channelType || !channelSettings.servers[serverID].hasOwnProperty(channelType)) {
      const accessDeniedEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
        .addField('Kullanım:', '`!kanal-düzenle [kanal_türü] [kanal_adı]`')
        .addField('Örnek:', '`!kanal-düzenle [muted] [mute-kanal-adı]`');
      message.react(`${emojis.crossMark}`);
      return message.channel.send(accessDeniedEmbed).then(cmf => {
        cmf.delete({ timeout: 5000 })
      });
    }

    channelSettings.servers[serverID][channelType] = channelName;
    fs.writeFile(channelSettingsFilePath, JSON.stringify(channelSettings, null, 2), err => {
      if (err) {
        console.error('Kanal ayarları kaydedilirken bir hata oluştu:', err);
        const accessDeniedEmbed = new Discord.MessageEmbed()
          .setColor('GREEN')
          .setDescription(`${message.author} Kanal ayarları kaydedilirken bir hata oluştu`);
        message.react(`${emojis.checkMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
          cmf.delete({ timeout: 5000 })
        });
      }
      const accessDeniedEmbed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription(`${message.author} \`${channelNames[channelAliases[channelTypeAlias]]}\` alakalı kanal mesajları \`${channelName}\` kanalı olarak ayarlandı.`);
      message.react(`${emojis.checkMark}`);
      return message.channel.send(accessDeniedEmbed)
    });

  } else {
    const accessDeniedEmbed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
      .addField('Kullanım:', '`!kanal-düzenle [kanal_türü] [kanal_adı]`')
      .addField('Örnek:', '`!kanal-düzenle [muted] [mute-kanal-adı]`')
      .addField('Kullanım:', '`!set-channel [kanal_türü] [kanal_adı]`')
      .addField('Örnek:', '`!set-channel [muted] [mute-kanal-adı]`');
    message.react(`${emojis.crossMark}`);
    return message.channel.send(accessDeniedEmbed).then(cmf => {
      cmf.delete({ timeout: 5000 })
    });
  }
};

module.exports.config = {
  name: 'Kanal Düzenle',
  description: 'Belirli kanal türlerinin adlarını tanımlar.',
  usage: '!kanal-düzenle [kanal_türü] [kanal_adı]',
  aliases: ['kanal-düzenle'],
  category: 'yetkili'
};
