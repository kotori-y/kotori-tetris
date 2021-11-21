import "../styles/style.css";
import {SmashBoy, Hero, Teewee, OrangeRicky, BlueRicky, ClevelandZ, RhodeIslandZ} from "./block"


(async () => {
  await new Hero().run()
  await new SmashBoy().run()
  await new Teewee().run()
  await new OrangeRicky().run()
  await new BlueRicky().run()
  await new ClevelandZ().run()
  await new RhodeIslandZ().run()
})()