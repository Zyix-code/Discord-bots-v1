const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
const auth = require('../data/permissionsData.json');
const capsLockFilePath = path.join(__dirname, '../data/securityData.json');
let capsLockData = JSON.parse(fs.readFileSync(capsLockFilePath, 'utf8'));

function updatecapsLockData() {
    capsLockData = JSON.parse(fs.readFileSync(capsLockFilePath, 'utf8'));
}
function CapsLock(client, message) {
    updatecapsLockData();
    const serverID = message.guild.id;
    if (message.author.id === auth.servers[serverID].ownerID) return;
    if (message.author.id == message.guild.ownerID) return;
    if (capsLockData.servers[serverID]?.capsLockControl) {
        const uppercaseThreshold = 0.7;
        const messageContent = message.content.replace(/[^a-zA-Z]/g, '');
        const uppercaseCount = messageContent.replace(/[^A-Z]/g, '').length;
        const lowercaseCount = messageContent.replace(/[^a-z]/g, '').length;
        if (lowercaseCount === 0 && uppercaseCount / messageContent.length >= uppercaseThreshold) {
            try {
                message.delete();

                const capsLockEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${message.author} Bu sunucuda CAPS LOCK açık bir şekilde yazı yazmak yasak!`);
                message.channel.send(capsLockEmbed).then(cmf => {
                    cmf.delete({ timeout: 5000 });
                });
            } catch (err) {
                console.log(err);
            }
        }
    }
}
module.exports = CapsLock;
