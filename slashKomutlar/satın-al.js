const { User } = require("../utils/schemas");
const shop  = require("../utils/shop");
const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
module.exports = {
  name: "satın-al",
  description: "Belirtilen Ürünü Satın Alırsınız",
  options: [{name:"ürün-kodu", description:"Satın Alınacak Ürünün Kodu", type:4, required:true}],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    let urun_kod = interaction.options.getInteger("ürün-kodu");
    let user = interaction.member.user;
    let data = await shop.findOne({ id: urun_kod }) || null;
    if (!data) return interaction.reply({embeds:[{title:"Ürün Bulunamadı", description:"Belirtilen ürün koduna ait ürün bulunamadı"}]});
    const userData = (await User.findOne({ id: user.id })) || new User({ id: user.id });
    if(userData.wallet < data.balance) return interaction.reply({embeds:[{title:"Hata", description:"Bakiye yetersiz"}]});
    await User.updateOne({ id: user.id }, {$inc:{ wallet: -data.balance}, $push:{ products: data }});

    interaction.reply({embeds:[{title:"Ürün Satın Alındı", fields:[{name:"Ürün Adı", value:`${data.name}`}, {name:"Ücret", value:`${data.balance}`}]}]});
  },
};
