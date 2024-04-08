const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const emojis = require('../../data/emojisData.json');
const auth = require("../../data/permissionsData.json");
const gameDataFilePath = path.join(__dirname, '../../data/gameData.json');
const gameData = JSON.parse(fs.readFileSync(gameDataFilePath, 'utf8'));

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
    if (message.channel.name != gameData.servers[serverID].wordGameChannelControl) {
        message.react(`${emojis.crossMark}`)
        const gameAlreadyStartedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`Kelime türetmece puan tablosunu sadece kelime türetmece oyununun başladığı kanalda kullanılabilir.
            kelime türetmece oyununun başladığı kanal: \`${gameData.servers[serverID].wordGameChannelControl}\`.`);
        return message.channel.send(gameAlreadyStartedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }


    if (!gameData.servers[serverID] || !gameData.servers[serverID].userPoints) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Sunucu verisi veya kullanıcı puanları bulunamadı.`);
        message.react(`${emojis.checkMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    const userPoints = gameData.servers[serverID].userPoints;
    const sortedUserScores = Object.keys(userPoints).map(userID => {
        return { userID, score: userPoints[userID] };
    }).sort((a, b) => b.score - a.score);
    if (sortedUserScores.length === 0) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Henüz kimse puan kazanamamış.`);
        message.react(`${emojis.checkMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    let leaderboardTable = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Kelime Türetmece İstatistik')
        .setDescription('Kelime türetmece oyununda kullanıcı puan tablosu:')
        .addField('Sıralama', `${sortedUserScores.map((userScore, index) => {
            const user = client.users.cache.get(userScore.userID);
            const username = user ? user.tag : 'Bilinmeyen Kullanıcı';
            let medal;
            if (index === 0) {
                medal = `${index + 1}. 👑`;
            } else if (index === 1) {
                medal = `${index + 1}. 🥈`;
            } else if (index === 2) {
                medal = `${index + 1}. 🥉`;
            } else {
                medal = `${index + 1}. ➖`;
            }
            return `${medal} ${user ? user.toString() : 'Bilinmeyen Kullanıcı'}  Puan: \`${userScore.score}\``;
        }).join('\n')}`, true)
        .setTimestamp();
    message.react(`${emojis.checkMark}`);
    return message.channel.send(leaderboardTable);
};

module.exports.config = {
    name: 'Kelime Türetmece Puan Tablosu',
    description: 'Kelime türetmece oyununda ki puan tablosunu gösterir.',
    aliases: ['kelime-türetmece-puan'],
    usage: '!kelime-türetmece-puan'
};
