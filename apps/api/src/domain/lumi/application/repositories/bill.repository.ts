import { Bill } from "../../enterprise/entities/bill";

export abstract class BillRepository {
  abstract create(bill: Bill): Promise<void>;
  abstract findAll(): Promise<Bill[]>;
  abstract findById(id: string): Promise<Bill | null>;
  abstract findByMonth(billMonth: string): Promise<Bill[] | null>;
  abstract findByClientId(clientId: string): Promise<Bill[] | null>;

  abstract save(bill: Bill): Promise<void>;
  abstract delete(id: string): Promise<void>;  
}
