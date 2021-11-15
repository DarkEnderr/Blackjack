const Discord = require('discord.js');
const Deck = require('../../utility/cardGames/deck');
const BlackjackHand = require('../../utility/cardGames/blackjack/blackjackHand');
const Cards = require('../../utility/cardGames/cards');
const BlackjackCards = [...Cards, ...Cards, ...Cards];
const GAME_TIME = 60000;
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;

module.exports = {
  name: 'blackjack',
  aliases: ['bj'],
  category: 'bj',
  run: async (client, message, args) => {


      const gameDeck = new Deck(BlackjackCards, true);
      const dealerHand = new BlackjackHand([gameDeck.drawCardOffTop(), gameDeck.drawCardOffTop()], true);
      const clientHand = new BlackjackHand([gameDeck.drawCardOffTop(), gameDeck.drawCardOffTop()], false);

      if (clientHand.getSumOfCards() === 21) {

      }

      const boardMsg = await message.channel.send({embed: clientHand.toGameboardEmbed(message.member.user, dealerHand, clientHand.getSumOfCards() === 21, true)});
      let gameTimeout = setTimeout(async () => {

        clientHand
          .addCard(gameDeck.drawCardOffTop())
          .addCard(gameDeck.drawCardOffTop())
          .addCard(gameDeck.drawCardOffTop())
          .addCard(gameDeck.drawCardOffTop())
          .addCard(gameDeck.drawCardOffTop())
          .addCard(gameDeck.drawCardOffTop());
        await boardMsg.edit({embed: clientHand.toGameboardEmbed(message.member.user, dealerHand, false, false)});
		betCollector.stop();
		resolve(amount * -1);
      }, GAME_TIME);

      const betCollector = new Discord.MessageCollector(
        message.channel,
        m => m.author.id === message.author.id,
        {time: GAME_TIME},
      );

      betCollector.on('collect', async msg => {
        let isStand = false;
        if(msg.content.toLowerCase() === 'hit'){
          clientHand.addCard(gameDeck.drawCardOffTop());
          await boardMsg.edit({embed: clientHand.toGameboardEmbed(msg.member.user, dealerHand, false, true)});
        }

        if(msg.content.toLowerCase() === 'stand' || msg.content.toLowerCase() === 'double'){
          if(msg.content.toLowerCase() === 'double' && dealerHand.cards.length === 2){
            clientHand.addCard(gameDeck.drawCardOffTop());
          }
          isStand = true;
          let dealerSum = dealerHand.getSumOfCards();
          while(dealerSum < 17){
            dealerHand.addCard(gameDeck.drawCardOffTop());
            dealerSum = dealerHand.getSumOfCards();
          }
          await boardMsg.edit({embed: clientHand.toGameboardEmbed(msg.member.user, dealerHand, true, false)});
        }

        const isWinner = clientHand.isWinner(dealerHand, isStand);
        if(isWinner === clientHand.BUST
          || isWinner === clientHand.TIE
          || isWinner === clientHand.BLACKJACK
          || isWinner === clientHand.WIN
          || isWinner === clientHand.LOSE){
          betCollector.stop();
          let embed = clientHand.toGameboardEmbed(msg.member.user, dealerHand, true, isWinner === clientHand.CONTINUEGAME);
          embed.description = embed.description.replace('`Won`');
          await boardMsg.edit({embed});

          clearTimeout(gameTimeout);

          if(isWinner === clientHand.TIE){
            return (0);
          }

          if(isWinner === clientHand.WIN
            || isWinner === clientHand.BLACKJACK){
          }

          if(isWinner === clientHand.BUST
            || isWinner === clientHand.LOSE){
          }
        }

        await boardMsg.edit({embed: clientHand.toGameboardEmbed(msg.member.user, dealerHand, false, isWinner === clientHand.CONTINUEGAME)});
      });
  },
}