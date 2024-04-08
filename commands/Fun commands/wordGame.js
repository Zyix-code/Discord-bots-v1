const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const emojis = require('../../data/emojisData.json');
const auth = require("../../data/permissionsData.json");
const settings = require("../../config/settings.json");
const gameControlFilePath = path.join(__dirname, '../../data/gameData.json');
const gameControlData = JSON.parse(fs.readFileSync(gameControlFilePath, 'utf8'));

function getRandomWord(wordsList) {
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    return wordsList[randomIndex];
}
function getWordsList() {
    const filePath = path.join(__dirname, '../../data/turkish-words.txt');
    return fs.readFileSync(filePath, 'utf-8').split('\n').map(word => word.trim());
}
function updatePoints(gameControlData, serverID, userID, pointsToAdd) {
    if (!gameControlData.servers[serverID]) {
        gameControlData.servers[serverID] = {
            wordGameControl: false,
            wordGameChannelControl: "default-wordgame-channel",
            userPoints: {}
        };
    }
    if (!gameControlData.servers[serverID].userPoints[userID]) {
        gameControlData.servers[serverID].userPoints[userID] = 0;
    }

    gameControlData.servers[serverID].userPoints[userID] += pointsToAdd;
    fs.writeFileSync(gameControlFilePath, JSON.stringify(gameControlData), 'utf8');
}
function updateWordGameControl(gameControlData, serverID, wordGameControl, wordGameChannel) {
    gameControlData.servers[serverID].wordGameControl = wordGameControl;
    gameControlData.servers[serverID].wordGameChannelControl = wordGameChannel;
    fs.writeFileSync(gameControlFilePath, JSON.stringify(gameControlData), 'utf8');
}
module.exports.run = async (client, message, args) => {
    const userID = message.author.id;
    const serverID = message.guild.id;
    if (!auth.servers[serverID]) {
        message.react(`${emojis.crossMark}`)
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bu komudu kullanabilmek için ilk öncellikle **serverID** tanımlaması gerekiyor.\nBot sahibi ile iletişime geçiniz.`)
            .addField(`${emojis.king} Yapımcı`, `**.Zyix#0**`)
            .addField('Destek Sunucusu', 'https://discord.gg/3p4GAVvSU3');
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
        message.react(`${emojis.crossMark}`)
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bu komutu kullanabilmek için yetkiniz bulunmamaktadır.`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    const userMessage = message.content.toLowerCase();
    if (!gameControlData.servers[serverID]) {
        gameControlData.servers[serverID] = {
            wordGameControl: false,
            wordGameChannelControl: "default-wordgame-channel",
            userPoints: {}
        };
        fs.writeFileSync(gameControlFilePath, JSON.stringify(gameControlData), 'utf8');
    }
    const channelNameOrID = userMessage.split(' ')[1];
    const channel = message.guild.channels.cache.find(c => c.name === channelNameOrID || c.id === channelNameOrID);
    if (!channel) {
        message.react(`${emojis.crossMark}`)
        const invalidChannelEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('Belirtilen kanal bulunamadı. Lütfen geçerli bir kanal adı veya IDsi girin.');
        return message.channel.send(invalidChannelEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    if (message.channel.id !== channel.id) {
        message.react(`${emojis.crossMark}`)
        const wrongChannelEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('Bu komut sadece bulunduğunuz kanalda kullanılabilir.');
        return message.channel.send(wrongChannelEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    let wordGameControl = gameControlData.servers[serverID].wordGameControl;
    if (wordGameControl) {
        message.react(`${emojis.crossMark}`)
        const gameAlreadyStartedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`Kelime türetmece oyunu zaten ${gameControlData.servers[serverID].wordGameChannelControl} kanalında başlamış durumda. Oyunu sadece bir kez başlatabilirsiniz.`);
        return message.channel.send(gameAlreadyStartedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    let words = [];
    let currentWord = getRandomWord(getWordsList());
    let previousWord = currentWord.toLowerCase();

    function isTurkishWord(word) {
        const lowercaseWord = word.toLowerCase();
        return getWordsList().includes(lowercaseWord);
    }
    const promptEmbed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setAuthor('Kelime Türetmece Oyunu!')
        .setDescription(`Kelime Türetmece başladı!  
        Başlangıç kelimesi: **\`${currentWord}\`**
        Doğru kelimeler "${emojis.checkMark}" tepkisi alacaktır.
        Yanlış kelimeler "${emojis.crossMark}" tepkisi alacaktır.
        Yazdığın her doğru kelime için 1 puan kazanırsın.
        Oyunun yeni bir kelime atamaya zorlayabilirsen 10 puan kazanırsın!
        İstatistik durumunu görmek için \`!kelime-türetmece-puan\` yazmalısın.`)
        .setTimestamp();
    await message.channel.send(promptEmbed);
    updateWordGameControl(gameControlData, serverID, wordGameControl, true);
    updateWordGameControl(gameControlData, serverID, true, message.channel.name);
    const collectorFilter = response => !response.author.bot && (!response.content.startsWith(settings.prefix) || response.content.toLowerCase() === `${settings.prefix}kelime-türetmece-bitir`);
    const collector = message.channel.createMessageCollector(collectorFilter, { time: null });

    collector.on('collect', async collected => {
        const responseContent = collected.content.toLowerCase();
        if (
            !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverOwnerRole) &&
            !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverAuthoritativeRole) &&
            !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverAdminRole) &&
            !message.member.roles.cache.some(role => role.name === auth.servers[serverID].serverFemaleAuthoritativeRole) &&
            message.author.id !== auth.servers[serverID].ownerID
        ) {
            await insufficientPermissionsResponse(message);
        } else if (responseContent === '!kelime-türetmece-bitir') {
            const endEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription('Oyunu sonlandırdınız.');
            await message.channel.send(endEmbed);
            collected.react(`${emojis.checkMark}`);
            updateWordGameControl(gameControlData, serverID, wordGameControl, false);
            updateWordGameControl(gameControlData, serverID, true, "default-wordgame-channel");
            collector.stop();
        } else {

            if (!isTurkishWord(responseContent)) {
                const invalidWordEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('Geçersiz kelime! Lütfen sadece Türkçe kelimeler kullanın.');
                const invalidWordMessage = await message.channel.send(invalidWordEmbed);
                setTimeout(() => {
                    invalidWordMessage.delete();
                }, 5000);
                collected.react(`${emojis.crossMark}`);
                updatePoints(gameControlData, serverID, userID, -1);
            } else if (responseContent.length < 1) {
                const invalidWordEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('Geçersiz kelime! Lütfen geçerli bir kelime yazın.');
                const invalidWordMessage = await message.channel.send(invalidWordEmbed);
                setTimeout(() => {
                    invalidWordMessage.delete();
                }, 5000);
                collected.react(`${emojis.crossMark}`);
                updatePoints(gameControlData, serverID, userID, -1);
            } else if (words.includes(responseContent)) {
                const duplicateWordEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('Bu kelimeyi tekrar giremezsiniz. Lütfen başka bir kelime yazın.');
                const duplicateWordMessage = await message.channel.send(duplicateWordEmbed);
                setTimeout(() => {
                    duplicateWordMessage.delete();
                }, 5000);
                collected.react(`${emojis.crossMark}`);
                updatePoints(gameControlData, serverID, userID, -1);
            } else if (responseContent.charAt(0) !== previousWord.charAt(previousWord.length - 1)) {
                const invalidStartEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`Yanlış kelime! Lütfen önceki kelimenin son harfi "\`${previousWord.charAt(previousWord.length - 1)}\`" ile başlayan bir kelime yazın.`);
                const invalidStartMessage = await message.channel.send(invalidStartEmbed);
                setTimeout(() => {
                    invalidStartMessage.delete();
                }, 5000);
                collected.react(`${emojis.crossMark}`);
                updatePoints(gameControlData, serverID, userID, -1);
            } else {
                currentWord = responseContent;
                previousWord = currentWord.toLowerCase();
                words.push(currentWord);
                collected.react(`${emojis.checkMark}`);
                updatePoints(gameControlData, serverID, userID, 1);
                const previousWordLastChar = previousWord.charAt(previousWord.length - 1);
                const missingLetters = ['ç', 'ğ', 'ı', 'ö', 'ü'];
                if (missingLetters.includes(previousWordLastChar)) {
                    let validWordFound = false;

                    while (!validWordFound) {
                        const newWord = getRandomWord(getWordsList());

                        if (missingLetters.includes(newWord.charAt(0))) {
                            continue;
                        }
                        currentWord = newWord;
                        previousWord = currentWord.toLowerCase();
                        words.push(currentWord);
                        validWordFound = true;
                    }
                    const missingLetterInfoEmbed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`Önceki kelimenin son harfi **\`${previousWordLastChar}\`**. Maalesef, bu harfle başlayan Türkçe bir kelime bulunmamaktadır.\nYeni kelime atandı: **${currentWord}**`);
                    await message.channel.send(missingLetterInfoEmbed);
                    updatePoints(gameControlData, serverID, userID, 10);
                }
            }
        }
    });
};
module.exports.config = {
    name: 'Kelime Türetmece',
    description: 'Belirlediğiniz kanalda kelime türetmece oyununu başlatır.',
    aliases: ['kelime-türetmece-baslat'],
    usage: '!kelime-türetmece-baslat [kanal-adi] - !kelime-türetmece-bitir',
    category: 'eğlence'
};
