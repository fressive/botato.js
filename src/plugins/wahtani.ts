// What Anime
// Usage: 发送 wahtani 与 图片 （分次发送）给 bot 
// Author: int100

import * as ionjs from '@ionjs/core'
import { Utils, Codes } from '@ionjs/core';
import axios from 'axios'

/**
 *  Format seconds to "x分 y秒".
 *  @param second Seconds
 */
function secondFormat(second: number): string {
    var sec = Math.round(second)
    var s = sec % 60
    var m = (sec - s) / 60
    return `${m}分 ${s}秒`
}

/**
 *  Get cover url from anilist id
 *  @param id Id in anilist.co
 */
async function getCover(id: number): Promise<string> {

    return new Promise(async function(resolve, reject) {
        try {
            var query = "query ($id: Int) { Media (id: $id, type: ANIME) { coverImage { large } } }"
            var rep = await axios.post(
                    "https://graphql.anilist.co", 
                    JSON.stringify({query: query, variables: { id: id }}), 
                    { headers: { "Content-Type": "application/json" } }
                )
            
            var image = rep.data.data.Media.coverImage.large
            if (image)
                resolve(image)
            else 
                reject("not exists")
        } catch (err) {
            reject(err)
        }
    })
}

ionjs.useSession(ionjs.when.contain("wahtani"), { concurrent: true }) (
    async function greet(ctx) {
        var wife = await ctx.question("纸片人呢？")
        ctx.stream.free()

        var msg = Utils.stringToArray(wife.message)

        var img = await Promise.all(msg.filter(it => it.type == "image").map(it => 
            axios.get(it.data.url, { responseType: "arraybuffer" })
        ))

        if (img.length == 0) {
            await ctx.reply("?")
            return
        }

        var base64 = Buffer.from(img[0].data).toString('base64');

        var animeRep = await axios.post(
                "https://wait.hirina.cn/api/search",  // use the proxy site of trace.moe because source is blocked in China :(
                JSON.stringify({image: base64}), 
                { headers: { "Content-Type": "application/json" } }
        )

        var animes = animeRep.data.docs.filter((it) => it.similarity > 0.8)

        if (animes.length == 0) {
            await ctx.reply("未找到纸片人出处或是非番图（画面越完整越好）。")
            return
        } else {
            var anime = animes[0]
            var text = `原名：${anime.title_native}\n译名：${anime.anime} \n在 Ep.${anime.episode} ${secondFormat(anime.at)} 处出现。`
            
            if (!anime.is_adult) { // disable NSFW in QQ Groups
                await ctx.reply(Codes.Image(await getCover(anime.anilist_id)), "\n", text)
            } else {
                await ctx.reply(text)
                return
            }

        }

    }
)