// deploy-commands.js
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = [
  new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin and gamble an amount')
    .addIntegerOption(opt=>opt.setName('amount').setDescription('Amount to bet').setRequired(true)),

  new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Play slots and gamble an amount')
    .addIntegerOption(opt=>opt.setName('amount').setDescription('Amount to bet').setRequired(true)),

  new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll a dice and gamble an amount')
    .addIntegerOption(opt=>opt.setName('amount').setDescription('Amount to bet').setRequired(true)),

  new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('Play roulette and gamble an amount')
    .addIntegerOption(opt=>opt.setName('amount').setDescription('Amount to bet').setRequired(true)),

  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your coin balance')
].map(c=>c.toJSON());

(async()=>{
  try{
    console.log('Registering commands...');
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
    console.log('Commands registered.');
  } catch(e){ console.error(e); process.exit(1); }
})();
