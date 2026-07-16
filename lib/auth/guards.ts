import { JWTPayload } from "../../types/auth";
import { RolesLib } from "./roles";
import { PermissionsLib } from "./permissions";

export const GuardsLib = {
  checkRole(user: JWTPayload, requiredRole: string): boolean {
    return RolesLib.hasRole(user.role, requiredRole);
  },

  checkPermission(user: JWTPayload, requiredPermission: string): boolean {
    return PermissionsLib.hasPermission(user.role, requiredPermission);
  }
};
