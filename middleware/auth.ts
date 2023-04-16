import { User } from "@firebase/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const user: User | null = await getCurrentUser();

  if (!user) {
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
