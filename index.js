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


const setupCMD = "!verif"
let initialMessage = `**Salut ! 
Désolé pour le dérangement mais il va falloir que tu réagisses avec le :white_check_mark: pour pouvoir voir le reste des salons ! **`;
const roles = ["Joueur"];
const reactions = ["💻"];

//If there isn't a reaction for every role, scold the user!
if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";

//Function to generate the role messages, based on your settings
function generateMessages(){
    var messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`React below to get the **"${role}"** role!`); //DONT CHANGE THIS   
    return messages;
}


bot.on("message", message => {
    if (message.author.id == 354243654224969728 && message.content.toLowerCase() == setupCMD){
        var toSend = generateMessages();
        let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
        for (let mapObj of mappedArray){
            message.channel.send(mapObj[0]).then( sent => {
                if (mapObj[1]){
                  sent.react(mapObj[1]);  
                } 
            });
        }
    }
})


bot.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
        
        let channel = bot.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
        let user = msg.guild.members.get(event.d.user_id);
        
        if (msg.author.id == bot.user.id && msg.content != initialMessage){
       
            var re = `\\*\\*"(.+)?(?="\\*\\*)`;
            var role = msg.content.match(re)[1];
        
            if (user.id != bot.user.id){
                var roleObj = msg.guild.roles.find(r => r.name === role);
                var memberObj = msg.guild.members.get(user.id);
                
                if (event.t === "MESSAGE_REACTION_ADD"){
                    memberObj.addRole(roleObj)
                    memberObj.removeRole(name, "Visiteur")
                } else {
                    memberObj.removeRole(roleObj)
                    memberObj.addrole(name, "Visiteur");
                }
            }
        }
        })
 
    }   
});



bot.login(process.env.TOKEN)