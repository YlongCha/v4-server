import Router from "koa-router";
import HeroesController from "../controllers/heroController";
import pool from "../dbconfig/dbconnector";

const heroesRouter = new Router();
const heroesController = new HeroesController();

heroesRouter.get("/hero/:name", heroesController.searchHero);
heroesRouter.get("/guild/:name", heroesController.searchGuild);
heroesRouter.get("/server/:name", heroesController.serverInfo);
heroesRouter.post("/heroes/:date", heroesController.saveHeroes);

export default heroesRouter;
