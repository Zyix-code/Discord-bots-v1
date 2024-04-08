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
    const server = message.guild;
    const serverIcon = server.iconURL({ dynamic: true, size: 128 });
    const normalMembers = server.members.cache.filter(member => !member.user.bot);
    const botMembers = server.members.cache.filter(member => member.user.bot);
    const voiceChannels = server.channels.cache.filter(channel => channel.type === 'voice');
    const textChannels = server.channels.cache.filter(channel => channel.type === 'text');

    const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Sunucu Bilgileri')
        .setDescription(`Sunucu Adı: ${server.name}`)
        .setThumbnail(serverIcon)
        .addField('Sunucu ID', server.id, true)
        .addField('Sunucu Sahibi', server.owner.user, true)
        .addField('Üye Sayıları', `Toplam: ${server.memberCount} | Normal: ${normalMembers.size} | Bot: ${botMembers.size}`)
        .addField('Kanal Sayıları', `Ses Kanalı: ${voiceChannels.size} | Metin Kanalı: ${textChannels.size}`)
        .addField('Oluşturulma Tarihi', server.createdAt.toLocaleString('tr-TR'))
        .addField('Bölge', server.preferredLocale, true)
        .setTimestamp()
        .setFooter('Sunucu Bilgileri', serverIcon);

    message.channel.send(embed);
};
module.exports.config = {
    name: 'Sunucu Bilgi',
    description: 'Sunucu hakkında bilgi verir.',
    aliases: ['sunucu-bilgi'],
    usage: '!sunucu-bilgi',
    category: 'kullanıcı'
}
