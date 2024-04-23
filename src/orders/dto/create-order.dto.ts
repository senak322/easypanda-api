export class CreateOrderDto {
  readonly sendCurrency: string;
  readonly receiveCurrency: string;
  readonly sendAmount: number;
  readonly receiveAmount: number;
  readonly sendBank: string;
  readonly receiveBank: string;
  readonly ownerName: string;
  readonly ownerData: string;
}
