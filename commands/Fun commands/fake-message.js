const Discord = require('discord.js');
const fs = require('fs');
const { MessageAttachment } = require('discord.js');
const emojis = require('../../data/emojisData.json');
const auth = require("../../data/permissionsData.json");
module.exports.run = async (client, message, args) => {
    try {
        const serverID = message.guild.id;
        if (!auth.servers[serverID]) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Bu komudu kullanabilmek için ilk önce **serverID** tanımlamanız gerekiyor.\nBot sahibi ile iletişime geçiniz.`)
                .addField(`${emojis.king}`, `**.Zyix#0**`)
                .addField('Destek Sunucusu', 'https://discord.gg/3p4GAVvSU3');
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        if (
            !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverMaleMemberRole) &&
            !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverFemaleMemberRole) &&
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
        if (args.length < 2) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
                .addField('Kullanım:', '`!fake-mesaj [Kullanıcı Adı] [Mesaj]`')
                .addField('Örnek:', '`!fake-mesaj [Zyix] [Selamlar]`')
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        const username = args.shift();
        const messageContent = args.join(" ");
        const avatarFolder = './Bot GİF/';
        const avatarFiles = fs.readdirSync(avatarFolder).filter(file => file.endsWith('.png'));

        if (avatarFiles.length === 0) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Gönderilecek bir kullanıcı resmi bulunamadı.`)
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        const randomAvatar = avatarFiles[Math.floor(Math.random() * avatarFiles.length)];
        const avatarFilePath = `${avatarFolder}${randomAvatar}`;
        if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
            return;
        }
        message.delete();
        const embed = new Discord.MessageEmbed()
            .setAuthor(username, `attachment://${randomAvatar}`)
            .setDescription(messageContent)
            .setColor('RANDOM')
            .setTimestamp();
        const attachment = new MessageAttachment(avatarFilePath, randomAvatar);
        embed.attachFiles(attachment);
        message.channel.send(embed);
    } catch (error) {
        console.error(error);
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bir hata oluştu.`);
        return message.channel.send(errorEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};

module.exports.config = {
    name: 'Sahte Mesaj',
    description: 'Girilen kullanıcı adı ve mesaj ile sahte mesaj gönderir.',
    usage: '!sahte-mesaj <kullanıcı adı> <mesaj>',
    aliases: ['sahte-mesaj'],
    category: 'eğlence'
};
