import { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import heroesRouter from './routers/heroesRouter';
import pool from './dbconfig/dbconnector';
import Koa from 'koa';
import cors from '@koa/cors';

class Server {
  private app;

  constructor() {
    this.app = new Koa();
    this.config();
    this.routerConfig();
    this.dbConnect();
  }

  private config() {
    this.app.use(
      cors({
        origin: function (ctx) {
          return ctx.request.headers.origin || '*';
        },
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        /* allowMethods: ['GET', 'POST', 'DELETE'], -- use default */
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
      }),
    );
    this.app.use(bodyParser());
  }

  private dbConnect() {
    pool.connect(function (err: any, client: any, done: any) {
      if (err) throw new Error(err);
      console.log('Connected');
    });
  }

  private routerConfig() {
    this.app.use(heroesRouter.routes()).use(heroesRouter.allowedMethods());
  }

  public start = (port: number) => {
    return new Promise((resolve, reject) => {
      this.app
        .listen(port, () => {
          resolve(port);
        })
        .on('error', (err: Object) => reject(err));
    });
  };
}

export { Server };
