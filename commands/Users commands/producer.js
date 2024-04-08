const Discord = require('discord.js');
const emojis = require('../../data/emojisData.json');
const auth = require("../../data/permissionsData.json");
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
    const botInfo = {
        yapıldı: new Date("2020-07-05"),
        yapımcı: ".Zyix#0",
    };
    if (args.length > 0) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
            .addField('Kullanım:', '`!yapımcı`')
            .addField('Örnek:', '`!yapımcı`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Bot Bilgileri')
        .addField('Yapım Tarihi', `\`${botInfo.yapıldı.toLocaleDateString('tr-TR')}\``, true)
        .addField('Yapımcı', `${emojis.king} **${botInfo.yapımcı}**`, true)
        .addField('Çalışma Süresi', `\`${getUptime(client.uptime)}\``)
        .addField('Sunucu Sayısı', `\`${client.guilds.cache.size}\``, true)
        .addField('Kullanıcılar', `\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\``, true)
        .addField('Kanallar', `\`${client.channels.cache.size.toLocaleString()}\``, true)
        .addField('Bot Sürümü', `\`1.0.0\``, true)
        .addField('Discord.JS sürüm', `\`v${Discord.version}\``, true)
        .addField('Node.JS sürüm', `\`${process.version}\``, true)
        .addField('Ping', `\`${client.ws.ping} ms\``)
        .addField('Destek Sunucusu', 'https://discord.gg/3p4GAVvSU3')
        .setFooter('Yapımcı & Bot Bilgileri', client.user.displayAvatarURL())
        .setTimestamp()
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setThumbnail(client.user.displayAvatarURL())
    // .setURL('https://www.example.com'); // Eğer bir URL verecek olursanız, buraya o URL'yi ekleyin
    message.channel.send(embed);
};
function getUptime(uptime) {
    const totalSeconds = Math.floor(uptime / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days} gün, ${hours} saat, ${minutes} dakika, ${seconds} saniye`;
}
module.exports.config = {
    name: "Yapımcı",
    aliases: ["yapımcı"],
    description: "Yapımcı ve bot ile alakalı bilgileri gösterir.",
    usage: "!yapımcı",
    category: 'yapımcı'
};
