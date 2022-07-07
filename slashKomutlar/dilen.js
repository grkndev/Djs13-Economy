const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas");
const prettyMilliseconds = require("pretty-ms");
module.exports = {
  name: "dilen",
  description: "Para iste",
  options: [],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.member.user;
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });
    const embed = new MessageEmbed({ color: "YELLOW" });

    if (userData.cooldowns.beg > Date.now())
      return interaction.reply({
        embeds: [
          embed.setDescription(
            `⌛ Yeniden dilenmek için **\`${prettyMilliseconds(
              userData.cooldowns.beg - Date.now(),
              { verbose: true, secondsDecimalDigits: 0 }
            ).replace("minutes","dakika").replace("seconds","saniye")}\`** bekle`
          ),
        ],
        ephemeral: true,
      });

    const amount = Math.floor(
      (Math.round(10 / (Math.random() * 10 + 1)) * 10) / 2
    );

    if (amount <= 5) {
      userData.cooldowns.beg = Date.now() + 1000 * 60;
      userData.save();

      return interaction.reply({
        embeds: [
          embed.setDescription(
            "🥺 Bu sefer hiçbir şeyin yok, belki bir dahaki sefere çabalarsın?"
          ),
        ],
      });
    }

    userData.wallet += amount;
    userData.cooldowns.beg = Date.now() + 1000 * 60;
    userData.save();

    return interaction.reply({
      embeds: [
        embed.setDescription(`Dilendin ve \` ${amount} \` 🪙 kazandın`),
      ],
    });
  },
};
