import Slash from "../../Struct/Slash";
import { Guild, GuildMember, MessageEmbed } from "discord.js";
import { Client } from "discord.js";
import { ApplicationCommandInteractionDataOption, Interaction } from "slash-commands";
import SlashReply from "../../../Lib/Discord/SlashReply";
import Logger from "../../../Lib/Logger";
import CacheClient from "../../../Cache/Cache";
import { stripIndent } from "common-tags";
import { Color_Main } from "../../../Config";

export default class TopLevelSlash extends Slash
{
    public name = "top-level";
    public options = {
        "name": this.name,
        "description": "Shows the top users here.",
    }
    public run(
        client: Client,
        interaction: Interaction,
        author: GuildMember,
        guild: Guild,
        args: ApplicationCommandInteractionDataOption[] | undefined,
        sr: SlashReply
    )
    {
        let users = new Map();
        for (const [key, value] of CacheClient.DiscordUserLevel.entries())
        {
            users.set(value.discord_id, value);
        }

        users[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1].xp - a[1].xp);
        }
        let tops = ``;
        let count = 1;
        for (let [key, value] of users)
        {
            tops += `#${count} < <@${value.discord_id}> | Level **${value.level}** | Messages \`${value.xp}\` >\n`
            count++;
        }

        const embed = new MessageEmbed()
            .setTitle("Leaderboard")
            .setDescription(tops)
            .setColor(Color_Main)
            .setThumbnail("https://cdn.tolfix.com/images/TX-Small.png")

        sr.reply(embed);
    }
}