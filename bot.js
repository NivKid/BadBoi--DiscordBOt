const Discord = require("discord.js");
const bot = new Discord.Client();
const YTDL = require("ytdl-core");
const YT = require('simple-youtube-api');
const db = require('./dbconnection').db

//////////////////////////////credentials///////////////////////////////////////////////////

const youtube = new YT('AIzaSyA-a1ZXdrzITTHnuc9TLF7wwfC9WehrM5w');

bot.login('Mzk2NzE5Nzk0NjcxNDUyMTcx.DSob4A.l-LGwUqypCad-1JoZeNMfH5EQd0');


////////////////////////////////functions////////////////////////////////////////////////////

function play(connection,message){
    var server = servers[message.guild.id];

    server.dispatcher= connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();
    server.dispatcher.on('end', function() {
        if(server.queue[0]) play(connection,message);
        else connection.disconnect();
    });
}

function searchvideo(message,name,choice){
    var title = {};
    var surl = {};
    
    if(choice==null)
        {
            youtube.search(name,4).then(results => {
            for(var i=0;i<4;i++)
            {   
                var insertQuery = "INSERT INTO songselection(no, title, url) VALUES ('"+(i+1)+"','"+results[i].title+"', '"+results[i].url+"');"
                db.any(insertQuery);


                title[i]=results[i].title;
                console.log('searchtitle:' + title[i]);
                surl[i]=results[i].url;
                console.log('searchurl:' + surl[i]);
            }
            var embed = new Discord.RichEmbed()
                .addField('1. '+results[0].title,results[0].url)
                .addField('2. '+results[1].title,results[1].url)
                .addField('3. '+results[2].title,results[2].url)
                .addField('4. '+results[3].title,results[3].url)
            message.channel.sendEmbed(embed);
            });
            message.channel.sendMessage('select your song ( do: ' +prefix+'<1-4>');
        }
    else
        {   console.log('choiceurl:' + surl[1]);
            return(surl[choice]);
        }  
}




///////////////////////////////////////////////////////////////////////////////////////////////


bot.on('ready', () => {
  console.log('ready!');
});


var prefix = '$';

var fortunes = ['Yes','No',"May be","fucc you"];

var servers = {};


var selection = null;

bot.on('message',message => {
    if(message.author == bot.user) return;

    var msg = message.content;
    var msgc= message.channel;
    console.log('msg:' + msg);
    console.log(msg[0]);

    var args =msg.substring(prefix.length).split(" ");
    console.log('args:' + args);
    var url = msg.substring(prefix.length).split(/ (.+)/)[1];
    console.log('url:' + url);

    if(msg.startsWith(prefix))
        {           console.log('inside prefix');

            if(!isNaN(args[0]))
                {
                    console.log('is a number');
                    if(1<=args[0]<=4) 
                        {   
                            selection=args[0];
                            console.log('selection:' + selection);     
                            url = searchvideo(message,url,selection);
                            args[0]='play';
                            args[1]=url;
                            selection=null;
                        }
                    else {
                            msgc.sendMessage('1,2,3 or 4 only u fking idiot!');
                            return;
                          }

                }

            switch(args[0].toLowerCase())
                    {
                        case 'test' :       message.channel.sendMessage('pass');
                        break;
                        case 'oboi' : 
                                            if(args[1]) msgc.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
                                            else msgc.sendMessage('cant read that :/');
                        break;
                        case 'mentionme' :  msgc.sendMessage(message.author.toString() + 'heya nigga!');
                        break;
                        
                        case 'play':
                                            if(!args[1]){
                                                msgc.sendMessage("please provide a link/title");
                                                return;
                                            }

                                            if(!message.member.voiceChannel){
                                                msgc.sendMessage('you must be in a voice channel');
                                                return;
                                            }


                                            if(!url.startsWith('https://www.youtube.com/watch?v='))
                                                {   
                                                    searchvideo(message,url,selection);
                                                }

                                            if(!servers[message.guild.id]) {
                                                servers[message.guild.id] = { queue: [] };
                                            }

                                            var server = servers[message.guild.id];

                                            server.queue.push(url);

                                            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                                                play(connection, message);
                                            });
                        break;

                        case 'skip':        
                                            var server = servers[message.guild.id];

                                            if (server.dispatcher) server.dispatcher.end();
                        break;

                        case 'stop' :
                                            var server = servers[message.guild.id];

                                            if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
                        break;

                        case 'p' :
                        case 'pause' :      
                                            var server = servers[message.guild.id];
                                            if(message.guild.voiceConnection) server.dispatcher.pause();
                        break;

                        case 'r' :
                        case 'resume' :
                                             var server = servers[message.guild.id];
                                            if(message.guild.voiceConnection) server.dispatcher.resume();
                        break;

        



                        default:            message.channel.sendMessage('invalid command'); 



                    }

               
        }         
    else
        {   switch(msg)
                    {
                        case 'whos noob?':   message.channel.sendMessage('you!');
                        break;
                        case 'hi':
                        case 'hey':          message.channel.sendMessage('fucc you');
                        break;
                        case 'fuck you':
                        case 'fu':           message.channel.sendMessage('go fucc yourself!');
                        break;

                    }
              
        }
});


       

