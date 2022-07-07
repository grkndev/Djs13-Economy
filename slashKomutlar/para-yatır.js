const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "para-yatır",
  description: "Cüzdanınızdaki paranızı bankaya yatırın",
  options: [
    {
      name: "miktar",
      description: "Yatırmak istediğiniz miktar",
      type: 4,
      required: true,
      min_value: 100,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.member.user,
      amount = interaction.options.getIntager("miktar");
    (userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id })),
      (embed = new MessageEmbed({ color: "YELLOW" }));

    if (userData.wallet < amount)
      return interaction.reply({
        embeds: [
          embed.setDescription(
            `Para yatırmak için cüzdanınızda \` ${amount - userData.wallet} \` 🪙 daha fazlasına ihtiyacınız var`
          ),
        ],
        ephemeral: true,
      });

    userData.wallet -= amount;
    userData.bank += amount;
    userData.save();

    return interaction.reply({
      embeds: [
        embed.setDescription(
          `✅ Banka hesabınıza \` ${amount} \` 🪙 tutarı yatırdınız`
        ),
      ],
    });
  },
};
