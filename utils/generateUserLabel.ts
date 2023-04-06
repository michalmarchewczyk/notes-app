import { User } from "@firebase/auth";

function generateUserLabel(user: User | null | undefined): string {
  if (user?.displayName) {
    return user?.displayName
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .slice(0, 2)
      .join("");
  } else {
    return user?.email?.[0].toUpperCase() ?? "";
  }
}

export default generateUserLabel;
