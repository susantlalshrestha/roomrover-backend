import { Router } from "express";
import { create } from "lodash";
import remove from "./remove";
import messages from "./messages";
import get from "./get";
import sendMessage from "./send-message";

const chats = Router();

create(chats);
get(chats);
messages(chats);
remove(chats);
sendMessage(chats);

export default chats;
