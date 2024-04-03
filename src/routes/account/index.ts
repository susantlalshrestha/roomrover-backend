import { Router } from "express";
import changePassword from "./change-password";
import getChats from "./get-chats";
import getReviews from "./get-reviews";
import getRooms from "./get-rooms";
import getSessions from "./get-sessions";
import get from "./get";
import update from "./update";
import getReservations from "./get-reservations";

const account = Router();

changePassword(account);
getChats(account);
getReservations(account);
getReviews(account);
getRooms(account);
getSessions(account);
get(account);
update(account);

export default account;
