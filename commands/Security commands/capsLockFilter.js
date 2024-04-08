const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const auth = require("../../data/permissionsData.json");
const emojis = require('../../data/emojisData.json');
const capsLockFilePath = path.join(__dirname, '../../data/securityData.json');
const capsLockData = JSON.parse(fs.readFileSync(capsLockFilePath, 'utf8'));

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

    if (!args[0]) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
            .addField('Kullanım:', '`!caps-lock [aç-kapat]`')
            .addField('Örnek:', '`!caps-lock [aç-kapat]`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    if (args[0] === 'aç') {
        if (!capsLockData.servers[serverID]) {
            capsLockData.servers[serverID] = {
                capsLockControl: true
            };
            fs.writeFileSync(capsLockFilePath, JSON.stringify(capsLockData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Caps-Lock engelleyici başarıyla açıldı! Artık büyük yazı yazmaya çalışanlar engellenecektir.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else if (capsLockData.servers[serverID].capsLockControl) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Caps-Lock engelleme sistemi zaten aktif.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else {
            capsLockData.servers[serverID].capsLockControl = true;
            fs.writeFileSync(capsLockFilePath, JSON.stringify(capsLockData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Caps-Lock engelleyici başarıyla açıldı! Artık büyük yazı yazmaya çalışanlar engellenecektir.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
    } else if (args[0] === 'kapat') {
        if (!capsLockData.servers[serverID]) {
            capsLockData.servers[serverID] = {
                capsLockControl: false
            };
            fs.writeFileSync(capsLockFilePath, JSON.stringify(capsLockData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Caps-Lock engelleyici başarıyla kapatıldı! Artık herkes BÜYÜK YAZABİLİR.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else if (!capsLockData.servers[serverID].capsLockControl) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Caps-Lock engelleme sistemi zaten kapalı.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else {
            capsLockData.servers[serverID].capsLockControl = false;
            fs.writeFileSync(capsLockFilePath, JSON.stringify(capsLockData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Caps-Lock engelleyici başarıyla kapatıldı! Artık herkes BÜYÜK YAZABİLİR.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
    } else {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
            .addField('Kullanım:', '`!caps-lock [aç-kapat]`')
            .addField('Örnek:', '`!caps-lock [aç-kapat]`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};

module.exports.config = {
    name: 'Caps-Lock Engelle',
    description: 'Sunucuda bulunan kullanıcıların Caps-Lock etmesini engeller.',
    usage: '!caps-lock [aç-kapat]',
    aliases: ['caps-lock'],
    category: 'güvenlik'
};