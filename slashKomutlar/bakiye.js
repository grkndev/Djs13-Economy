const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas")
module.exports = {
  name: "bakiye",
  description: "Sizin veya başka bir kullanıcının bakiyesini kontrol edin",
  options: [
    {name:"kullanıcı",description:"Bakiyesini görmek istediğiniz kullanıcı",type:6}
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.options.getUser("kullanıcı") || interaction.member.user;
    const userData =
      (await User.findOne({ id: user.id })) || new User({ id: user.id });

    const balanceEmbed = new MessageEmbed()
      .setTitle(`${user.username}'s bakiye`)
      .setDescription("Talep edilen kullanıcının cüzdan ve banka bilgileri")
      .setColor("YELLOW")
      .setThumbnail(user.displayAvatarURL())
      .addField("• Cüzdan", `**\` ${userData.wallet} \`** 🪙`, true)
      .addField("• Banka", `**\` ${userData.bank} \`** 🪙`, true);

    return interaction.reply({
      embeds: [balanceEmbed],
    });
  },
};
