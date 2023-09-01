import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { signOut } from "next-auth/react";

const useRoutes = (currentUser) => {
  const pathname = usePathname();
  console.log("from routers");
  console.log(currentUser);

  if (currentUser?.role === "Admin") {
    const routes = useMemo(
      () => [
        {
          label: "Subscription Summary",
          href: "/subscription",
          icon: HiUsers,
          active: pathname === "/subscription",
        },
        {
          label: "BLODS vs HAEA",
          href: "/comparison",
          icon: HiUsers,
          active: pathname === "/comparison",
        },
        {
          label: "Remote commands EV",
          href: "/ev",
          icon: HiUsers,
          active: pathname === "/ev",
        },
        {
          label: "Remote commands ICE",
          href: "/ice",
          icon: HiUsers,
          active: pathname === "/ice",
        },
        {
          label: "Register / Delete",
          href: "/register",
          icon: HiUsers,
          active: pathname === "/register",
        },
        {
          label: "Logout",
          onClick: () => signOut(),
          href: "/",
          icon: HiArrowLeftOnRectangle,
        },
      ],
      [pathname]
    );

    return routes;
  }

  if (currentUser?.role !== "Admin") {
  }
  const routes = useMemo(
    () => [
      {
        label: "Subscription Summary",
        href: "/subscription",
        icon: HiUsers,
        active: pathname === "/subscription",
      },
      {
        label: "BLODS vs HAEA",
        href: "/comparison",
        icon: HiUsers,
        active: pathname === "/comparison",
      },
      {
        label: "Remote commands EV",
        href: "/ev",
        icon: HiUsers,
        active: pathname === "/ev",
      },
      {
        label: "Remote commands ICE",
        href: "/ice",
        icon: HiUsers,
        active: pathname === "/ice",
      },
      {
        label: "Logout",
        onClick: () => signOut(),
        href: "/",
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname]
  );

  return routes;
};

export default useRoutes;
