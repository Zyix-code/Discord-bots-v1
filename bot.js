const Discord = require("discord.js");
const settings = require("./config/settings.json");
const emojis = require('./data/emojisData.json');
const { setCommands, commandHandler } = require("./events/commandHandlerEvents");
const readyEvent = require("./events/readyEvents");
const dmMessage = require("./events/dmEvents");
const userControl = require("./events/userControlEvents");
const { handleTaggedEvent } = require("./events/taggedEnvents");
const messageDelete = require("./events/messagedeleteEvents");
const channelCreate = require("./events/channelcreateEvents");
const channelDelete = require("./events/channeldeleteEvents");
const roleCreate = require("./events/rolcreateEvents");
const roleDelete = require("./events/roldeleteEvents");
const adBlock = require("./events/ad-blockEvents");
const filterWordsBlock = require("./events/filterWordsEvents");
const capslockFilter = require("./events/capsLockEvents");

var prefix = settings.prefix;
const client = new Discord.Client();
const commands = setCommands();
client.commands = commands;



client.on("message", async (message) => { commandHandler(client, message, prefix); dmMessage(message, client); handleTaggedEvent(message, client); });
client.on('messageDelete', (message) => { messageDelete(message); });
client.on('channelCreate', (channel) => { channelCreate(channel); });
client.on('channelDelete', (channel) => { channelDelete(channel); });
client.on('roleCreate', (role) => { roleCreate(role); });
client.on('roleDelete', (role) => { roleDelete(role); });
client.on("message", message => { adBlock(client, message); });
client.on("message", message => { filterWordsBlock(client, message); });
client.on("message", message => { capslockFilter(client, message); });
client.on("guildMemberAdd", async (member) => {
    const guildInvites = await member.guild.fetchInvites();
    let foundInvite = undefined;

    for (const [, invite] of guildInvites) {
        const inviteData = await client.fetchInvite(invite.url);
        if (inviteData.uses < inviteData.memberCount) {
            foundInvite = inviteData;
            break;
        }
    }

    const inviterTag = foundInvite?.inviter ? foundInvite.inviter.toString() : "Bilinmiyor";
    const guildInviteData = guildInvites.find((inv) => inv.code === foundInvite?.code)
    userControl(member, inviterTag, guildInviteData);
});

client.on("ready", () => readyEvent(client, prefix));
client.login(settings.token);

