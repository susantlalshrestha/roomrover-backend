import { Router } from "express";
import { create } from "lodash";
import remove from "./remove";
import update from "./update";

const reviews = Router();

create(reviews);
remove(reviews);
update(reviews);

export default reviews;
