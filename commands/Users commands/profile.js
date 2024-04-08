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

    const targetUser = message.mentions.users.first();
    if (targetUser) {
        const userAvatar = targetUser.displayAvatarURL({ dynamic: true, size: 128 });

        const profileEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Profil')
            .setDescription(`Kullanıcı: ${targetUser}`)
            .setThumbnail(userAvatar)
            .addField('Sunucuya Katılma Tarihi', message.guild.member(targetUser).joinedAt.toLocaleString('tr-TR'))
            .addField('Hesap Oluşturma Tarihi', targetUser.createdAt.toLocaleString('tr-TR'));
        return message.channel.send(profileEmbed);
    }

    const userID = args[0];
    if (userID) {
        try {
            const fetchedUser = await client.users.fetch(userID);
            const userAvatar = fetchedUser.displayAvatarURL({ dynamic: true, size: 128 });
            const profileEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Profil')
                .setDescription(`Kullanıcı: ${fetchedUser}`)
                .setThumbnail(userAvatar)
                .addField('Sunucuya Katılma Tarihi', message.guild.member(fetchedUser).joinedAt.toLocaleString('tr-TR'))
                .addField('Hesap Oluşturma Tarihi', fetchedUser.createdAt.toLocaleString('tr-TR'));
            return message.channel.send(profileEmbed);
        } catch (error) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Geçersiz kullanıcı etiketlendi veya belirtilen kullanıcı IDsi bulunamadı.`)
                .addField('Kullanım:', '`!profil [@Üye/ID]`')
                .addField('Örnek:', '`!profil [@Elemmírë/ID]`')
            message.react(`${emojis.crossMark}`)
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
    }

    const userAvatar = message.author.displayAvatarURL({ dynamic: true, size: 128 });

    const profileEmbed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Profil')
        .setDescription(`Kullanıcı: ${message.author}`)
        .setThumbnail(userAvatar)
        .addField('Sunucuya Katılma Tarihi', message.member.joinedAt.toLocaleString('tr-TR'))
        .addField('Hesap Oluşturma Tarihi', message.author.createdAt.toLocaleString('tr-TR'));
    message.channel.send(profileEmbed);
};

module.exports.config = {
    name: 'Profil',
    description: 'Kullanıcının profil bilgilerini gösterir.',
    aliases: ['profil'],
    usage: '!profil',
    category: 'kullanıcı'
};