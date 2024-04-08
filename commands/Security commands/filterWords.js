const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const auth = require("../../data/permissionsData.json");
const emojis = require('../../data/emojisData.json');
const filterWordsFilePath = path.join(__dirname, '../../data/securityData.json');
const filterWordsData = JSON.parse(fs.readFileSync(filterWordsFilePath, 'utf8'));

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
            .addField('Kullanım:', '`!küfür-engel [aç-kapat]`')
            .addField('Örnek:', '`!küfür-engel [aç-kapat]`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    if (args[0] === 'aç') {
        if (!filterWordsData.servers[serverID]) {
            filterWordsData.servers[serverID] = {
                filterWordsControl: true
            };
            fs.writeFileSync(filterWordsFilePath, JSON.stringify(filterWordsData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Küfür engelleyici başarıyla açıldı! Artık küfür etmeye çalışanlar engellenecektir.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else if (filterWordsData.servers[serverID].filterWordsControl) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Küfür engelleme sistemi zaten aktif.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else {
            filterWordsData.servers[serverID].filterWordsControl = true;
            fs.writeFileSync(filterWordsFilePath, JSON.stringify(filterWordsData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Küfür engelleyici başarıyla açıldı! Artık küfür etmeye çalışanlar engellenecektir.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
    } else if (args[0] === 'kapat') {
        if (!filterWordsData.servers[serverID]) {
            filterWordsData.servers[serverID] = {
                filterWordsControl: false
            };
            fs.writeFileSync(filterWordsFilePath, JSON.stringify(filterWordsData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Küfür engelleyici başarıyla kapatıldı! Artık herkes küfür edebilir.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else if (!filterWordsData.servers[serverID].filterWordsControl) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Küfür engelleme sistemi zaten kapalı.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
        else {
            filterWordsData.servers[serverID].filterWordsControl = false;
            fs.writeFileSync(filterWordsFilePath, JSON.stringify(filterWordsData), 'utf8');
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Küfür engelleyici başarıyla kapatıldı! Artık herkes küfür edebilir.`);
            message.react(`${emojis.checkMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
        }
    } else {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
            .addField('Kullanım:', '`!küfür-engel [aç-kapat]`')
            .addField('Örnek:', '`!küfür-engel [aç-kapat]`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};

module.exports.config = {
    name: 'Küfür Engelle',
    description: 'Sunucuda bulunan kullanıcıların küfür etmesini engeller.',
    usage: '!küfür-engel [aç-kapat]',
    aliases: ['küfür-engel'],
    category: 'güvenlik'
};