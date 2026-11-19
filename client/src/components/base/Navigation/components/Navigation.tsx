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
      name: "Expense Reports",
      to: "/expenses",
    },
  ];

  return (
    <nav className="w-full md:w-52 shrink-0 px-4 py-3 md:pt-8 flex flex-col sm:flex-row md:flex-col sm:items-center md:items-stretch gap-2 sm:gap-6 bg-brand-deep-green text-text-alternate">
      <p>Ledgerly</p>
      <ul className="flex md:flex-col overflow-x-auto">
        {navLinks.map((link, i) => {
          return <NavigationItem key={`navigation-link-item-${i}`} {...link} />;
        })}
      </ul>
    </nav>
  );
};
