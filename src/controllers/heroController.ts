import pool from '../dbconfig/dbconnector';
import {
  searchHeroQuery,
  guildInfoQuery,
  serverInfoQuery,
} from '../queryStore/heroes-query';
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
  public async serverInfoQuery(ctx) {
    try {
      const serverInfoSql = serverInfoQuery(ctx.params.name);
      const serverInfo = await pool.query(serverInfoSql);
      ctx.body = serverInfo.rows;
    } catch (e) {
      console.log(e);
      ctx.status = 404;
    }
  }
}

export default HeroesController;
