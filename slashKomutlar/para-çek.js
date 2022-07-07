const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "para-çek",
  description: "Bankanızdan para çekin",
  options: [{name:"miktar",description:"Çekmek istediğiniz miktar",type:4,required:true,min_value:100}],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.member.user,
        amount = interaction.options.getInteger("miktar")
        userData = await User.findOne({ id: user.id }) || new User({ id: user.id }),
        embed = new MessageEmbed({ color: "YELLOW" })

        if (userData.bank < amount) return interaction.reply({
            embeds: [ embed.setDescription(`💰 Para çekmek için banka hesabınızda \` ${amount - userData.bank} \` 🪙 daha fazlasına ihtiyacınız var`) ],
            ephemeral: true
        })

        userData.bank -= amount
        userData.wallet += amount
        userData.save()

        return interaction.reply({
            embeds: [ embed.setDescription(`✅ Banka hesabınızdan \` ${amount} \` 🪙 tutarını çektiniz`) ]
        })
  },
};
