const {
  MessageEmbed,
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const Shop = require("../utils/shop");
module.exports = {
  name: "mağaza",
  description: "Mazağayı Gösterir",
  options: [],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    let urunler = await Shop.find();
    let optins = [];
    let embed = new MessageEmbed()
      .setTitle("Mağaza")
      .setDescription(
        `En çok beğenilen ürünler aşağıda sırlanmıştır. Dilersen onun yenine menüden seçim yapabilirsin`
      )
      .setColor("GOLD");
      urunler.sort((a, b) => b.balance - a.balance).forEach((x) => {
        optins.push({
          label: `${x.name} - Ücret: ${x.balance}`,
          value: `${x.id}`,
          emoji: "<a:star5:761479712743620608>",
        });

      });
    urunler.sort((a, b) => b.balance - a.balance).slice(0, 9).forEach((x) => {
      embed.addField(
        x.name,
        `${x.balance} 🪙\nÜrün Kodu: ${x.id}`,
        true
      );
    });
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("urunler")
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder("Görmek istediğiniz ürünü seçin")
        .setOptions(optins)
    );
    interaction.reply({ embeds: [embed], components: [row] });
  },
};
