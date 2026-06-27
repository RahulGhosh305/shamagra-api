import dotenv from "dotenv";
import "./mongoose";
import { updateSeedRunnable } from "./index";

dotenv.config();
updateSeedRunnable();
