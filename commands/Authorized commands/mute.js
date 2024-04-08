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

    const mutedChannel = message.guild.channels.cache.find(channel => channel.name === channelSettings.servers[serverID].mutedChannelName);

    if (!args[0]) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
            .addField('Kullanım:', '`!sustur [@Üye/ID] [Süre] [Sebep]`')
            .addField('Örnek:', '`!sustur @Elemmírë 1h Spam`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    let taggedUser;
    let muteTime;
    let muteReason;

    if (message.mentions.members.size > 0) {
        taggedUser = message.mentions.members.first();
        muteTime = args[1];
        muteReason = args.slice(2).join(' ');
    } else {
        const userID = args.shift();
        taggedUser = message.guild.members.cache.get(userID)?.user;
        muteTime = args[0];
        muteReason = args.slice(1).join(' ');
    }

    if (!taggedUser) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz kullanıcı etiketlendi veya belirtilen kullanıcı IDsi bulunamadı.`)
            .addField('Kullanım:', '`!sustur [@Üye/ID] [Süre] [Sebep]`')
            .addField('Örnek:', '`!sustur @Elemmírë 1h Spam`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    const timeRegex = /^(\d+)([hm])$/;
    const timeMatch = String(muteTime).match(timeRegex);

    if (!timeMatch) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçerli bir süre belirtmelisiniz. Örneğin: 1h (1 saat) veya 1m (1 dakika)`)
            .addField('Kullanım:', '`!sustur [@Üye/ID] [Süre] [Sebep]`')
            .addField('Örnek:', '`!sustur @Elemmírë 1h Spam`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    if (taggedUser && (taggedUser.id === auth.servers[serverID].ownerID || message.mentions.has(auth.servers[serverID].ownerID))) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bot sahibine mute atamazsınız.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    const duration = parseInt(timeMatch[1]);
    const unit = timeMatch[2];
    let muteDuration;

    if (unit === 'h') {
        muteDuration = duration * 60 * 60 * 1000;
        muteTimeString = `${duration} saat`;
    } else if (unit === 'm') {
        muteDuration = duration * 60 * 1000;
        muteTimeString = `${duration} dakika`;
    }

    if (!muteReason) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Mute işlemine bir açıklama eklemelisiniz.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    const role = message.guild.roles.cache.find(role => role.name === auth.servers[serverID].serverMutedRole);

    if (!role) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Mute rolü bulunamadı. @${auth.servers[serverID].serverMutedRole}] adında bir rol oluşturmanız gerekiyor.`);
        message.react(`${emojis.crossMark}`);
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
        const muteEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${taggedUser} adlı kullanıcı ${muteTimeString} boyunca susturuldu. Sebep: ${muteReason}`);
        message.react(`${emojis.mutedOn}`);
        await taggedUser.roles.add(role);
        mutedChannel.send(muteEmbed);

        setTimeout(() => {
            taggedUser.roles.remove(role);
            const unmuteEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${taggedUser} adlı kullanıcının mute süresi doldu.`);
            message.react(`${emojis.mutedOFF}`);
            mutedChannel.send(unmuteEmbed)
        }, muteDuration);
    } catch (error) {
        console.error('Mute işlemi sırasında bir hata oluştu:', error);
        const unmuteEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Mute işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(unmuteEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};
module.exports.config = {
    name: 'Sustur',
    description: 'Belirli bir kullanıcıya mute atar',
    usage: '!sustur [@Üye/ID] [Süre] [Sebep]',
    aliases: ['sustur'],
    category: 'yetkili'
};
