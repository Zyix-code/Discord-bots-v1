const Discord = require('discord.js');
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
        if (!args[0]) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
                .addField('Kullanım:', '`!ascii [Yazı]`')
                .addField('Örnek:', '`!ascii [Test]`')
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        const text = args.join(' ');

        const asciiText = generateAsciiArt(text);
        if (asciiText) {
            const embed = new Discord.MessageEmbed()
                .setDescription('```' + asciiText + '```')
                .setColor('RANDOM');
            message.channel.send(embed);
        } else {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Metin dönüştürülürken bir hata oluştu.`)
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
    } catch (error) {
        console.error(error);
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bir hata oluştu.`);
        message.channel.send(errorEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};

function generateAsciiArt(text) {
    return text.split('').map(char => char + '').join('');
}

module.exports.config = {
    name: 'ASCII',
    description: 'Metni ASCII sanatına dönüştürür.',
    usage: '!ascii <metin>',
    aliases: ['ascii'],
    category: 'eğlence'
};
