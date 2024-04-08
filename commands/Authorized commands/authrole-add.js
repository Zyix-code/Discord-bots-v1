const Discord = require('discord.js');
const auth = require("../../data/permissionsData.json");
const emojis = require('../../data/emojisData.json');
const channelSettings = require('../../data/channelsData.json');

module.exports.run = async (client, message, args) => {
    const serverID = message.guild.id;

    if (!auth.servers[serverID]) {
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
        !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverAuthoritativeRole) &&
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
    const roleName = args.slice(1).join(' ');
    const logChannel = message.guild.channels.cache.find(channel => channel.name === channelSettings.servers[serverID].botlogChannelName);
    const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());

    if (!args[1]) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
            .addField('Kullanım:', '`!yetki-ver [@Üye/ID] [Yetki Rolü İsmi]`')
            .addField('Örnek:', '`!yetki-ver [@Elemmírë/ID] [Yetki Rolü İsmi]`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    if (!message.mentions.users.size && !args[0]) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz kullanıcı etiketlendi veya belirtilen kullanıcı IDsi bulunamadı.`)
            .addField('Kullanım:', '`!yetki-ver [@Üye/ID] [Yetki Rolü İsmi]`')
            .addField('Örnek:', '`!yetki-ver @Elemmírë Admin`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    let targetUser = null;
    if (message.mentions.users.size) {
        targetUser = message.mentions.users.first();
    } else if (args[0]) {
        const targetMember = message.guild.member(args[0]);
        if (targetMember) {
            targetUser = targetMember.user;
        }
    }

    if (!targetUser) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz kullanıcı etiketlendi veya belirtilen kullanıcı IDsi bulunamadı.`)
            .addField('Kullanım:', '`!yetki-ver [@Üye/ID] [Yetki Rolü İsmi]`')
            .addField('Örnek:', '`!yetki-ver @Elemmírë Admin`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    const targetMember = message.guild.member(targetUser);

    if (!role) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Belirtilen \`${roleName}\` yetki rolü bulunamadı.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    if (targetMember.roles.cache.has(role.id)) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${targetUser} adlı kullanıcı zaten ${role} yetki rolüne sahip.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    if (!logChannel) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Log kanalı bulunmadı. #${channelSettings.servers[serverID].botlogChannelName} adında bir metin kanalı oluşturmanız gerekiyor.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    try {
        await targetMember.roles.add(role);
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${message.author} tarafından ${targetUser} kullanıcıya ${role} rolü verildi.`)
        message.react(`${emojis.checkMark}`);
        return logChannel.send(accessDeniedEmbed);
    } catch (error) {
        console.error('Yetki verilirken bir hata oluştu:', error);
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Yetki verilirken bir hata oluştu.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};

module.exports.config = {
    name: 'Yetki Ver',
    description: `Belirli bir kullanıcıya admin rolünü verir.`,
    usage: '!yetki-ver [@Üye/ID] [Yetki Rolü İsmi]',
    aliases: ['yetki-ver'],
    category: 'yetkili'
};
