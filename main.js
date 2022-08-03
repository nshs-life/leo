//required classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const { token } = require('./config.json');

//create client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages]});

//creating commands collection and locating files in commands folder
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//adding commands to collection
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

//getting the command (whatever the user types) from client.commands Collection
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//adding roles to new members
client.on('guildMemberAdd', member =>{

    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome");
    if(!channel) return;

    channel.send(`Welcome to nshs, ${member}, please read the rules in the info channel!`)
	member.roles.add(member.guild.roles.cache.get('1004509586142806087'))

	const Embed = new EmbedBuilder()
		.setThumbnail(client.user.displayAvatarURL())
		.setTitle('Welcome to nshs.life!')
		.setColor(0x18e1ee)
		.addFields({ name: 'Our Mission', value: '[mission.nshs.life](https://docs.google.com/document/u/5/d/e/2PACX-1vToUA9QApqWmo_k5YGaouh1-FexC5tqLzUIZv6fJZGneyBZwM_ImYNDzraq3mT5FzQVS_EGC7Kdk_Oj/pub)'})
		.addFields({ name: 'Join Requirement', value: 'Please enter your school LASID'});

		member.send({ embeds: [Embed] })
})


client.login(token);
