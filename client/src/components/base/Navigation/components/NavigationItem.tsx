import { Link } from "@tanstack/react-router";
import type { NavigationItemProps } from "@/utils/types";

export const NavigationItem = ({ name, to }: NavigationItemProps) => {
  return (
    <li>
      <Link
        className="block py-2.5 px-4 rounded-md"
        activeProps={{
          className: "bg-brand-slate-green text-brand-mint-accent",
        }}
        to={to}
      >
        {name}
      </Link>
    </li>
  );
};
