export class CreateOrderDto {
  readonly userCookies: string;
  readonly sendCurrency: string;
  readonly receiveCurrency: string;
  readonly sendAmount: number;
  readonly receiveAmount: number;
  readonly sendBank: string;
  readonly receiveBank: string;
  readonly ownerName: string;
  readonly ownerData: string;
  readonly status: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly qrCodeFileData: string;
  readonly hash: string;
}
