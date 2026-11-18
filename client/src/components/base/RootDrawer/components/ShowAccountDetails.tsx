import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TruncateText } from "@/components/base";
import { ErrorLoadingDrawerComponent } from "@/components/base/RootDrawer/components";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/vendors";
import { baseUIStoreActions, useBaseUIStore } from "@/store/BaseUIStore";
import {
  createFetchDashboardMetrics,
  createFetchRecentTransactions,
} from "@/utils/api/requests";
import { cn, formatCurrency, formatDate } from "@/utils/functions";
import type { TableCellType, TableRowItem } from "@/utils/types";

export const ShowAccountDetails = () => {
  const navigate = useNavigate();
  const accountID = useBaseUIStore((state) => state.accountID);

  const {
    data: accountsData,
    isError: accountsDataError,
    isLoading: accountsDataLoading,
  } = useQuery(createFetchDashboardMetrics({}));

  const accountsMap = new Map(
    (accountsData === undefined ? [] : accountsData.data).map(
      ({ id, name }) => [id, name],
    ),
  );

  const {
    data: transactionsData,
    isError: transactionsError,
    isLoading: transactionsLoading,
  } = useQuery({
    ...createFetchRecentTransactions({
      params: {
        accountId: accountID || undefined,
        include: "account,category",
        pageSize: 10,
      },
    }),
  });

  const isError = transactionsError || accountsDataError;
  const isLoading = transactionsLoading || accountsDataLoading;

  const handleNavigate = () => {
    navigate({
      to: "/accounts",
    });

    baseUIStoreActions.closeDrawer();
  };

  const tableHeaderCells: TableCellType[] = [
    {
      cell: "Description",
      className: "",
    },
    {
      cell: "Date",
      className: "",
    },
    {
      cell: "Amount",
      className: "text-right",
    },
  ];

  const tableRows = useMemo(() => {
    if (!transactionsData || !accountsData) {
      return [];
    }

    const formattedExpenses: TableRowItem[] = transactionsData.data.map(
      (expense) => {
        const { amount, currency, date, description, id } = expense;

        return {
          id,
          data: [
            {
              cell: <TruncateText content={description ?? ""} />,
              className: "w-1/2",
            },
            {
              cell: formatDate({
                date: date,
                showTime: false,
                showYear: false,
              }),
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
  }, [accountsData, transactionsData]);

  if (isLoading) {
    return <div>loading</div>;
  }

  if (isError) {
    return <ErrorLoadingDrawerComponent drawerName="account details" />;
  }

  return (
    <div className="flex flex-col justify-between h-full overflow-auto">
      <div className="flex flex-col gap-2">
        <div className="p-4 pb-2 flex flex-col gap-2">
          <h2 className="text-h5">{accountsMap.get(accountID ?? "") ?? "-"}</h2>
          <p className="text-body-small">Recent transactions</p>
        </div>
        <div className="p-1 w-full">
          <Table>
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
                <TableRow key={row.id}>
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
      </div>
      <div className="bg-background-secondary p-2 flex gap-1 justify-end">
        <Button
          onClick={handleNavigate}
          onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) =>
            e.key === "Enter" && handleNavigate()
          }
        >
          View more
        </Button>
      </div>
    </div>
  );
};
