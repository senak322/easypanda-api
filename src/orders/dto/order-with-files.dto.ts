import { Order } from '../schemas/order.schema';

export interface OrderWithFiles extends Order {
  fileUrls: string[];
}
