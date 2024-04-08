const Discord = require('discord.js');
const auth = require("../../data/permissionsData.json");
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

    const ping = Math.round(client.ws.ping);
    const embed = new Discord.MessageEmbed()
        .setTitle('Gecikme Süresi Hesaplanıyor...')
        .setColor('RANDOM')
        .addField('Bot Ping:', `\`${client.ws.ping} ms\``);

    message.channel.send(embed).then(msg => {
        const apiPing = msg.createdTimestamp - message.createdTimestamp;
        embed.addField('API Gecikmesi:', `\`${apiPing} ms\``);
        msg.edit(embed);
        console.log(`Botun sunucuda bulunan gecikme süresi: ${client.ws.ping} ms`);
        console.log(`Botun API gecikme süresi: ${apiPing} ms`);
    }).catch(console.error)
};
module.exports.config = {
    name: 'Ping',
    description: 'Botun api gecikmesini ve pingini söyler.',
    usage: '!gecikme',
    aliases: ['gecikme'],
    category: 'yetkili'
};