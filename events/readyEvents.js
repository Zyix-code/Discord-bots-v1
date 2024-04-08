const Discord = require("discord.js");
const settings = require("../config/settings.json");
const fs = require("fs");

function countCommandsByCategory(category) {
  const categoryFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
  return categoryFiles.length;
}

function countTotalCommands() {
  let total = 0;
  const commandFolders = fs.readdirSync("./commands");

  commandFolders.forEach(folder => {
    total += countCommandsByCategory(folder);
  });

  return total;
}

async function readyEvent(client) {
  console.log("_________________________________________");
  console.log(`Bot Sahibi: ${settings.sahip}`);
  console.log(`Bot İsmi: ${client.user.username}`);
  console.log(`Sunucular: ${client.guilds.cache.size}`);
  console.log(`Prefix: ${settings.prefix}`);
  console.log("_________________________________________");
  console.log(`Toplam Komut: ${countTotalCommands()}`);
  const commandFolders = fs.readdirSync("./commands");
  commandFolders.forEach(folder => {
    console.log(`${folder}: ${countCommandsByCategory(folder)} adet komut`);
  });
  console.log("_________________________________________");
  console.log(`Durum: Bot Çevrimiçi!`);


  const activities = [
    "!yardım",
    `${client.guilds.cache.size} adet sunucuyu`
    // ... diğer aktivite buraya ekle.
  ];
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * activities.length);
    const newActivity = activities[randomIndex];

    client.user.setPresence({
      activity: {
        name: newActivity,
        type: "LISTENING", // WATCHING,LISTENING,PLAYING
      },
    });
  }, 10000);
}

module.exports = readyEvent;
