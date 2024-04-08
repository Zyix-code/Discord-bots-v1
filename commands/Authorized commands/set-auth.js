const fs = require('fs');
const Discord = require('discord.js');
const emojis = require('../../data/emojisData.json');
const permissionsFilePath = 'data/permissionsData.json';
const auth = require('../../data/permissionsData.json');
module.exports.run = async (client, message, args) => {
    let permissionsData = JSON.parse(fs.readFileSync(permissionsFilePath, 'utf8'));
    const serverID = message.guild.id;
    try {
        fs.writeFileSync(permissionsFilePath, JSON.stringify(permissionsData, null, 2));
    } catch (err) {
        console.error("permissionsDataJson kaydedilirken bir hata oluştu:", err);
    }
    if (!permissionsData.servers.hasOwnProperty(serverID)) {
        permissionsData.servers[serverID] = {
            serverOwnerRole: "default-owner-role",
            serverFemaleAuthoritativeRole: "default-female-authoritative-role",
            serverAuthoritativeRole: "default-authoritative-role",
            serverAdminRole: "default-server-admin-role",
            serverSecurityRole: "default-server-security-role",
            serverMaleMemberRole: "default-server-male-member-role",
            serverFemaleMemberRole: "default-server-female-member-role",
            serverMutedRole: "default-server-muted-role",
            ownerID: "default-ownerID"
        };
    }
    const serverData = permissionsData.servers[serverID];
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
        !message.member.roles.cache.some(role => role.name === serverData.serverOwnerRole) &&
        !message.member.roles.cache.some(role => role.name === serverData.serverFemaleAuthoritativeRole) &&
        message.author.id !== serverData.ownerID
    ) {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Bu komutu kullanabilmek için yetkiniz bulunmamaktadır.`);
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }

    const authNames = {
        serverOwnerRole: 'Sunucu Kurucu Rolü',
        serverFemaleAuthoritativeRole: 'Sunucu Bayan Kurucu Rolü',
        serverAuthoritativeRole: 'Sunucu Yetkili Rolü',
        serverAdminRole: 'Sunucu Admin Rolü',
        serverSecurityRole: 'Sunucu Güvenlik Rolü',
        serverMaleMemberRole: 'Sunucu Erkek Üye Rolü',
        serverFemaleMemberRole: 'Sunucu Kadın Üye Rolü',
        serverMutedRole: 'Sunucu Muteli Üye Rolü',
        ownerID: 'Bot Sahibi ID',
    };

    const authAliases = {
        'sunucu-kurucusu-rol': 'serverOwnerRole',
        'sunucu-bayan-kurucu-rol': 'serverFemaleAuthoritativeRole',
        'sunucu-yetkili-rol': 'serverAuthoritativeRole',
        'sunucu-admin-rol': 'serverAdminRole',
        'sunucu-güvenlik-rol': 'serverSecurityRole',
        'sunucu-erkek-rol': 'serverMaleMemberRole',
        'sunucu-kadın-rol': 'serverFemaleMemberRole',
        'sunucu-muteli-rol': 'serverMutedRole',
        'bot-sahibi-id': 'ownerID',
    };

    if (args.length === 1) {
        const embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Yetki Adları')
            .setDescription('Yanlış yetki türü girdiniz. Aşağıda bulunan yetki türlerinden birisini kullanarak yetki adını güncelleyebilirsiniz.')
            .addField('Örnek kullanım:', '`!yetki-duzenle [sunucu-kurucusu-rol] [yeni-yetki-adı]`');

        Object.entries(authNames).forEach(([key, value]) => {
            const aliases = Object.keys(authAliases).filter(alias => authAliases[alias] === key);
            const aliasesText = aliases.length > 0 ? aliases.join(' / ') : 'Tanımlanmamış';
            embed.addField(value, `\n`, true);
            const authSetting = serverData[key] !== '' ? `\`${serverData[key]}\`` : 'Tanımlanmamış';
            embed.addField('Kullanım', `${aliasesText}`, true);
            embed.addField('Tanımlı Yetki', `${authSetting}`, true);
        });
        message.react(`${emojis.crossMark}`);
        return message.channel.send(embed);
    }

    if (args.length >= 2) {
        const authTypeAlias = args[0];
        const newAuthName = args.slice(1).join(' ');
        const authType = authAliases[authTypeAlias];
        if (authType) {
            const key = authType;
            if (key !== 'ownerID') {
                serverData[key] = newAuthName;
            } else {
                if (message.author.id !== serverData.ownerID) {
                    const unauthorizedEmbed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription(`${message.author} Sadece bot sahibi bu komutu kullanabilir.`);
                    message.react(`${emojis.crossMark}`);
                    return message.channel.send(unauthorizedEmbed).then(cmf => {
                        cmf.delete({ timeout: 5000 })
                    });
                }
                serverData.ownerID = newAuthName;
            }
            fs.writeFile(permissionsFilePath, JSON.stringify(permissionsData, null, 2), err => {
                if (err) {
                    console.error('Yetki ayarları kaydedilirken bir hata oluştu:', err);
                    const accessDeniedEmbed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription(`${message.author} Yetki ayarları kaydedilirken bir hata oluştu.`);
                    message.react(`${emojis.crossMark}`);
                    return message.channel.send(accessDeniedEmbed).then(cmf => {
                        cmf.delete({ timeout: 5000 })
                    });
                }
                const accessGrantedEmbed = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`${message.author} \`${authNames[authType]}\` alakalı yetki \`${newAuthName}\` olarak ayarlandı.`);
                message.react(`${emojis.checkMark}`);
                return message.channel.send(accessGrantedEmbed);
            });
        } else {
            const accessDeniedEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
                .addField('Kullanım:', '`!yetki-duzenle [yetki_türü] [yeni-yetki-adı]`')
                .addField('Örnek:', '`!yetki-duzenle [sunucu-muteli-rol] [yeni-yetki-adı]`');
            message.react(`${emojis.crossMark}`);
            return message.channel.send(accessDeniedEmbed).then(cmf => {
                cmf.delete({ timeout: 5000 })
            });
        }
    } else {
        const accessDeniedEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${message.author} Geçersiz veya eksik bir komut kullandınız.`)
            .addField('Kullanım:', '`!yetki-duzenle [yetki_türü] [yeni-yetki-adı]`')
            .addField('Örnek:', '`!yetki-duzenle [sunucu-muteli-rol] [yeni-yetki-adı]`');
        message.react(`${emojis.crossMark}`);
        return message.channel.send(accessDeniedEmbed).then(cmf => {
            cmf.delete({ timeout: 5000 })
        });
    }
};

module.exports.config = {
    name: 'Yetki Düzenle',
    description: 'Belirli yetki türlerinin adlarını tanımlar.',
    usage: '!yetki-duzenle [yetki_türü] [yetki_adı]',
    aliases: ['yetki-düzenle'],
    category: 'yetkili'
};
