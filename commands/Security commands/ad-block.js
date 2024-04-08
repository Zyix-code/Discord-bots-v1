const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const auth = require("../../data/permissionsData.json");
const emojis = require('../../data/emojisData.json');
const adBlockFilePath = path.join(__dirname, '../../data/securityData.json');
const adBlockData = JSON.parse(fs.readFileSync(adBlockFilePath, 'utf8'));

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
            .addField('Kullanım:', '`!reklam-engel [aç-kapat]`')
            .addField('Örnek:', '`!reklam-engel [aç-kapat]`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    if (args[0] === 'aç') {
        if (!adBlockData.servers[serverID]) {
            adBlockData.servers[serverID] = {
                adBlockControl: true
            };
            fs.writeFileSync(adBlockFilePath, JSON.stringify(adBlockData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Reklam engelleyici başarıyla açıldı! Artık reklam yapmaya çalışanlar engellenecektir.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else if (adBlockData.servers[serverID].adBlockControl) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Reklam engelleme sistemi zaten aktif.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else {
            adBlockData.servers[serverID].adBlockControl = true;
            fs.writeFileSync(adBlockFilePath, JSON.stringify(adBlockData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Reklam engelleyici başarıyla açıldı! Artık reklam yapmaya çalışanlar engellenecektir.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
    } else if (args[0] === 'kapat') {
        if (!adBlockData.servers[serverID]) {
            adBlockData.servers[serverID] = {
                adBlockControl: false
            };
            fs.writeFileSync(adBlockFilePath, JSON.stringify(adBlockData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Reklam engelleyici başarıyla kapatıldı! Artık herkes reklam yapabilir.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else if (!adBlockData.servers[serverID].adBlockControl) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Reklam engelleme sistemi zaten kapalı.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else {
            adBlockData.servers[serverID].adBlockControl = false;
            fs.writeFileSync(adBlockFilePath, JSON.stringify(adBlockData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Reklam engelleyici başarıyla kapatıldı! Artık herkes reklam yapabilir.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
    } else {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
            .addField('Kullanım:', '`!reklam-engel [aç-kapat]`')
            .addField('Örnek:', '`!reklam-engel [aç-kapat]`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};

module.exports.config = {
    name: 'Reklam Engelle',
    description: 'Sunucuda bulunan kullanıcıların reklam yapmasını engeller.',
    usage: '!reklam-engel [aç-kapat]',
    aliases: ['reklam-engel'],
    category: 'güvenlik'
};