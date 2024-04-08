const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const commands = setCommands(client);
client.commands = commands;

function setCommands(client) {
  const commandFolders = fs.readdirSync("./commands");

  let commands = new Discord.Collection();

  commandFolders.forEach((folder) => {
    const commandFilesFolder = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    commandFilesFolder.forEach((file) => {
      try {
        const command = require(`../commands/${folder}/${file}`);
        commands.set(command.config.name, command);
      } catch (error) {
        console.error(`${folder}/${file} dosyası yüklenirken bir hata oluştu:`, error);
      }
    });
  });
  return commands;
}

function commandHandler(client, message, prefix) {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.config.aliases && cmd.config.aliases.includes(commandName));
  if (!command) return;

  try {
    command.run(client, message, args);
  } catch (error) {
    console.error("Komutlar yüklenirken bir hata oluştu:", error);
  }
}
module.exports = {
  setCommands,
  commandHandler,
};
