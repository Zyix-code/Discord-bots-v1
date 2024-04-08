const Discord = require('discord.js');
const auth = require("../../data/permissionsData.json");
const channelSettings = require("../../data/channelsData.json")
const emojis = require('../../data/emojisData.json');
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
    if (!channelSettings.servers[serverID]) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bu komudu kullanabilmek için ilk önce **serverID** tanımlamanız gerekiyor.\nBot sahibi ile iletişime geçiniz.`)
            .addField(`${emojis.king} Yapımcı`, `**.Zyix#0**`)
            .addField('Destek Sunucusu', 'https://discord.gg/3p4GAVvSU3');
        message.react(`${emojis.crossMark}`);
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
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bu komutu kullanabilmek için yetkiniz bulunmamaktadır.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
    const rulesEmbed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Sunucu Kuralları')
        .setDescription('Discord sunucumuzun kuralları aşağıdaki gibidir:')
        .addField(`${emojis.prainbowarrowri} | Spam / flood yapmak yasaktır!`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Her türlü hile kullanımı / VAC yasaklamalı bir Steam profili Discord sunucumuzda yasaktır!`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Profilinizde gerçek isim ve yaş zorunludur. İsminizin başında sembol veya emoji yasaktır.`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Sohbet ederken söz kesmemeye, rahatsız edici sesler çıkartmamaya ve odalarda gereksiz mikrofon kullanmamaya özen gösteriniz`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Probleminiz olduğunda lütfen kendiniz müdahalede bulunmayınız. Derhal bir yetkiliye bildiriniz!`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Küfür, link paylaşımı, reklam (direkt mesaj/genel), büyük harflerle yazmak, ırkçılık, din, spam, flood, troll, siyaset ve 3. Şahıs hakkında konuşmak kesinlikle yasaktır.`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Sunucumuzda ticaret ve takas yasaktır!`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Sunucumuzda maddi istek yasaktır!`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Oyun odalarında, oyun oynayanları rahatsız etmek ve gereksiz yer işgal etmek yasaktır!`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Saygısızca, kavga çıkarıcı veya ortam gerici cümleler kurmak ve sözler söylemek yasaktır!`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Sunucumuzda bet/kasa siteleri muhabbeti yasaktır!`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Hiçbir yetkili sizden asla hesap, item, oyun, şifre ve benzeri şeyler istemez.`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Hesap-Skin ticareti yapmak yasaktır. Aksi taktirde olacaklardan UnlosTv Ailesi sorumlu değildir!`, '\u200B')
        .addField(`${emojis.prainbowarrowri} | Oyun içerisinde (chat vb.) veya discord harici platformlardan yapılan ihlallere ceza verilmemektedir.`, '\u200B')
        .addField('Kurallar değişebilir ve her kural yazılı şekilde belirtilmez. Lütfen saygılı olun.', ' İyi eğlenceler.')
        .setThumbnail('https://media.tenor.com/a4EAvt3COLoAAAAC/rules.gif')
        .setFooter('Sunucu Kuralları')
        .setTimestamp();
    message.react(`${emojis.checkMark}`);
    const rulesChannel = message.guild.channels.cache.find(channel => channel.name === channelSettings.servers[serverID].rulesChannelName);
    if (rulesChannel) {
        rulesChannel.send(rulesEmbed);
    } else {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Kurallar kanalı bulunamadı. Yeni bir tane oluşturuluyor...`);
        message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
        let rulesChannel = message.guild.channels.cache.find(channel => channel.name === channelSettings.servers[serverID].rulesChannelName);
        if (!rulesChannel) {
            rulesChannel = await message.guild.channels.create(`${channelSettings.servers[serverID].rulesChannelName}`, {
                type: 'text',
                topic: 'SUNUCU KURALLARI',
            });
        }
        rulesChannel.send(rulesEmbed);
    };
}
module.exports.config = {
    name: 'Kurallar',
    description: 'Rules kanalına önceden belirlenmiş kuralları mesaj olarak gönderir.',
    usage: '!kurallar',
    aliases: ['kurallar'],
    category: 'yetkili'
};