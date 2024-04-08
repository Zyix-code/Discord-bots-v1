const Discord = require("discord.js");
const emojis = require('../../data/emojisData.json');
const auth = require("../../data/permissionsData.json");
module.exports.run = async (client, message, args) => {
  const serverID = message.guild.id;
  let targetUser;
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
    !message.member.roles.cache.some((role) => role.name === auth.servers[serverID].serverMaleMemberRole) &&
    !message.member.roles.cache.some((role) => role.name === auth.servers[serverID].serverFemaleMemberRole) &&
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
  if (args.length > 0) {
    const userID = args[0].replace(/[\\<>@!]/g, "");
    targetUser = client.users.cache.get(userID);

    if (!targetUser) {
      const accessDeniedEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`${message.author} Geçersiz kullanıcı etiketlendi veya belirtilen kullanıcı IDsi bulunamadı.`)
        .addField("Kullanım:", "`!avatar [@Üye/ID]`")
        .addField("Örnek:", "`!avatar [@Elemmírë/ID]`");
      message.react(`${emojis.crossMark}`);
      return message.channel.send(accessDeniedEmbed).then(cmf => {
        cmf.delete({ timeout: 5000 })
      });
    }
  } else if (message.mentions.users.size) {
    targetUser = message.mentions.users.first();
  } else {
    targetUser = message.author;
  }

  const userAvatar = targetUser.displayAvatarURL({ dynamic: true, size: 128 });
  let embedColor;
  if (targetUser.presence.status === "online") {
    embedColor = "GREEN";
  } else if (targetUser.presence.status === "idle") {
    embedColor = "YELLOW";
  } else if (targetUser.presence.status === "dnd") {
    embedColor = "RED";
  } else {
    embedColor = "GRAY";
  }
  const profilePhotoEmbed = new Discord.MessageEmbed()
    .setColor(embedColor)
    .setTitle("Profil Fotoğrafı")
    .setDescription(`${targetUser} kullanıcısının Profil Fotoğrafı:`)
    .setImage(userAvatar);
  message.channel.send(profilePhotoEmbed);
};

module.exports.config = {
  name: "Kullanıcı Avatar",
  description: "Kullanıcının avatarını gösterir.",
  aliases: ["avatar"],
  usage: "!avatar",
  category: "kullanıcı",
};
