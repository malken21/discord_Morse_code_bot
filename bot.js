
const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const Config = require("./Config.json")

const Morse_code = require("./Morse_code.json")


client.login(Config.TOKEN);

client.on('ready', () => {
  const data = [{
    name: "morse",
    description: "モールス信号 変換",
    options: [{
      type: "SUB_COMMAND",
      name: "encode",
      description: "文字をモールス信号へ変換",
      options: [{
        type: "STRING",
        name: "text",
        description: "変換する文章(英数字 空白 . , ? ! - / @ のみ)",
        required: true
      }]
    },
    {
      type: "SUB_COMMAND",
      name: "decode",
      description: "モールス信号を文字に変換",
      options: [{
        type: "STRING",
        name: "code",
        description: "モールス信号を入力してください",
        required: true
      }]
    }]
  }];
  client.application.commands.set(data, Config.ServerID);
  console.log(`login!!(${client.user.tag})`);
});


client.on("interactionCreate", interaction => {
  if (interaction.isCommand()) {

    if (interaction.commandName === "morse") {
      if (interaction.options.getSubcommand("") === "encode") {
        const text = interaction.options.getString(`text`);
        const code = Morse_encode(text);
        console.log(code);
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle("文字をモールス信号へ変換")
          .setDescription(`${code}`)
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      if (interaction.options.getSubcommand("") === "decode") {
        const text = interaction.options.getString(`code`);
        const code = Morse_decode(text);
        console.log(code);
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle("モールス信号を文字に変換")
          .setDescription(`${code}`)
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    }
  }
});


function Morse_encode(string) {
  string = string.toLowerCase().split("");
  let morse = "";
  for (let loop = 0; loop < string.length; loop++) {
    if (Morse_code[string[loop]] === undefined) return "英数字 空白 . , ? ! - / @ のみ対応しています";
    morse = morse + Morse_code[string[loop]];
  }
  return morse;
}

function Morse_decode(morse) {
  let string = "";
  morse = (morse + "　").split("　");
  for (let loop = 0; loop < morse.length; loop++) {
    let result = Object.keys(Morse_code).filter(k => { return Morse_code[k] == morse[loop] + "　" })[0];
    if (result === undefined) return "モールス信号を読み取れませんでした";
    string = string + result;
  }
  return string;
}