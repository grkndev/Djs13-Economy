const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas");
module.exports = {
  name: "envanterim",
  description: "Sahip olduğunuz envanterleri gösterir",
  options: [],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.member.user;
    let total = 0;
    let options = [];
    const userData = (await User.findOne({ id: user.id })) || new User({ id: user.id });
    const embed = new MessageEmbed().setColor("YELLOW").setAuthor({name:`${user.tag} kişisinin envanteri`,iconURL:user.avatarURL({dynamic:true})})
    const products = userData.products.sort((a, b) => b.balance - a.balance);
    if(!products.length || products.length <= 0) return interaction.reply({embeds:[{title:"Envanteriniz Boş", description:"Envanterinizde hiçbir ürün bulunmamaktadır."}]});
    products.forEach(x => {
      total += x.balance;
      options.push({
        label: `${x.name} - Ücret: ${x.balance}`,
        value: `${x.id}`,
        emoji: "<a:star5:761479712743620608>",
      });
    })
    products.slice(0, 9).forEach(x => {
      embed.addField(x.name, `Ücret: ${x.balance}\nürün kodu: ${x.id}`,true);
    })
    embed.setFooter({text: `Envanter Değeri: ${total} 💰`, iconURL: user.avatarURL({dynamic:true})});
    interaction.reply({embeds:[embed]});
  },
};
