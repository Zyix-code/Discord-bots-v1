const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
const auth = require('../data/permissionsData.json');
const adBlockFilePath = path.join(__dirname, '../data/securityData.json');
let adBlockData = JSON.parse(fs.readFileSync(adBlockFilePath, 'utf8'));

function updateadBlockData() {
    adBlockData = JSON.parse(fs.readFileSync(adBlockFilePath, 'utf8'));
}
function adBlock(client, message) {
    updateadBlockData();
    const serverID = message.guild.id;
    if (message.author.id === auth.servers[serverID].ownerID) return;
    if (message.author.id == message.guild.ownerID) return;
    if (adBlockData.servers[serverID]?.adBlockControl) {
        const adblock = [".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", "net", ".rf.gd", ".az", ".party", "discord.gg"];
        if (adblock.some(word => message.content.includes(word))) {
            try {
                const accessDeniedEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${message.author} Bu sunucuda reklam yapman yasak!`);
                message.delete();
                return message.channel.send(accessDeniedEmbed).then(cmf => { cmf.delete({ timeout: 5000 }); });
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = adBlock;
