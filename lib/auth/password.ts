import bcrypt from "bcryptjs";

export const PasswordLib = {
  hash(password: string): string {
    return bcrypt.hashSync(password, 12);
  },

  compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  },
};
