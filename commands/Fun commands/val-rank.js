const Discord = require('discord.js');
const fs = require('fs');
const emojis = require('../../data/emojisData.json'); // Değişken ismi değiştirildi
const auth = require("../../data/permissionsData.json");
const settings = require("../../config/settings.json")

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
        const rankEmojis = {
            "valdemir": `${emojis.valdemir}`,
            "valbronz": `${emojis.valbronz}`,
            "valgümüş": `${emojis.valgümüş}`,
            "valaltın": `${emojis.valaltın}`,
            "valplatin": `${emojis.valplatin}`,
            "valelmas": `${emojis.valelmas}`,
            "valyücelik": `${emojis.valyücelik}`,
            "valölümsüzlük": `${emojis.valölümsüzlük}`,
            "valradyant": `${emojis.valradyant}`,
        };
        if (message.content.toLowerCase() === `${settings.prefix}valorant-rank}`) {
            const ranks = [
                "Demir",
                "Bronz",
                "Gümüş",
                "Altın",
                "Platin",
                "Elmas",
                "Yücelik",
                "Ölümsüzlük",
                "Radyant"
            ];
            const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
            const emojiName = `val${randomRank.toLowerCase()}`;

            const emoji = rankEmojis[emojiName];

            if (emoji) {
                const accessDeniedEmbed = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`${message.author} Senin rankın büyük ihtimalle ${emoji} **${randomRank}** seviyesindedir.`);
                message.react(`${emojis.checkMark}`);
                return message.channel.send(accessDeniedEmbed);
            } else {
                console.log(`"${emojiName}" adında bir emoji bulunamadı.`);
                const accessDeniedEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${message.author} Senin rankını tahmin edemedik be gardaş.`);
                message.react(`${emojis.crossMark}`);
                return message.channel.send(accessDeniedEmbed);
            }
        }
    }
    catch (error) {
        console.error(error);
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bir hata oluştu.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(errorEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};

module.exports.config = {
    name: 'Valorant Rank',
    description: 'Valorant rankını tahmin eder.',
    usage: '!valorant-rank',
    aliases: ['valorant-rank'],
    category: 'eğlence'
};
