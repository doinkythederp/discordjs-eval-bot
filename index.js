//These first few lines are for running express server.
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) =>
	res.send(
		'The bot now has a server running.<br><a href="/refresh"><button>Refresh</button></a>'
	)
);
app.get('/refresh', (req, res) => {
	console.log('Restarting from web.');
	res.send(
		"Bot refreshed!<script>setTimeout(() => location.href = '/', 1000);</script>"
	);
	client.destroy();
});

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`)
);

// Bot code begins here.
const Discord = require('discord.js');
const client = new Discord.Client({
	intents: [
		'GUILDS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_INTEGRATIONS',
		'GUILD_WEBHOOKS',
		'GUILD_INVITES',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'GUILD_MESSAGE_TYPING',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS',
		'DIRECT_MESSAGE_TYPING'
	],
	rejectOnRateLimit: ['/']
});
const fetch = require('node-fetch');
const fs = require('fs');
var prefix = ';';
client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	{
		// doinkythederp's 100% secure security block for stuff because of circuit crashing the bot
		let token = process.env.DISCORD_TOKEN;
		let destroy = client.destroy;
		client.destroy = function() {
			console.log('client destroyed!');
			destroy.call(this);
			process.exit(0);
		};
		setInterval(() => {
			if (!client._events.messageCreate || client.token !== token) process.exit();
		}, 1000);
		function convertRequire(require) {
			let rqr = require;
			require = function(path) {
				if (
					path === 'child_process' ||
					path === 'node:child_process' ||
					path === 'node:cluster' ||
					path === 'cluster'
				)
					throw 'bad code big no no';
				if (path === 'module' || path === 'node:module') {
					let md = rqr(path);
					md.createRequire = function() {
						throw 'bad code big no no';
					};
					md.createRequire.toString = rqr(path).createRequire.toString.bind(
						createRequire
					);
					return md;
				}
				return rqr(path);
			};
			require.toString = rqr.toString.bind(rqr);
			return require;
		}
		require = convertRequire(require);
		module.require = convertRequire(module.require);
	}
	try {
	await (await client.channels.fetch('795366538370088973')).send('Bot refreshed!');
	} catch {}
});
const vm = require('vm');
const child_process = require('child_process');

client.on('messageCreate', async message => {
	const thisBotSucks = 'no it does not';
	const LeSirH = '1';
	const GGB = '1';
	const mentionuser = '<@!' + message.author.id + '> ';
	const content = message.content;
	const messagelink = message.guild
		? 'https://discord.com/channels/' +
		  message.guild.id +
		  '/' +
		  message.channel.id +
		  '/' +
		  message.id
		: undefined;
	const helpEmbed = new Discord.MessageEmbed()
		.setTitle('Discord.js Eval Bot')
		.setDescription('My prefix is `' + prefix + '`')
		.addField('**' + prefix + 'ping**', 'Shows latency of bot.')
		.addField(
			'**' + prefix + 'refresh** / **' + prefix + 'restart**',
			'Terminates all processess of the bot, clears cache and specified variables.'
		)
		.addField(
			'**' + prefix + 'eval <code>**',
			'Command to evaluate code you input. Javascript only!'
		)
		.addField('**' + prefix + 'version**', "Displays the bot's current version")
		.setColor('#000000');

	// Ping command
	if (content.startsWith(prefix + 'ping')) {
		const latency = Date.now() - message.createdTimestamp;
		const api = Math.round(client.ws.ping);
		const pingInfo = new Discord.MessageEmbed()
			.setDescription(
				mentionuser +
					' [Pong!](' +
					messagelink +
					')' +
					'\n**Latency:** ' +
					latency +
					'ms' +
					'\n' +
					'**API:** ' +
					api +
					'ms'
			)
			.setColor('#000000');
		message.channel.send({ embeds: [pingInfo] });
	}

	if (
		content.startsWith(prefix + 'refresh') ||
		content.startsWith(prefix + 'restart')
	) {
		console.log('Restarting from command.');
		message.react('830234314691575848').finally(client.destroy);
	}

	if (content.startsWith(prefix + 'version')) {
		const versionEmbed = new Discord.MessageEmbed()
			.setTitle('Discord.js Eval Bot v6')
			.setDescription(
				'Originally made by GoodGradesBoy#9166, the bot was forked, and is now maintained by doinkythederp#6523 primarily for use in the sudo-server Discord'
			)
			.addField('**v6.1-doinkythederp**', '- Adds `setPrefix`')
			.addField(
				'**v6-doinkythederp**',
				'Version 6 focuses on providing more security when evaluating.\n\n- Infinite loops no more! `while (1) {}` no longer crashes the bot.\n- More globals: `fetch`, `encodev8`, and `decodev8` are now accessable from anywhere.\n- Destroying the client no longer kills the bot, and triggers a restart.\n- `child_process` and `cluster` have been disabled.\n- Eval times are now accurate.'
			)
			.setColor('#000000');
		message.channel.send({ embeds: [versionEmbed] });
	}

	if (
		content.startsWith(prefix + 'help') ||
		content.startsWith('<@!' + client.user.id + '>')
	) {
		message.channel.send({ embeds: [helpEmbed] });
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

		let filter = func.toString();
		if (
			filter.includes('token') ||
			filter.includes('concat') ||
			filter.includes('import')
		) {
			evl = 'bad code big no no';
		} else {
			const context = vm.createContext(
				{
					Discord,
					client,
					fetch,
					message,
					args,
					prefix,
					setPrefix(v) {
						prefix = v;
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
					encodev8: require('v8').serialize,
					decodev8: require('v8').deserialize,
					process,
					console,
					require,
					module,
					__dirname,
					__filename,
					queueMicrotask() {
						throw 'queueMicrotask is disabled in this environment. Please use Promises instead.';
					},
					mentionuser,
					LeSirH,
					GGB,
					messagelink,
					content,
					Buffer,
					URL,
					URLSearchParams,
					npmInstall(what) {
						if (message.author.id !== '720347983052275715') return null;
						return child_process.execSync('npm i --no-save ' + what).toString();
					}
				},
				{ microtaskMode: 'afterEvaluate' }
			);

			try {
				evl = vm.runInContext(func, context, {
					filename: 'eval',
					timeout: 5000
				});
			} catch (e) {
				evl = e;
				failed = true;
			}
		}

		const exetime = Date.now() - timestamp;

		const evalEmbed = new Discord.MessageEmbed()
			.setColor('#000000')
			.addField(
				'Input',
				'```js\n' +
					args
						.slice(1)
						.join(' ')
						.substr(0, 1024 - 15) +
					'\n```'
			)
			.addField(
				'Output',
				'```js\n' +
					(!failed
						? require('util')
								.inspect(evl)
								.substr(0, 1024 - 15)
						: evl.toString().substr(0, 1024 - 12)) +
					'\n```'
			)
			.setFooter(
				!failed
					? 'Time to execute: ' + exetime + 'ms'
					: 'Stopped due to uncaught error: ' + exetime + 'ms'
			);
		message.channel.send({ embeds: [evalEmbed] });

		console.log(message.author.tag + ' Server: ' + message.guild?.name);
		console.log(
			message.author.tag +
				' 𝙄𝙉𝙋𝙐𝙏   ' +
				args
					.slice(1)
					.join(' ')
					.substr(0, 1024 - 15)
					.replace(/\n/g, '\n... ')
		);
		console.log(
			message.author.tag +
				' 𝙊𝙐𝙏𝙋𝙐𝙏  ' +
				(!failed
					? require('util')
							.inspect(evl)
							.substr(0, 1024 - 15)
							.replace(/\n/g, '\n... ')
					: evl.toString().substr(0, 1024 - 15))
		);
		console.log('----------------------------');
	}
});
if (process.env.DEBUG)
	client.on('debug', console.log).on('ratelimit', console.log);
client.login();
