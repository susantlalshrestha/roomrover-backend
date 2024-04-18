import { Router } from "express";
import auth from "./auth";
import swagger from "./swagger";
import rooms from "./rooms";
import reservations from "./reservations";
import account from "./account";
import reviews from "./reviews";
import chats from "./chats";

const router = Router();

router.use("/auth", auth);
router.use("/account", account);
router.use("/chats", chats);
router.use("/rooms", rooms);
router.use("/reservations", reservations);
router.use("/reviews", reviews);
router.use("/docs", swagger);

export default router;
