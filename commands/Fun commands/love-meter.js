const Discord = require('discord.js');
const emojis = require('../../data/emojisData.json');
const auth = require('../../data/permissionsData.json');
exports.run = (client, message, args) => {
    try {
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

        let member = message.guild.members.cache.get(
            message.mentions.users.first()?.id || args[0]
        );
        let member2 = message.guild.members.cache.get(
            message.mentions.users.array()[1]?.id || args[1]
        );
        var s = message.author;
        if (member2) {
            s = member2.user;
        }
        if (!member) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
                .addField('Kullanım:', '`!aşk-ölçer [@Üye]`')
                .addField('Örnek:', '`!aşk-ölçer [@Elemmírë]`')
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }

        var anasonuc = Math.floor(Math.random() * 101);
        var kalp = "";
        var akalp = "";
        if (Math.floor(Math.round(anasonuc / 10) * 10) >= 10) {
            var c = 0;
            for (var i = 0; i < Math.floor(Math.round(anasonuc / 10)); i++) {
                kalp += "❤️";
                c++;
            }
            for (var x = c; x < 10; x++) {
                akalp += `🖤`;
            }
        } else {
            kalp = "🖤";
            akalp = "🖤🖤🖤🖤🖤🖤🖤🖤🖤";
        }
        var yorum = "Sizi evlendirelim <3";
        if (anasonuc < 80) {
            yorum = "Biraz daha uğraşırsan bu iş olacak gibi :)";
        }
        if (anasonuc < 60) {
            yorum = "Eh biraz biraz bir şeyler var gibi.";
        }
        if (anasonuc < 40) {
            yorum = "Azıcıkta olsa bir şeyler hissediyor sana :)";
        }
        if (anasonuc < 20) {
            yorum = "Bu iş olmaz sen bunu unut.";
        }
        const embed = new Discord.MessageEmbed()
            .setAuthor('AŞK ÖLÇER')
            .setDescription(`**${member.user} ve ${s}**
            Aşk yüzdesi **%${anasonuc}**!
            ${kalp}${akalp} \n\n${yorum}`)
            .setColor("RED");
        message.react(`${emojis.loveanimated}`);
        return message.channel.send(embed);
    }
    catch (error) {
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
    name: "Aşk Ölçer",
    description: "İki kullanıcı arasındaki aşkı ölçer.",
    usage: "aşk-ölçer <@kullanıcı> veya aşk-ölçer <@kullanıcı> <@kullanıcı>",
    aliases: ['aşk-ölçer'],
    category: 'eğlence'
};
