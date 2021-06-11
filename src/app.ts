import { Server } from "./server";
import schduleController from "./controllers/scheduleController";
const schedule = require("node-schedule");

const port = parseInt(process.env.PORT || "3001");

//second, minute, hour, day, month, week(0-6)
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 4;
rule.minute = 6;

const k = schedule.scheduleJob(rule, () => {
  let today = new Date();

  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1;
  let zeroMonth = month < 10 && month >= 0 ? "0" + month : month;
  let date = today.getDate(); // 날짜

  let dayString = year + "-" + zeroMonth + "-" + date;

  let schedule = new schduleController();
  schedule.saveHeroes(dayString);
});

const starter = new Server()
  .start(port)
  .then((port) => console.log(`Running on port ${port}`))
  .catch((error) => {
    console.log(error);
  });

export default starter;
