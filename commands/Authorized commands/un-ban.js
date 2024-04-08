const Discord = require('discord.js');
const auth = require("../../data/permissionsData.json");
const emojis = require('../../data/emojisData.json');
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
    const userTag = args[0];
    const userID = userTag?.replace(/[<@!>]/g, '');

    const bans = await message.guild.fetchBans();
    const bannedUser = bans.get(userID) || bans.find(banned => banned.user.tag === userTag);

    if (!message.mentions.users.size && !args[0]) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
            .addField('Kullanım:', '`!yasak-kaldır [@Üye/ID]`')
            .addField('Örnek:', '`!yasak-kaldır @Elemmírë`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    if (!bannedUser) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Belirtilen kullanıcı zaten yasaklanmamış.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    message.guild.members.unban(bannedUser.user)
        .then(() => {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${message.author} Kullanıcının yasağı kaldırıldı: ${bannedUser.user.tag}`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed);
        })
        .catch(error => {
            console.error('Yasak kaldırma işlemi sırasında bir hata oluştu:', error);
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Yasak kaldırma işlemi sırasında bir hata oluştu`);
            mmessage.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        });
};
module.exports.config = {
    name: 'Unban',
    description: 'Kullanıcının yasağını kaldırır.',
    usage: '!yasak-kaldır [@Üye/ID] ',
    aliases: ['yasak-kaldır'],
    category: 'yetkili'
};
