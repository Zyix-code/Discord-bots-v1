const Discord = require('discord.js');
const fetch = require('node-fetch'); // node-fetch modülü dahil edildi
const emojis = require('../../data/emojisData.json'); // Değişken ismi değiştirildi
const auth = require("../../data/permissionsData.json");
const settings = require("../../config/settings.json");
module.exports.run = async (client, message, args) => {
    try {
        const prefix = settings.prefix;
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
        let args = message.content.substring(prefix.length).split(/\s+/);
        if (message.content.startsWith(`${prefix}changemymind`)) {
            let text = args.slice(1).join(" ");
            if (!text) {
                const accessDeniedEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
                    .addField('Kullanım:', '`!changemymind [Yazı]`')
                    .addField('Örnek:', '`!changemymind [Test]`')
                message.react(`${emojis.crossMark}`);
                return message.channel.send(accessDeniedEmbed).then(cmf => {
                    cmf.delete({ timeout: 5000 })
                });
            }
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${message.author} Resim hazırlanıyor lütfen bekleyiniz...`);
            message.react(`${emojis.checkMark}`);
            message.channel.send(accessDeniedEmbed).then(loading => {
                fetch(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`)
                    .then(res => res.json())
                    .then(data => {
                        loading.delete();

                        let embed = new Discord.MessageEmbed()
                            .setImage(data.message)
                            .setURL(data.message);
                        message.channel.send(embed);
                    })
                    .catch(error => {
                        console.error(error);
                        const errorEmbed = new Discord.MessageEmbed()
                            .setColor('RED')
                            .setDescription(`${message.author} Bir hata oluştu.`);
                        message.channel.send(errorEmbed).then(cmf => {
                            cmf.delete({ timeout: 5000 })
                        });
                    });
            });
        }
    } catch (error) {
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
    name: 'Change My Mind',
    description: 'Yazdığınız yazıyı tabelaya yazar.',
    usage: '!changemymind [Yazı]',
    aliases: ['changemymind'],
    category: 'eğlence'
};
