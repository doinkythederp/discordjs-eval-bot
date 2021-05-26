//These first few lines are for running express server.
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('The bot now has a server running.<br><a href="/refresh"><button>Refresh</button></a>'));
app.get('/refresh', (req, res) => {
  console.log("Restarting from web.");
  res.send("Bot refreshed!<script>setTimeout(() => location.href = '/', 1000);</script>");
  client.destroy();
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// Bot code begins here.
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const fetch = require("node-fetch");
const asyncEval = require("./worker");
client.on('ready', () => {
  client.channels.cache.get("795366538370088973").send("Bot refreshed!")
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
  if (!message.guild) return;
  const thisBotSucks = 'no it does not'
  const LeSirH = '1';
  const GGB = '1';
  const mentionuser = '<@!' + message.author.id + '> '
  const content = message.content;
  const messagelink = message.guild ? "https://discord.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id : undefined;
  const helpembed = new Discord.MessageEmbed()
    .setTitle('Discord.js Evaluate Bot')
    .setDescription('My prefix is `;`')
    .addField('**;ping**', 'Shows latency of bot.')
    .addField('**;refresh**', "Terminates all processess of the bot, clears cache and specified variables.")
    .addField(
      '**;eval [code]**',
      'Command to evaluate code you input. Javascript only!'
    )
    .setColor('#000000');

  const prefix = ';';

  // Ping command
  if (content.startsWith(';ping')) {
    const latency = Date.now() - message.createdTimestamp
    const api = Math.round(client.ws.ping)
    const pinginfo = new Discord.MessageEmbed()
      .setDescription(mentionuser + ' [Pong!](' + messagelink + ')' + "\n**Latency:** " + latency + "ms" + "\n" + "**API:** " + api + "ms")
      .setColor('#000000');
    message.channel.send(pinginfo);
  }

  if (content.startsWith(';refresh') || content.startsWith(';restart')) {
    console.log("Restarting from command.");
    message.react('830234314691575848').finally(client.destroy);
  }


  if (content.startsWith(';help')) {
    message.channel.send(helpembed);
  }

  if (content.startsWith('<@!780638562567061536>')) {
    message.channel.send(helpembed);
  }

  if (content.startsWith(';eval')) {
    let args = message.content
      .substring(prefix.length)
      .trim()
      .split(/ +/g);
    let func = args.slice(1).join(' ');
    if (!func)
      return message.channel.send(
        "listen, i can't evaluate code without you giving me code after the command"
      );

    let filter = func.toString()
    if (filter.includes("token") || filter.includes("concat") || filter.includes("import")) {
      evl =
        'bad code big no no';
    } else {
      try {
        evl = eval(func);
      } catch (e) {
        evl = e;
      }
    }

    if (content.startsWith(';worker')) {
    let args = message.content
      .substring(prefix.length)
      .trim()
      .split(/ +/g);
    let func = args.slice(1).join(' ');
    if (!func)
      return message.channel.send(
        "listen, i can't evaluate code without you giving me code after the command"
      );

    let filter = func.toString()
    if (filter.includes("token") || filter.includes("concat") || filter.includes("import")) {
      evl =
        'bad code big no no';
    } else {
      try {
        evl = await asyncEval({ code: func, context: global.workerContext || {} });
      } catch (e) {
        evl = e;
      }
    }
    var evalEmbed = new Discord.MessageEmbed()
      .setColor('#000000')
      .addField("Input", "```js\n" + args.slice(1).join(' ') + "\n```")
      .addField('Output', '```js\n' + require("util").inspect(evl).substr(0, 1024 - 12) + '\n```')
      .setFooter('Time to execute:' + '...');
    message.channel.send(evalEmbed).then(evalmsg => {
      let exetime = evalmsg.createdTimestamp - message.createdTimestamp
      evalEmbed.setFooter("Time to execute: " + exetime + "ms")
      evalmsg.edit(evalEmbed)
    })
    console.log(message.author.tag + ' 𝙄𝙉𝙋𝙐𝙏   ' + args.slice(1).join(' ') + '\n' + message.author.tag + " 𝙊𝙐𝙏𝙋𝙐𝙏  " + evl + '\n----------------------------');
  }

    var evalEmbed = new Discord.MessageEmbed()
      .setColor('#000000')
      .addField("Input", "```js\n" + args.slice(1).join(' ') + "\n```")
      .addField('Output', '```js\n' + require("util").inspect(evl).substr(0, 1024 - 12) + '\n```')
      .setFooter('Time to execute:' + '...');
    message.channel.send(evalEmbed).then(evalmsg => {
      let exetime = evalmsg.createdTimestamp - message.createdTimestamp
      evalEmbed.setFooter("Time to execute: " + exetime + "ms")
      evalmsg.edit(evalEmbed)
    })
    console.log(message.author.tag + ' 𝙄𝙉𝙋𝙐𝙏   ' + args.slice(1).join(' ') + '\n' + message.author.tag + " 𝙊𝙐𝙏𝙋𝙐𝙏  " + evl + '\n----------------------------');
  }
});
if (process.env.DEBUG) client.on("debug", console.log);
client.login()

{
  // doinkythederp's 100% secure security block for stuff because of circuit crashing the bot
  let token = process.env.DISCORD_TOKEN;
  let destroy = client.destroy;
  client.destroy = (function() {
    console.log("client destroyed!");
    destroy.call(client);
    process.exit(0);
  });
  setInterval(() => {
    if (!client._events.message || client.token !== token) process.exit();
  }, 1000);
  function convertRequire(require) {
    let rqr = require
    require = (function(path) {
      if (path === "child_process" || path === "node:child_process" || path === "node:cluster" || path === "cluster") throw "bad code big no no";
      if (path === "module" || path === "node:module") {
        let md = rqr(path);
        md.createRequire = (function() {
          throw "bad code big no no";
        });
        md.createRequire.toString = rqr(path).createRequire.toString
        return md;
      }
      return rqr(path);
    });
    require.toString = rqr.toString
    return require
  }
  require = convertRequire(require);
}