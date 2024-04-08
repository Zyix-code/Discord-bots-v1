const Discord = require("discord.js");

function handleTaggedEvent(message, client) {
    if (message.mentions.has(client.user)) {
        const user = message.author;
        const mentionEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`Hey ${user}
            Beni etiketlemişsin?
            Umarım bir sorun yoktur...
            Yardıma ihtiyacın varsa \`!yardım\` komudunu kullanabilirsin.`);
        message.channel.send(mentionEmbed);
    }
}
module.exports = { handleTaggedEvent };