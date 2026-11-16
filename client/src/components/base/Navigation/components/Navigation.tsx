import { NavigationItem } from "@/components/base/Navigation/components/NavigationItem";
import type { NavigationItemProps } from "@/utils/types";

export const Navigation = () => {
  const navLinks: NavigationItemProps[] = [
    {
      name: "Dashboard",
      to: "/",
    },
    {
      name: "Accounts & Ledger",
      to: "/accounts",
    },
    {
      name: "Bills & Income",
      to: "/bills",
    },
    {
      name: "Budget Projection",
      to: "/budget",
    },
    {
      name: "Expense Reports",
      to: "/expenses",
    },
  ];

  return (
    <nav className="w-56 px-4 pt-8 flex flex-col gap-6 bg-brand-deep-green text-text-alternate">
      <p>Ledgerly</p>
      <ul className="flex flex-col">
        {navLinks.map((link, i) => {
          return <NavigationItem key={`navigation-link-item-${i}`} {...link} />;
        })}
      </ul>
    </nav>
  );
};
