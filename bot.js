const botconfig = require("./botconfig.json");
const discord   = require("discord.js");

const bot = new discord.Client({disableEveryone: true});

bot.on("ready", async() => {
    console.log(bot.user.username + ' is online!');
    bot.user.setActivity("Wygryw hunting");
});

bot.on("message", async message =>{
    if(message.author.bot ||
       message.channel.name.toLowerCase() != "bragging") 
    {
        return;
    }

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];

    if(cmd === prefix + "Hej"  || 
       cmd === prefix + "Cześć"||
       cmd === prefix + "Witaj")

    {            
        return message.channel.send("No siem " + "<@" + message.author.id + ">");
    }    

    if(cmd === prefix + "botInfo")
    {
            let icon = message.guild.displayAvatarURL;
            let serverembed = new discord.RichEmbed();
            serverembed.setDescription("Bot do pilnowania statusów wygrywu ( 🔨 ) i przegrywu ( 🇫 ). Wy głosujecie przez emoji na kanale bragging, ja załatwiam resztę :)")
            serverembed.setColor("#ffa500")
            serverembed.setThumbnail(icon);

            return message.channel.send(serverembed);
    }

    message.awaitReactions(reaction => {

        let wygrywRole   = message.guild.roles.find('name', 'wygryw');
        let przegrywRole = message.guild.roles.find('name', 'przegryw');
        if(!message.member.hasPermission("MANAGE_ROLES")) return console.log("Brak uprawnień");
    
        if(reaction.count >= 4 && reaction.emoji.name == "🔨")
        {            
            message.author.send("Gratulacje, Twój aktualny status to wygryw !");
            message.member.addRole(wygrywRole);
            message.member.removeRole(przegrywRole);
            
        }
        else if(reaction.count >= 3 && reaction.emoji.name == "🇫")
        {
            message.author.send("Przykro mi, ale obecny Twój status to przegryw :(");
            message.member.addRole(przegrywRole);
            message.member.removeRole(wygrywRole);
        }
    });
});

bot.login(process.env.BOT_TOKEN);
