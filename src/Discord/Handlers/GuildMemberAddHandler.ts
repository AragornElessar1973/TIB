import { Role } from "discord.js";
import { Client, GuildMember } from "discord.js";
import CacheClient from "../../Cache/Cache";
import { Discord_Contributor_Role_Id, Discord_Member_Role_Id } from "../../Config";
import Logger from "../../Lib/Logger";
    
const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

export default async function GuildMemberAddHandler(client: Client, member: GuildMember)
{
    
    try {

        // Get default role
        let role = await member.guild.roles.cache.find(e => e.id === Discord_Member_Role_Id) as Role;

        if (role === undefined) {
            console.log(`"User" role not found in this server.`);
        } else if (member.user.bot) {
            console.log("A bot joined the server, no roles added.");
        } else {
            // Give the user the default role.
            member.roles.add(role);
        }

        // stores the welcome channel or undefined as variable.
        const welcomeChannel = member.guild.channels.cache.find((channel) =>
            channel.name.includes("welcome")
        );

        // returns if there is no welcome channel.
        if (welcomeChannel === undefined) {
            console.log("No welcome channel found.");
            return;

            // sends embed (welcome message) in welcome channel.
        } else {
            // image manipulation using Canvas

            // pass entire canvas object to access width and context.
            const applyText = (canvas, text) => {
                const context = canvas.getContext("2d");

                // declare a base font size.
                let fontSize = 40;

                do {
                    // assign font to the context and decrement it so it can be measured
                    context.font = `bold ${(fontSize -= 10)}px Arial`;
                    // compare pixel width of text to the canvas, minus the approximate avatar size
                } while (context.measureText(text).width > canvas.width - 300);

                // return result to use in canvas
                return context.font;
            };

            // create canvas
            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext("2d");

            // load background image
            const background = await Canvas.loadImage(backgroundImage);

            // stretch the image onto entire canvas, using canvas dimensions.
            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            // set stroke colour, then draw rectangle with canvas dimensions (border).
            context.strokeStyle = "#c65102";
            context.strokeRect(0, 0, canvas.width, canvas.height);

            // add "welcome" text to image.
            context.font = "bold 20px Arial";
            context.fillStyle = "#ffffff";
            context.fillText(
                "Welcome to the server,",
                canvas.width / 2.5,
                canvas.height / 2.75
            );

            // add "member name" text to image.
            // apply font using function created earlier
            context.font = applyText(canvas, member.user.username);
            // select style that will be used to fill in text
            context.fillStyle = "#ffffff";
            // fill text with a solid colour
            context.fillText(
                member.user.username,
                canvas.width / 2.5,
                canvas.height / 2.0
            );

            // trim square user avatar image to make it a circle.
            // pick up the pen
            context.beginPath();
            // start the arc to form a circle
            context.arc(125, 125, 100, 0, Math.PI * 2, true);
            // put the pen down
            context.closePath();
            // clip off the region you drew on
            context.clip();

            // wait for canvas to load image, then draw this image onto the main canvas.
            const userAvatar = await Canvas.loadImage(
                member.user.displayAvatarURL({ format: "png" })
            );
            context.drawImage(userAvatar, 25, 25, 200, 200);

            // stores the canvas as a discord attachment, which is then stored as a variable.
            const attachment = new MessageAttachment(
                canvas.toBuffer(),
                "welcome.png"
            );

            // CONFIGURE & SEND EMBED
            // finds rules channel and stores as variable.
            const rulesChannel = member.guild.channels.cache.find((channel) =>
                channel.name.includes("rules")
            );

            const embed = new MessageEmbed()
                .setColor(options.ecolor)
                .setDescription(
                    `**Welcome to the server, <@${member.user.id}>.\nBe sure to read ${rulesChannel}!**`
                )
                .setImage("attachment://welcome.png")
                .setFooter(
                    `🗼 ${member.user.tag} joined the server. 🗼`,
                    client.user.displayAvatarURL()
                );
            welcomeChannel.send({ embeds: [embed], files: [attachment] });
        }

        Logger.info(member.user.tag, `Joined the server`);

        // Check if contributor
        const CachedUserId = CacheClient.getFromDiscordId(member.user.id);
        if (!CachedUserId)
            return;

        const User = CacheClient.User.get(CachedUserId);

        if(!User)
            return;

        if(!User?.contributedTo)
            return;

        if(User.contributedTo.length <= 0)
            return;

        // Assuming they have contributed by now.
        let ContributorRole = member.guild.roles.cache.find(e => e.id === Discord_Contributor_Role_Id) as Role;
        member.roles.add(ContributorRole);
        Logger.info(member.user.tag, `Is a contributor adding role.`);
    
	} catch (err) {
		console.log(err);
	}
}
