import AppEnv from "src/app-env";

type TokenConfigs = {
  [K in TokenKind]: { secret: string; expiresIn: string | number | undefined };
};

export type TokenKind = "access" | "refresh";

export const tokenConfigs: TokenConfigs = {
  access: { secret: AppEnv.accessTokenSecret, expiresIn: "24h" },
  refresh: { secret: AppEnv.refreshTokenSecret, expiresIn: "30d" },
};
