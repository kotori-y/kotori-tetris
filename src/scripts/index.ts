import "../styles/style.css";
import { Controller } from "./controller";


(async () => {
  await new Controller().start()
})()