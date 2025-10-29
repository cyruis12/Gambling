// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const BALANCE_FILE = './balances.json';

// Load or initialize balances
let balances = {};
if (fs.existsSync(BALANCE_FILE)) {
  try { balances = JSON.parse(fs.readFileSync(BALANCE_FILE)); } catch(e){ balances = {}; }
}

function saveBalances(){ fs.writeFileSync(BALANCE_FILE, JSON.stringify(balances, null, 2)); }

client.on('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const userId = interaction.user.id;
  if (!balances[userId]) balances[userId] = 10000; // starting coins

  const bet = interaction.options.getInteger('amount');

  // Coinflip
  if (interaction.commandName === 'coinflip') {
    if (!bet || bet <= 0) return interaction.reply({ content:'Enter a valid amount.', ephemeral:true });
    if (bet > balances[userId]) return interaction.reply({ content:"You don't have enough coins.", ephemeral:true });
    const win = Math.random() < 0.5;
    balances[userId] += win ? bet : -bet;
    saveBalances();
    return interaction.reply(`You bet **${bet}** and ${win?'won':'lost'}! Balance: **${balances[userId]}**`);
  }

  // Slots
  if (interaction.commandName === 'slots') {
    if (!bet || bet <= 0) return interaction.reply({ content:'Enter a valid amount.', ephemeral:true });
    if (bet > balances[userId]) return interaction.reply({ content:"You don't have enough coins.", ephemeral:true });
    const symbols = ['🍒','🍋','🍊','🍇','⭐','💎'];
    const r = ()=>symbols[Math.floor(Math.random()*symbols.length)];
    const res = [r(),r(),r()];
    const win = res[0]===res[1] && res[1]===res[2];
    balances[userId] += win ? bet*3 : -bet;
    saveBalances();
    return interaction.reply(`${res.join(' ')}\nYou ${win?'won':'lost'} **${bet}**. Balance: **${balances[userId]}**`);
  }

  // Dice
  if (interaction.commandName === 'dice') {
    if (!bet || bet <= 0) return interaction.reply({ content:'Enter a valid amount.', ephemeral:true });
    if (bet > balances[userId]) return interaction.reply({ content:"You don't have enough coins.", ephemeral:true });
    const roll = Math.floor(Math.random()*6)+1;
    const win = roll >=4;
    balances[userId] += win ? bet : -bet;
    saveBalances();
    return interaction.reply(`You rolled **${roll}**\nYou ${win?'won':'lost'} **${bet}**. Balance: **${balances[userId]}**`);
  }

  // Roulette
  if (interaction.commandName === 'roulette') {
    if (!bet || bet <= 0) return interaction.reply({ content:'Enter a valid amount.', ephemeral:true });
    if (bet > balances[userId]) return interaction.reply({ content:"You don't have enough coins.", ephemeral:true });
    const roll = Math.floor(Math.random()*36); // 0-35
    const win = roll % 2 === 0; // simple even/odd win
    balances[userId] += win ? bet*2 : -bet;
    saveBalances();
    return interaction.reply(`Roulette rolled **${roll}**\nYou ${win?'won':'lost'} **${bet}**. Balance: **${balances[userId]}**`);
  }

  // Balance check
  if (interaction.commandName === 'balance') {
    return interaction.reply(`Your balance: **${balances[userId]}** coins`);
  }
});

client.login(TOKEN);
