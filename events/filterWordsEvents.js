const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
const auth = require('../data/permissionsData.json');
const filterWordsFilePath = path.join(__dirname, '../data/securityData.json');
let filterWordsData = JSON.parse(fs.readFileSync(filterWordsFilePath, 'utf8'));

function updatefilterWordsData() {
    filterWordsData = JSON.parse(fs.readFileSync(filterWordsFilePath, 'utf8'));
}
function filterWordsBlock(client, message) {
    updatefilterWordsData();
    const serverID = message.guild.id;
    if (message.author.id === auth.servers[serverID].ownerID) return;
    if (message.author.id == message.guild.ownerID) return;
    if (filterWordsData.servers[serverID]?.filterWordsControl) {
        const badwords = ["puşt", "oç", "amk", "ananı sikiyim", "ananıskm", "piç", "Amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "sik", "yarrak", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "amq"];
        if (badwords.some(word => message.content.includes(word))) {
            try {
                const accessDeniedEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${message.author}  Bu sunucuda küfür etmek yasak!`);
                message.delete();
                return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = filterWordsBlock;
