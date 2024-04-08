const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const emojis = require('../../data/emojisData.json');
const auth = require('../../data/permissionsData.json');
const gameControlFilePath = path.join(__dirname, '../../data/gameData.json');

function updateTypingGameControl(gameControlData, serverID, typingGameControl) {
    gameControlData.servers[serverID].typingGameControl = typingGameControl;
    fs.writeFileSync(gameControlFilePath, JSON.stringify(gameControlData), 'utf8');
}

const gameControlData = JSON.parse(fs.readFileSync(gameControlFilePath, 'utf8'));
module.exports.run = async (client, message, args) => {
    const serverID = message.guild.id;
    try {
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
        if (!gameControlData.servers[serverID]) {
            gameControlData.servers[serverID] = {
                typingGameControl: false
            };
            fs.writeFileSync(gameControlFilePath, JSON.stringify(gameControlData), 'utf8');
        }
        let typingGameControl = gameControlData.servers[serverID].typingGameControl;
        if (typingGameControl) {
            const gameAlreadyStartedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Yazan kazanır oyunu zaten başlamış durumda. Diğer oyuncuların oyunu bitirmesini bekleyiniz.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(gameAlreadyStartedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        if (!args[0]) {
            const invaildUserEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Yazan kazanır oyununu başlatmak için bir kişiyi etiketleyiniz.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(invaildUserEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }

        if (message.mentions.members.size > 1) {
            const invaildUserEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Birden fazla kişiyi etiketleyemezsiniz.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(invaildUserEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        const mentionedMember = message.mentions.members.first();
        if (!mentionedMember) {
            const invaildUserEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Etiketlenen kişi bulunmadı.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(invaildUserEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        if (mentionedMember.user.id === message.author.id) {
            const invaildUserEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Sadece kendiniz dışında bir kişiyle oynayabilirsiniz.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(invaildUserEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        const invaildUserEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${mentionedMember}, sana bir yazan kazanır daveti yollandı.\nKabul etmek istiyorsan aşağıdaki 🟢 tepkisine tıkla.\nReddetmek için aşağıdaki 🔴 tepkisine tıkla.`);
        const inviteMessage = await message.channel.send(invaildUserEmbed);
        await inviteMessage.react(emojis.greenButton);
        await inviteMessage.react(emojis.redButton);

        const filter = (reaction, user) => user.id === mentionedMember.id;
        const collected = await inviteMessage.awaitReactions(filter, { max: 1, time: 5000 });
        if (collected.size === 0) {
            updateTypingGameControl(gameControlData, serverID, false);
            const invaildUserEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${mentionedMember} Yazan kazanır kabul edilmedi. Karşı taraf belirtilen süre içinde tepki vermediği için oyunu başlatamadık.`);
            message.react(`${emojis.crossMark}`);
            inviteMessage.delete().catch(console.error);
            return message.channel.send(invaildUserEmbed).catch(console.error);
        }
        const reaction = collected.first();
        if (reaction.emoji.name === emojis.redButton) {
            inviteMessage.delete();
            updateTypingGameControl(gameControlData, serverID, false);
            const invaildUserEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Yazan kazanır kabul edilmedi.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(invaildUserEmbed);
        }

        inviteMessage.delete();
        const typingADD = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Kelime hazırlanıyor lütfen bekleyin ${mentionedMember}, ${message.author}`);
        const preparationMessage = await message.channel.send(typingADD);
        updateTypingGameControl(gameControlData, serverID, true);
        setTimeout(async () => {
            const kelimelerFilePath = path.join(__dirname, '../../data/turkish-words.txt');
            const kelimeler = loadWordsFromFile(kelimelerFilePath);

            const kelime = random(kelimeler);

            const mf = response => {
                return response.content.toLowerCase() === kelime.toLowerCase();
            };
            const typingADD = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${mentionedMember} ${message.author}, kelimeniz: **${kelime}**`);
            const typingADDMessage = await message.channel.send(typingADD);
            const answers = await message.channel.awaitMessages(mf, { max: 1, time: 60000, errors: ['time'] });

            if (answers.size > 0) {
                const winningUser = answers.first().author;
                const winnerUserEmbed = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`${winningUser} doğru cevabı verdi!`);
                const winnerUserMessage = await message.channel.send(winnerUserEmbed);
                setTimeout(() => {
                    winnerUserMessage.delete().catch(console.error);
                    typingADDMessage.delete().catch(console.error);
                }, 5000);
                updateTypingGameControl(gameControlData, serverID, false);
            } else {
                const notWinnerEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${mentionedMember}, ${message.author} Sanırım kimse kazanamadı.`);
                const notWinnerMessage = await message.channel.send(notWinnerEmbed);
                setTimeout(() => {
                    notWinnerMessage.delete().catch(console.error);
                }, 5000);
            }
            updateTypingGameControl(gameControlData, serverID, false);
            preparationMessage.delete();
        }, 3000);
    } catch (error) {
        console.error(error);
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bir hata oluştu.`);
        message.react(`${emojis.crossMark}`);
        updateTypingGameControl(gameControlData, serverID, false);
        return message.channel.send(errorEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};

module.exports.config = {
    name: 'Yazan Kazanır',
    description: 'Etiketlediğiniz bir kişi ile botun belirlediği kelimeyi ilk yazan kazanır.',
    usage: '!yazan-kazanır [@Üye]',
    aliases: ['yazan-kazanır'],
    category: 'eğlence'
};

function loadWordsFromFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const words = fileContent.split('\n').map(word => word.trim());
        return words.filter(word => word !== '');
    } catch (error) {
        console.error(error);
        return [];
    }
};

function random(map) {
    if (!map) return;
    return map[Math.floor(Math.random() * map.length)];
};

