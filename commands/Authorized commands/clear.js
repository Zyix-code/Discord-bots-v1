const Discord = require('discord.js')
const auth = require('../../data/permissionsData.json');
exports.run = (client, message, args) => {
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
        let miktar = args[0]
        if (miktar > 100) {
            const miktar = new Discord.MessageEmbed()
                .setDescription(`${message.author} En Fazla \`100\` Mesaj Silebilirim.`)
                .setColor('RED')
            return message.channel.send(miktar).then(cmf => {
                cmf.delete({ timeout: 5000 })
            })
        }
        if (!miktar) {
            const inputmiktar = new Discord.MessageEmbed()
                .setDescription(`${message.author} Silinecek Mesaj Sayısını Gir.`)
                .setColor('RED')
            return message.channel.send(inputmiktar).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        if (isNaN(miktar)) {
            const nanmiktar = new Discord.MessageEmbed()
                .setDescription(`${message.author} Harf değil sayı giriniz.`)
                .setColor('RED')
            return message.channel.send(nanmiktar).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        if (miktar) {
            message.channel.bulkDelete(miktar)
            const succesdelete = new Discord.MessageEmbed()
                .setDescription(`${message.author} Başarıyla ${miktar} Adet Mesaj Sildim.`)
                .setColor('GREEN')
            return message.channel.send(succesdelete).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
    }
    catch (error) {
        if (error.message.includes("under 14 days old")) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Silmek istediğiniz mesajların bazıları sanırım eski? 14 gün öncesini silemem.`);
            return message.channel.send(errorEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        } else {
            console.error(error);
            const errorEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Bir hata oluştu.`);
            return message.channel.send(errorEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
    }
};
module.exports.config = {
    name: 'Sil',
    description: 'Girilen adet kadar mesaj siler.',
    usage: '!Sil [1-100]',
    aliases: ['sil'],
    category: 'yetkili'
};