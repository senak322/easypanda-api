import { FileDetails } from '../intersaces/file-details';

export class CreateOrderDto {
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
  readonly qrCodeFileData: FileDetails;
  readonly hash: string;
}
