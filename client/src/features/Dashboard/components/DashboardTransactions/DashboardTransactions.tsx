import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { SectionError } from "@/components/base";
import { LoadingDetails } from "@/components/base/LoadingDetails";
import {
  buttonVariants,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/vendors";
import { baseUIStoreActions } from "@/store/BaseUIStore";
import { useAccountsAndCategories } from "@/utils/api/hooks/useAccountsAndCategories";
import { createFetchRecentTransactions } from "@/utils/api/requests";
import { cn, formatCurrency, formatDate } from "@/utils/functions";
import type { TableCellType, TableRowItem } from "@/utils/types";

const tableHeaderCells: TableCellType[] = [
  {
    cell: "Date",
    className: "",
  },
  {
    cell: "Description",
    className: "",
  },
  {
    cell: "Category",
    className: "",
  },
  {
    cell: "Account",
    className: "",
  },
  {
    cell: "Amount",
    className: "text-right",
  },
];

export const DashboardTransactions = () => {
  const {
    data: transactionData,
    isError: transactionError,
    isLoading: transactionLoading,
  } = useQuery(
    createFetchRecentTransactions({
      params: {
        limit: 10,
      },
    }),
  );

  const {
    accountsMap,
    categoriesMap,
    isError: lookupsError,
    isLoading: lookupsLoading,
  } = useAccountsAndCategories();

  const isLoading = transactionLoading || lookupsLoading;
  const isError = transactionError || lookupsError;

  const tableRows = useMemo(() => {
    if (!transactionData) {
      return [];
    }

    const formattedExpenses: TableRowItem[] = transactionData.data.map(
      (expense) => {
        const {
          accountId,
          amount,
          categoryId,
          currency,
          date,
          description,
          id,
        } = expense;

        const getAccountName = accountsMap.get(accountId) ?? "";

        const categoryName = categoryId
          ? (categoriesMap.get(categoryId) ?? "")
          : "";

        return {
          id,
          data: [
            {
              cell: formatDate({
                date: date,
                showTime: false,
                showYear: false,
              }),
              className: "",
            },
            {
              cell: description,
              className: "",
            },
            {
              cell: categoryName,
              className: "",
            },
            {
              cell: getAccountName,
              className: "",
            },
            {
              cell: formatCurrency({
                amount,
                currency,
              }),
              className: `text-right ${amount < 0 ? "text-text-error" : "text-text-success"}`,
            },
          ],
        };
      },
    );

    return formattedExpenses;
  }, [accountsMap, categoriesMap, transactionData]);

  const handleRowSelected = (row: TableRowItem) => {
    baseUIStoreActions.setTransactionID(row.id);
    baseUIStoreActions.openDrawer("show_transaction");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col border border-neutral-border rounded-md">
        <div className="flex flex-col gap-2 p-3">
          <LoadingDetails overrideLength={5} />
        </div>
      </div>
    );
  }

  if (isError) {
    return <SectionError message="Could not load recent transactions." />;
  }

  return (
    <div className="flex flex-col border border-neutral-border rounded-md">
      <div className="flex flex-wrap gap-2 justify-between p-3">
        <h2 className="text-h5">Recent Transactions</h2>
        <Link to="/accounts" className={buttonVariants()}>
          View More Transactions
        </Link>
      </div>
      <Table>
        <TableCaption className="my-2">
          A list of recent transactions.
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-brand-slate-green text-accent p-3">
            {tableHeaderCells.map((cell, i) => {
              return (
                <TableHead
                  className={cn("px-3 text-accent", cell.className)}
                  key={`table-header-cell-${i}`}
                >
                  {cell.cell}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableRows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => handleRowSelected(row)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) =>
                e.key === "Enter" && handleRowSelected(row)
              }
              tabIndex={0}
            >
              {row.data.map((cell, i) => {
                return (
                  <TableCell
                    className={`cursor-pointer px-3 text-body-small ${cell.className}`}
                    key={`table-row-${row.id}-cell-item-${i}`}
                  >
                    {cell.cell}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
