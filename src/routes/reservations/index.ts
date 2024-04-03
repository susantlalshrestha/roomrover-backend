import { Router } from "express";
import cancel from "./cancel";
import create from "./create";
import getAll from "./get-all";
import get from "./get";

const reservations = Router();

cancel(reservations);
create(reservations);
getAll(reservations);
get(reservations);

export default reservations;
