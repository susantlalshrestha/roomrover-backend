import { Role } from "@prisma/client";

type UserRole = Role | "UNKNOWN";

export type AuthData = { roles: Role[] | undefined };

type AuthStrategy = (authData: AuthData) => boolean;

type AuthStrategies = {
  [P in UserRole]: AuthStrategy;
};

const adminStrategy: AuthStrategy = (authData) => {
  const { roles } = authData;
  return roles !== undefined && roles.includes("ADMIN");
};

const guestStrategy: AuthStrategy = (authData) => {
  const isAdmin = adminStrategy(authData);
  if (isAdmin) return true;

  const { roles } = authData;
  return roles !== undefined && roles.includes("GUEST");
};

const hostStrategy: AuthStrategy = (authData) => {
  const isAdmin = adminStrategy(authData);
  if (isAdmin) return true;

  const { roles } = authData;
  return roles !== undefined && roles.includes("HOST");
};

const unknownStrategy: AuthStrategy = () => false;

export const authStrategies: AuthStrategies = {
  GUEST: guestStrategy,
  HOST: hostStrategy,
  ADMIN: adminStrategy,
  UNKNOWN: unknownStrategy,
};
