import pool from "../dbconfig/dbconnector";
import * as fetch from "node-fetch";
import { saveHeroesQuery } from "../queryStore/heroes-query";
import { SERVERLIST, JOBLIST } from "../static/static";

class ScheduleController {
  public async saveHeroes(today) {
    try {
      SERVERLIST.forEach((server) => {
        JOBLIST.forEach((job) => {
          getHeroes(job, server, today).then(async (res) => {
            await Promise.all(
              res.ResultData.map(async (hero) => {
                const serverInfoSql = saveHeroesQuery(hero);
                await pool.query(serverInfoSql);
              })
            );
          });
        });
      });
    } catch (e) {
      console.log(e);
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
export default ScheduleController;
