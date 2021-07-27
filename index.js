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
var client;

  const infect = (data, disallowed, replacement, parent) => {
    if (data === disallowed) return replacement;
    
    if (typeof data === 'function') {
      let infected = (...args) => {
        let bound = data.bind(parent);
        return infect(bound(...args));
      };
      infected.toString = infected.toString.bind(data);
      return infected;
    }
    
    if (typeof data === 'object') {
      return new Proxy(data, {
        get() {
          let result = Reflect.get(...arguments);
          return infect(result, disallowed, replacement, data);
        },
        getOwnPropertyDescriptor() {
          let result = Reflect.getOwnPropertyDescriptor(...arguments);
          return infect(result, disallowed, replacement, data);
        }
      });
    }
    
    return data;
  };
  client = infect(new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] }), process.env.DISCORD_TOKEN, 'p4ssw0rd');
  Object.defineProperty(process.env, "DISCORD_TOKEN", { value: 'p4ssw0rd' });

const fetch = require("node-fetch");
const fs = require('fs');
var prefix = ';'
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.channels.cache.get("795366538370088973").send("Bot refreshed!");
});
const vm = require('vm');

client.on('message', async (message) => {
  const thisBotSucks = 'no it does not'
  const LeSirH = '1';
  const GGB = '1';
  const mentionuser = '<@!' + message.author.id + '> '
  const content = message.content;
  const messagelink = message.guild ? "https://discord.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id : undefined;
  const helpembed = new Discord.MessageEmbed()
    .setTitle('Discord.js Eval Bot')
    .setDescription('My prefix is `' + prefix + '`')
    .addField('**' + prefix + 'ping**', 'Shows latency of bot.')
    .addField('**' + prefix + 'refresh** / **' + prefix + 'restart**', "Terminates all processess of the bot, clears cache and specified variables.")
    .addField(
      '**' + prefix + 'eval <code>**',
      'Command to evaluate code you input. Javascript only!'
    )
    .addField('**' + prefix + 'version**', 'Displays the bot\'s current version')
    .setColor('#000000');

  // Ping command
  if (content.startsWith(prefix + 'ping')) {
    const latency = Date.now() - message.createdTimestamp
    const api = Math.round(client.ws.ping)
    const pinginfo = new Discord.MessageEmbed()
      .setDescription(mentionuser + ' [Pong!](' + messagelink + ')' + "\n**Latency:** " + latency + "ms" + "\n" + "**API:** " + api + "ms")
      .setColor('#000000');
    message.channel.send(pinginfo);
  }

  if (content.startsWith(prefix + 'refresh') || content.startsWith(prefix + 'restart')) {
    console.log("Restarting from command.");
    message.react('830234314691575848').finally(client.destroy);
  }

  if (content.startsWith(prefix + 'version')) {
    const versionEmbed = new Discord.MessageEmbed()
      .setTitle('Discord.js Eval Bot v6')
      .setDescription('Originally made by GoodGradesBoy#9166, the bot was forked, and is now maintained by doinkythederp#6523 primarily for use in the sudo-server Discord')
      .addField('**v6.1-doinkythederp**', '- Adds `setPrefix`')
      .addField('**v6-doinkythederp**', 'Version 6 focuses on providing more security when evaluating.\n\n- Infinite loops no more! `while (1) {}` no longer crashes the bot.\n- More globals: `fetch`, `encodev8`, and `decodev8` are now accessable from anywhere.\n- Destroying the client no longer kills the bot, and triggers a restart.\n- `child_process` and `cluster` have been disabled.\n- Eval times are now accurate.')
      .setColor('#000000');
    message.channel.send(versionEmbed);
  }


  if (content.startsWith(prefix + 'help') || content.startsWith('<@!' + client.user.id + '>')) {
    message.channel.send(helpembed);
  }

  if (content.startsWith(prefix + 'eval')) {
    const timestamp = Date.now();
    let failed = false;
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
    if (filter.includes("import")) {
      evl =
        'bad code big no no';
    } else {

      const context = vm.createContext({
        Discord,
        client,
        fetch,
        message: infect(message),
        args,
        prefix,
        setPrefix(v) {
          prefix = v
        },
        ...globalThis,
        setGlobal(name, value) {
          globalThis[name] = value;
          return true;
        },
        delGlobal(name) {
          delete globalThis[name];
          return true;
        },
        encodev8: require("v8").serialize,
        decodev8: require("v8").deserialize,
        process,
        console,
        require,
        __dirname,
        __filename,
        queueMicrotask() {
          throw 'queueMicrotask is disabled in this environment. Please use Promises instead.'
        },
        mentionuser,
        LeSirH,
        GGB,
        messagelink,
        content,
        Buffer,
        URL,
        URLSearchParams
      },
      { microtaskMode: "afterEvaluate" });

      try {
        evl = vm.runInContext(func, context, { filename: "eval", timeout: 5000 });
      } catch (e) {
        evl = e;
        failed = true;
      }
    }

    const exetime = Date.now() - timestamp;

    const evalEmbed = new Discord.MessageEmbed()
      .setColor('#000000')
      .addField("Input", "```js\n" + args.slice(1).join(' ').substr(0, 1024 - 15) + "\n```")
      .addField('Output', '```js\n' + (!failed ? require("util").inspect(evl).substr(0, 1024 - 15) : evl.toString().substr(0, 1024 - 12)) + '\n```')
      .setFooter(!failed ? "Time to execute: " + exetime + "ms" : "Stopped due to uncaught error: " + exetime + "ms");
    message.channel.send(evalEmbed);

    console.log(message.author.tag + ' Server: ' + message.guild?.name);
    console.log(message.author.tag + ' 𝙄𝙉𝙋𝙐𝙏   ' + args.slice(1).join(' ').substr(0, 1024 - 15).replace(/\n/g, "\n... "));
    console.log(message.author.tag + " 𝙊𝙐𝙏𝙋𝙐𝙏  " + (!failed ? require("util").inspect(evl).substr(0, 1024 - 15).replace(/\n/g, "\n... ") : evl.toString().substr(0, 1024 - 15)));
    console.log('----------------------------');
  }
});
if (process.env.DEBUG) client.on("debug", console.log).on("ratelimit", console.log);
client.login()

{
  // doinkythederp's 100% secure security block for stuff because of circuit crashing the bot
  let token = process.env.DISCORD_TOKEN;
  let destroy = client.destroy;
  const messageEvent = client._events.message;
  client.destroy = (function() {
    console.log("client destroyed!");
    destroy.call(this);
    process.exit(0);
  });
  setInterval(() => {
    if (false) client.destroy();
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
        md.createRequire.toString = rqr(path).createRequire.toString.bind(createRequire);
        return md;
      }
      return rqr(path);
    });
    require.toString = rqr.toString.bind(rqr);
    return require
  }
  require = convertRequire(require);
}