import { Router } from "express";
import create from "./create";
import getAll from "./get-all";
import getReservations from "./get-reservations";
import getReviews from "./get-reviews";
import get from "./get";
import removeImage from "./remove-image";
import remove from "./remove";
import update from "./update";

const rooms = Router();

create(rooms);
getAll(rooms);
getReservations(rooms);
getReviews(rooms);
get(rooms);
removeImage(rooms);
remove(rooms);
update(rooms);

export default rooms;
