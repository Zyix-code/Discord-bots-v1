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
    const logChannel = message.guild.channels.cache.find(channel => channel.name === channelSettings.servers[serverID].botlogChannelName);
    if (!message.mentions.users.size && !args[0]) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
            .addField('Kullanım:', '`!at [@Üye/ID] [Sebep]`')
            .addField('Örnek:', '`!at [@Elemmírë/ID] [Sebep]`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    let taggedUser;
    if (message.mentions.users.size) {
        taggedUser = message.mentions.members.first();
    } else {
        taggedUser = await message.guild.members.fetch(args[0]).catch(() => null);
    }
    if (!taggedUser) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz kullanıcı etiketlendi veya belirtilen kullanıcı IDsi bulunamadı.`)
            .addField('Kullanım:', '`!at [@Üye/ID] [Sebep]`')
            .addField('Örnek:', '`!at [@Elemmírë/ID] [Sebep]`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    if (taggedUser && (taggedUser.id === auth.servers[serverID].ownerID || message.mentions.has(auth.servers[serverID].ownerID))) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bot sahibini sunucudan atamazsınız.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed);
    }
    if (!logChannel) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Log kanalı bulunmadı. #${channelSettings.servers[serverID].botlogChannelName} adında bir metin kanalı oluşturmanız gerekiyor.`)
        message.react(`${emojis.crossMark}`)
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    const reason = args.slice(1).join(' ');
    if (!reason) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Yasaklama nedenini belirtmelisiniz.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    try {
        await taggedUser.kick(reason);
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${taggedUser} adlı kullanıcı ${message.author} tarafından sunucudan atıldı. Sebep: ${reason}`);
        message.react(`${emojis.checkMark}`);
        return logChannel.send(accessDeniedEmbed);
    } catch (error) {
        console.error('Kickleme işlemi sırasında bir hata oluştu:', error);
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Kickleme işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};
module.exports.config = {
    name: 'Kullanıcı At',
    description: 'Belirli bir kullanıcıyı sunucudan atar',
    usage: '!at [@Üye/ID] [Sebep]',
    aliases: ['at'],
    category: 'yetkili'
};
