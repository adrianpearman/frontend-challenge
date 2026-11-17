type HexColor = `#${string}`;

type BaseChartDataObject = {
  label: string;
  total: number;
};

export type ExpensesChartDataObject = BaseChartDataObject;

export type CategoryChartDataObject = BaseChartDataObject & {
  color: HexColor;
  percentage: number;
};
