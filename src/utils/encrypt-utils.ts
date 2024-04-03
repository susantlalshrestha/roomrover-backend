import bcrypt from "bcryptjs";
import Logger from "./logger";

export const encodePassword = (raw: string): string => {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(raw, salt);
  } catch (error) {
    Logger.log(error.message);
  }
};

export const matchPassword = (raw: string, encoded: string): boolean => {
  try {
    return bcrypt.compareSync(raw, encoded);
  } catch (error) {
    Logger.log(error.message);
  }
};
