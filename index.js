const Discord = require("discord.js");

var bot = new Discord.Client();

var prefix = ("!")

bot.on("ready", function() {
    bot.user.setGame("ModoSchool");
    console.log("Le bot a bien était connecté !");
});

bot.on('message', function (message) {
    if (message.content === '!ping') {
        message.channel.send('pong !')
    }
});

bot.on('guildMemberAdd', member => {
    var role = member.guild.roles.find('name', 'Visiteur');
    member.addRole(role)
})

bot.on('guildMemberAdd', member => {
    var bvn_embed = new Discord.RichEmbed()
    .setColor('#E81414')
    .setImage(member.user.displayAvatarURL)
    .addField("Bienvenue", `Bienvenue ${member} sur le serveur Medieval Chat ! Nous somme actuellement ${member.guild.memberCount} membres !`)
    .setFooter(`${member.user.username}`)
    .setTimestamp()
    member.guild.channels.find("name", "🙆bienvenue🙆").send(bvn_embed)
})

bot.on('guildMemberRemove', member => {
    message.guild.channels.find("name", "🙇aurevoir🙇").send(`Oh non ! ${member.user.username} vient de quitter le serveur !`)
})

bot.on('message',(message)=>{
    if(message.content == "!help") {
    var embed = new Discord.RichEmbed()
    .addField("!help","affiche les commandes du bot.")
    .addField("!kick","Permet de kick un joueur du serveur Discord.")
    .addField("!ban", "Permet de bannir un Joueur du serveur Discord.")
    .addField("!ping", "Joue au Ping-Pong avec le bot !")
    .addField("!membres", "Permet de savoir combien de joueurs sont inscrit sur le serveur.")
    .addField("!createur", "Permet de savoir qui est le créateur de ce bot.")
    .setColor("D7F705")
    .setTitle("Guide Commandes !")
    .setFooter ("(Utile si tu as courtes mémoire ! x) ")
    message.channel.send(embed)
    }
    })

bot.on('message', (message)=>{
    if (message.content == "!createur") {
        message.reply(`Le créateur de ce bot est Ygroxie#6856 !`)
    }
})

bot.on('message',(message)=>{
    if (message.content == "!membres") {
        message.reply(`Nous sommes actuellement ${member.guild.memberCount} membres sur le discord.`)
    }
})

bot.on('message', message => {
    let command = message.content.split(" ")[0];
    const args = message.content.slice(prefix.length).split(/ +/);
    command = args.shift().toLowerCase();

    if (command === "kick") {
        if(!message.channel.permissionsFor(message.member).hasPermission("KICK_MEMBERS")) {
            return message.reply("Tu n'as pas la permission de faire cette commande. Désolé !").catch(console.error);
        }
        if(message.mentions.users.size === 0) {
            return message.reply("Merci de mentionner l'utilisateur à expulser.").catch(console.error);
        }
        let kickMember = message.guild.member(message.mentions.users.first());
        if(!kickMember) {
            return message.reply("Cet utilisateur est introuvable ou impossible à expulser")
        }
        if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
            return message.reply("Je n'ai pas la permission KICK_MEMBERS pour faire ceci.").catch(console.error);
        }
        kickMember.kick().then(member => {
            message.reply(`${member.user} a été expulsé avec succès !`).catch(console.error);
            message.guild.channels.find("name", "🗂logduserveur🗂").send(`**${member.user.username} a été expulsé du discord par **${message.author.username}**`);
        }).catch(console.error)
        
}

if (command === "ban") {
    if (!message.channel.permissionsFor(message.member).hasPermission("BAN_MEMBERS")) {
        return message.reply("Tu n'as pas la permission de faire cette commande. Désolé !").catch(console.error);
    }
    const member = message.mentions.members.first();
    if (!member) return message.reply("Merci de mentionner l'utilisateur à bannir.");
    member.ban().then(member => {
        message.reply(`${member.user} a été banni avec succès !`).catch(console.error);
        message.guild.channels.find("name", "🗂logduserveur🗂").send(`**${member.user.username}** a été banni du discord par **${message.author.username}**`);
    }).catch(console.error)
}})


bot.login(process.env.TOKEN)