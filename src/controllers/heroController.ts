import pool from "../dbconfig/dbconnector";
import * as fetch from "node-fetch";
import {
  searchHeroQuery,
  guildInfoQuery,
  serverInfoQuery,
  saveHeroesQuery,
} from "../queryStore/heroes-query";
import { SERVERLIST, SERVERNAMES, JOBLIST } from "../static/static";
class HeroesController {
  public async searchHero(ctx) {
    try {
      const sql = searchHeroQuery(ctx.params.name);
      const { rows } = await pool.query(sql);
      ctx.body = rows;
    } catch (e) {
      console.log(e);
      ctx.status = 404;
    }
  }
  public async searchGuild(ctx) {
    try {
      const guildInfoSql = guildInfoQuery(ctx.params.name);
      const guildInfo = await pool.query(guildInfoSql);
      ctx.body = guildInfo.rows;
    } catch (e) {
      console.log(e);
      ctx.status = 404;
    }
  }
  public async serverInfo(ctx) {
    try {
      const serverInfoSql = serverInfoQuery(ctx.params.name);
      const serverInfo = await pool.query(serverInfoSql);
      ctx.body = serverInfo.rows;
    } catch (e) {
      console.log(e);
      ctx.status = 404;
    }
  }
  public async saveHeroes(ctx) {
    try {
      SERVERLIST.forEach((server) => {
        JOBLIST.forEach((job) => {
          getHeroes(job, server, ctx.params.date).then(async (res) => {
            await Promise.all(
              res.ResultData.map(async (hero) => {
                const serverInfoSql = saveHeroesQuery(hero);
                const serverInfo = await pool.query(serverInfoSql);
              })
            );
            console.log("Complete", job, server, ctx.params.date);
          });
        });
      });
    } catch (e) {
      console.log(e);
      ctx.status = 404;
    }
  }
}
const getHeroes = async (job, server, date) => {
  const heroes = await fetch(
    "https://v4api.nexon.com/api/krgame/ranking/top100",
    {
      method: "post",
      body: JSON.stringify({
        kst: date,
        realmId: server,
        classId: job,
        mode: server,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return heroes.json();
};
export default HeroesController;
