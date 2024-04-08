const Discord = require("discord.js");
const userMessageCounts = {};
function dmMessage(message, client) {
  if (message.channel.type === "dm" && message.author.id !== client.user.id) {
    const authorId = message.author.id;

    if (!userMessageCounts[authorId]) {
      userMessageCounts[authorId] = 1;
    } else {
      userMessageCounts[authorId]++;
    }

    const messageCount = userMessageCounts[authorId];
    let responseMessage = "";

    if (messageCount === 5) {
      responseMessage = `${message.author} Sanırım ısarla mesaj göndermeye çalışıyorsunuz ama sizinle buradan ilgilenemem.`;
    } else if (messageCount === 8) {
      responseMessage = `${message.author} Hey dostum... 
      Lütfen artık dur! 
      8 adet mesaj gönderimi sağlamışsın sana anlatmaktan ağzımda tüy bitti. Buradan ilgilenemiyorum...`;
    } else if (messageCount === 10) {
      responseMessage = `${message.author} Yeter?
      Vallaha 155'i araram.
      Buradan ilgilenmiyorum bulunduğum bir discord sunucusundan \`!yardım\` komudunu kullanabilirsin.`;
    } else {
      responseMessage = `${message.author} Özelden mesajlara cevap vermiyorum.
      Sizinle ilgilenebilmem için beni Discord sunucunuza eklemeniz ya da aktif bulunduğum bir Discord sunucusundan \`!yardım\` istemeniz gerekmektedir.`;
    }
    const responseEmbed = new Discord.MessageEmbed()
      .setColor("#ff0000")
      .setDescription(responseMessage);

    return message.channel.send(responseEmbed);
  }
}

module.exports = dmMessage;