export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/comparison", "/ev", "/ice", "/subscription", "/register"],
};
