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
    const categories = [
        {
            name: 'Seviye',
            description: 'Seviye kategorisi açıklama',
            usage: '!yardım seviye',
            aliases: '!yardım seviye',
            requiredRoles: [auth.servers[serverID].ownerID, auth.servers[serverID].serverMaleMemberRole, auth.servers[serverID].serverFemaleMemberRole]
        },
        {
            name: 'Eğlence',
            description: 'Eğlence kategorisi açıklama',
            usage: '!yardım eğlence',
            aliases: '!yardım eğlence',
            requiredRoles: [auth.servers[serverID].ownerID, auth.servers[serverID].serverMaleMemberRole, auth.servers[serverID].serverFemaleMemberRole]
        },
        {
            name: 'Kullanıcı',
            description: 'Kullanıcı kategorisi açıklama',
            usage: '!yardım kullanıcı',
            aliases: '!yardım kullanıcı',
            requiredRoles: [auth.servers[serverID].ownerID, auth.servers[serverID].serverMaleMemberRole, auth.servers[serverID].serverFemaleMemberRole]
        },
        {
            name: 'Yapımcı',
            description: 'Yapımcı kategorisi açıklama',
            usage: '!yardım yapımcı',
            aliases: '!yardım yapımcı',
            requiredRoles: [auth.servers[serverID].ownerID, auth.servers[serverID].serverMaleMemberRole, auth.servers[serverID].serverFemaleMemberRole]
        }
    ];

    const categories2 = [
        {
            name: 'Yetkili',
            description: 'Yetkili kategorisi açıklama',
            usage: '!yardım Yetkili',
            aliases: '!yardım Yetkili',
            requiredRoles: [auth.servers[serverID].ownerID, auth.servers[serverID].serverOwnerRole, auth.servers[serverID].serverFemaleAuthoritativeRole, auth.servers[serverID].serverAuthoritativeRole, auth.servers[serverID].serverAdminRole]
        },
        {
            name: 'Ayarlar',
            description: 'Ayarlar kategorisi açıklama',
            usage: '!yardım ayarlar',
            aliases: '!yardım ayarlar',
            requiredRoles: [auth.servers[serverID].ownerID, auth.servers[serverID].serverOwnerRole, auth.servers[serverID].serverFemaleAuthoritativeRole, auth.servers[serverID].serverAuthoritativeRole, auth.servers[serverID].serverAdminRole]
        },
        {
            name: 'Güvenlik',
            description: 'Güvenlik kategorisi açıklama',
            usage: '!yardım güvenlik',
            aliases: '!yardım güvenlik',
            requiredRoles: [auth.servers[serverID].ownerID, auth.servers[serverID].serverOwnerRole, auth.servers[serverID].serverFemaleAuthoritativeRole, auth.servers[serverID].serverAuthoritativeRole, auth.servers[serverID].serverAdminRole]
        }
    ];
    if (args[0]) {
        const category = args[0].toLowerCase();
        const selectedCategory = categories.find(cat => cat.name.toLowerCase() === category) || categories2.find(cat => cat.name.toLowerCase() === category);
        if (!selectedCategory) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Geçersiz bir kategori belirtildi. Mevcut kategorileri görmek için \`!yardım\` komutunu kullanabilirsiniz.`)
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }

        const userRoles = message.member.roles.cache;
        const requiredRoles = selectedCategory.requiredRoles;
        if (requiredRoles && requiredRoles.length > 0) {
            const userHasRequiredRole = userRoles.some(userRole => requiredRoles.includes(userRole.name) || requiredRoles.includes(userRole.id));
            const isBotOwner = message.author.id === auth.servers[serverID].ownerID;
            if (!userHasRequiredRole && !isBotOwner) {
                const accessDeniedEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${message.author} Bu kategoriye erişim yetkiniz bulunmamaktadır.`);
                message.react(`${emojis.crossMark}`);
                return message.channel.send(accessDeniedEmbed).then(cmf => {
                    cmf.delete({ timeout: 5000 })
                });
            }
        } else if (!requiredRoles.includes(auth.servers[serverID].ownerID)) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Bu kategoriye erişim yetkiniz bulunmamaktadır.`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        const commands = client.commands.filter(cmd => cmd.config.category === category);
        const capitalizedStr = category.replace(/^\w/, (match) => match.toUpperCase());
        if (commands.size === 0) {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Bu kategoride komut bulunmamaktadır: ${capitalizedStr}`);
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
        const gifUrls = {
            Yetkili: 'https://media.tenor.com/51Mc7JBPxY8AAAAC/gora-tam-yetki-istiyorum.gif',
            Kullanıcı: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/85229a57490547.59e4b5dfe4a75.gif',
            Ayarlar: 'https://cdn.pixabay.com/animation/2023/03/06/05/36/05-36-20-416_512.gif',
            Eğlence: 'https://media.tenor.com/0J3dXnznGlMAAAAd/e%C4%9Flenmek.gif',
            Yapımcı: 'https://cdn.discordapp.com/guilds/1076797886626533386/users/481831692399673375/avatars/a_5bdee6948d33c028160b641bac441411',
            Seviye: 'https://cdn.dribbble.com/users/96166/screenshots/1398761/medal.gif'
        };

        const gifUrl = gifUrls[capitalizedStr] || '';
        const commandList = commands.map(cmd => `${emojis.smallBlueDiamond}` + `**${cmd.config.name}**\n ${cmd.config.description}\nKullanım: ` + `\`${cmd.config.usage}\``).join('\n\n');
        const categoryEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setAuthor(capitalizedStr + ' Menüsü', client.user.displayAvatarURL())
            .setTitle(`${capitalizedStr} Komutları`)
            .setDescription(commandList)
            //.setFooter(`Kullanım: !yardım ${category.toLowerCase()}`)
            .setThumbnail(gifUrl);
        return message.channel.send(categoryEmbed);
    }
    const helpEmbed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setAuthor('Yardım Menüsü', client.user.displayAvatarURL())
        .setTitle('Yardım Komutları')
        .setThumbnail('https://media.tenor.com/tevbXx2VEdEAAAAd/help-help-kenan-thompson.gif');
    categories.forEach(category => {
        helpEmbed.addField(`${emojis.smallBlueDiamond}` + category.name, `\`${category.usage}\``, true);
    });
    categories2.forEach(category => {
        helpEmbed.addField(`${emojis.smallBlueDiamond}` + category.name, `\`${category.usage}\``, true);
    });
    message.channel.send(helpEmbed);
};
module.exports.config = {
    name: 'Yardım',
    description: 'Mevcut kategorileri veya belirli bir kategorinin komutlarını gösterir',
    usage: '!yardım',
    aliases: ['yardım'],
    category: 'kullanıcı'
};
