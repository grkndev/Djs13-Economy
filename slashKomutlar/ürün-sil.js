const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const Shop = require("../utils/shop");
const { botOwner } = require("../ayarlar.json");
module.exports = {
  name: "ürün-sil",
  description: "Sisteme ürün günellersiniz",
  options: [
    {
      name: "ürün-kodu",
      description: "Günceelenicek olan ürünün kodu",
      type: 4,
      required: true,
    }
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    if(interaction.member.id !== botOwner) return interaction.reply({embeds:[{title:"Hata", description:"Bu komut bot sahibine özeldir"}], ephemeral:true});
    let urun_kod = interaction.options.getIntager("ürün-kodu");
    let data = await Shop.findOne({ id: urun_kod });
    if (!data)
      return interaction.reply({
        embeds: [
          {
            title: "Ürün Bulunamadı",
            description: "Belirtilen ürün koduna ait ürün bulunamadı",
          },
        ],
      });
    await Shop.deleteOne({ id: urun_kod });
    interaction.reply({
      embeds: [
        {
          title: "Ürün Silindi",
          fields: [
            { name: "Ürün Kodu", value: `${urun_kod}`, inline: true },
          ],
        },
      ],
    });
  },
};
