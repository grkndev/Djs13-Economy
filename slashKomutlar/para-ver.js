const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas");
const { botOwner } = require("../ayarlar.json");
module.exports = {
  name: "para-ver",
  description: "Kullanıcıya Para Verir",
  options: [
    {
      name: "kullanıcı_id",
      description: "Kullanıcı IDsi",
      type: 3,
      required: true,
    },
    {
      name: "miktar",
      description: "Vermek istediğiniz miktar",
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
    if(interaction.member.id !== botOwner) return interaction.reply({content:"Bu komutu kullanmak için Bot Sahibi Olmazsınız",ephemeral:true})
    let userId = interaction.options.getString("kullanıcı_id");
    let amount = interaction.options.getInteger("miktar");
    if (!client.users.fetch(userId))
      return interaction.reply({
        embeds: [
          { title: "Sistemde böyle bir kullanıcı bulamıyorum", color: "RED" },
        ],
      });
    const embed = new MessageEmbed({ color: "YELLOW" });
    const userData =
      (await User.findOne({ id: userId })) || new User({ id: userId });
      userData.wallet += amount;
    userData.save();
    return interaction.reply({
      embeds: [
        embed.setDescription(
          `✅ Kullanıcı hesabınıza \` ${amount} \` 🪙 tutar para eklendi`
        ),
      ],
    });
  },
};
