import { useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
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
import {
  createFetchCategories,
  createFetchDashboardMetrics,
  createFetchRecentTransactions,
} from "@/utils/api/requests";
import { cn, formatCurrency, formatDate } from "@/utils/functions";

type TableCellType = {
  cell: ReactNode;
  className: string;
};

type TableRowItem = {
  id: string;
  data: TableCellType[];
};

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

export const Transactions = () => {
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
    data: accountData,
    isError: accountFetchingError,
    isLoading: accountFetchingLoading,
  } = useQuery(createFetchDashboardMetrics({}));

  const {
    data: categoriesData,
    isError: categoriesFetchingError,
    isLoading: categoriesFetchingLoading,
  } = useQuery(createFetchCategories({ params: {} }));

  const isLoading =
    transactionLoading || accountFetchingLoading || categoriesFetchingError;
  const isError =
    transactionError || accountFetchingError || categoriesFetchingLoading;

  const tableRows = useMemo(() => {
    if (!transactionData || !accountData || !categoriesData) {
      return [];
    }

    const formattedExpenses: TableRowItem[] = transactionData.data.map(
      (expense) => {
        const { accountId, amount, category, currency, date, description, id } =
          expense;

        const accountsMap = new Map(
          accountData.data.map((data) => [data.id, data.name]),
        );
        const categoriesMap = new Map(
          categoriesData.data.map((data) => [data.id, data.name]),
        );

        const getAccountName = accountsMap.get(accountId) ?? "";

        const categoryName =
          category && category.name ? categoriesMap.get(category.name) : "";

        return {
          id: id,
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
  }, [accountData, categoriesData, transactionData]);

  if (isLoading) {
    return "LOADING";
  }

  if (isError) {
    return "ERROR";
  }

  return (
    <div className="flex flex-col border border-neutral-border rounded-md">
      <div className="flex justify-between p-3">
        <h2 className="text-h5">Recent Transactions</h2>
        <Link to="/accounts" className={buttonVariants()}>
          View More Transactions
        </Link>
      </div>
      <Table>
        <TableCaption className="my-2">
          A list of your recent invoices.
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
          {tableRows.map((invoice) => (
            <TableRow key={invoice.id}>
              {invoice.data.map((cell, i) => {
                return (
                  <TableCell
                    className={`px-3 ${cell.className}`}
                    key={`table-row-${invoice.id}-cell-item-${i}`}
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
