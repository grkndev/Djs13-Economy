const { MessageEmbed, Client, CommandInteraction } = require("discord.js");
const { User } = require("../utils/schemas")
const prettyMilliseconds = require('pretty-ms');

const jobs = [
    "🧑‍🏫 Öğretmen",
    "🧑‍⚕️ Doktor",
    "👮 Polis",
    "🧑‍🍳 Şef",
    "🧑‍🚒 İtfayeci",
    "🚌 Otobüs şöförü",
    "🧑‍🔬 Bilim Adamı",
    "📮 Postacı",
    "🧑‍🏭 Mühendis",
    "🧑‍🎨 Ressam",
    "🧑‍✈️ Pilot"
]
module.exports = {
  name: "çalış",
  description: "Bir işte çalışırsınız",
  options: [],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.member.user
    const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })

    if (userData.cooldowns.work > Date.now())
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("YELLOW")
                    .setDescription(`⌛ **\`${prettyMilliseconds(userData.cooldowns.work - Date.now(), { verbose: true, secondDecimalDigits: 0 }).replace("minutes","dakika").replace("seconds","saniye")}\`** içinde tekrar çalışabilirsiniz.`)
            ],
            ephemeral: true
        })

    const amount = Math.floor(Math.random() * (100 - 10 + 1)) + 10
    const job = jobs[Math.floor(Math.random() * jobs.length)]

    userData.wallet += amount
    userData.cooldowns.work = Date.now() + (1000 * 60 * 60)
    userData.save()

    const workEmbed = new MessageEmbed()
        .setDescription(`**\` ${job} \`** olarak çalıştınız ve \` ${amount} \` 🪙 kazandınız`)
        .setColor("YELLOW")

    return interaction.reply({ embeds: [workEmbed] })
  },
};
