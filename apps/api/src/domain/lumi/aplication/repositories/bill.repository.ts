import { Bill } from "../../enterprise/entities/bill";

export abstract class BillRepository {
  abstract create(bill: Bill): Promise<void>;
  abstract findAll(): Promise<Bill[]>;
  abstract findById(id: string): Promise<Bill>;
  abstract findByMonth(month: number): Promise<Bill[]>;
  abstract findByYear(year: number): Promise<Bill[]>;
  abstract findByClientId(clientId: string): Promise<Bill[]>;

  abstract save(bill: Bill): Promise<void>;
  abstract delete(id: string): Promise<void>;  
}
