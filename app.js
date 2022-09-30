require('dotenv').config();

const { Client, Intents} = require('discord.js');

const Alpaca = require('@alpacahq/alpaca-trade-api');

const PREFIX = '$';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

const { MessageEmbed } = require('discord.js');

client.once('ready', () => {
	console.log('Ready!');
});

const alpaca = new Alpaca({
    keyId: process.env.ALPACA_KEY_ID,
    secretKey: process.env.ALPACA_KEY_SECRET,
    paper: true,
  })

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;


    if (message.content.startsWith(PREFIX)){
        
      const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);


        if (CMD_NAME === 'last_price') {

            const trade = await alpaca.getLatestTrade(args[0]);
            console.log(trade);
            message.channel.send(JSON.stringify(trade.Price));


        }else if(CMD_NAME === 'account'){

            

            alpaca.getAccount().then((account) => {

                // inside a command, event listener, etc.
                const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Account Status')
                .setURL('https://discord.js.org/')
                .setAuthor({ name: 'Trade Bot', iconURL: 'https://imgur.com/1diwxmy.png', url: 'https://discord.js.org' })
                .setDescription('This is the description of your account')
                .setThumbnail('https://imgur.com/1diwxmy.png')
                .addFields(
                    { name: 'Cash', value: account.cash },
                    { name: 'Curency', value: account.currency, inline: true },
                     //{ name: '\u200B', value: '\u200B' },
                     { name: 'Portfolio Value', value: account.portfolio_value, inline: true },
                     { name: 'Buying Power', value: account.buying_power, inline: true },
                )

                .setImage('https://imgur.com/e2GFQPH.png')
                .setTimestamp();

                message.channel.send({ embeds: [exampleEmbed] });



            });


        }else if(CMD_NAME === 'buy'){

            alpaca.createOrder({
                symbol: args[0],
                qty: args[1],
                side: 'buy',
                type: 'market',
                time_in_force: 'day'
            });

            const trade = await alpaca.getLatestTrade(args[0]);
       //     var val = parseInt(args[1])*parseInt(trade);
            // inside a command, event listener, etc.
            const example = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Payment Recipt')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: 'Trade Bot', iconURL: 'https://imgur.com/1diwxmy.png', url: 'https://discord.js.org' })
            .setDescription('Thank you for payment')
            .setThumbnail('https://imgur.com/1diwxmy.png')
            .addFields(
          
            { name: 'Stock Symbol', value: args[0] },
            { name: 'Quantity', value: args[1], inline: true },
            // //{ name: '\u200B', value: '\u200B' },
           // { name: 'Total Cost', value: val.toString() , inline: true },
          //  { name: 'Account Balance', value: alpaca.getAccount().buying_power, inline: true },
            )

            .setImage('https://imgur.com/e2GFQPH.png')
            .setTimestamp();

            message.channel.send({ embeds: [example] });

        }else if(CMD_NAME === 'news'){

            const news = await alpaca.getNews({ });
            //Check https://github.com/alpacahq/alpaca-trade-api-js/blob/687e58c8ff03cc70b56fc57844d78ca7801e0f85/lib/resources/datav2/rest_v2.ts#L714
            
            for(let i = 0; i< news.length ; i++){
         
               
                if(news[i].Symbols.includes(args[0])){
                    const example = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('News')
                    .setURL('https://discord.js.org/')
                    .setAuthor({ name: 'Trade Bot', iconURL: 'https://imgur.com/1diwxmy.png', url: 'https://discord.js.org' })
                    .setDescription('Here is the latest news about your stock')
                    .setThumbnail('https://imgur.com/1diwxmy.png')
                    .addFields(
           
                    { name: 'Author', value: news[i].Author },
                    { name: 'HeadLine', value: news[i].Headline, inline: true },
                 
                    { name: 'Source', value: news[i].Source  },
                    { name: 'Summary', value: news[i].Summary  },
                    { name: 'URL', value: news[i].URL}
          
                    )
                    .setImage('https://imgur.com/e2GFQPH.png')
                    .setTimestamp();
                    message.channel.send({ embeds: [example] }); 
                }
                     


              

                }
           
        }else if(CMD_NAME === 'hemlo') {
            console.log("test 1212");
            message.channel.send('HAHAHAHAHAHAHA!');
        }
    }
    
});


client.login(process.env.DISCORD_TOKEN);