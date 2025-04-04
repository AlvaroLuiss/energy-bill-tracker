import { BillRepository } from "apps/api/src/domain/lumi/application/repositories/bill.repository";
import { Bill } from "apps/api/src/domain/lumi/enterprise/entities/bill";

export class InMemoryBillRepository implements BillRepository {
  public items: Bill[] = [];

  async create(bill: Bill): Promise<void> {
    this.items.push(bill);
  }

  async findAll(): Promise<Bill[]> {
    return this.items;
  }
  
  async findById(id: string): Promise<Bill | null> {
    const bill = this.items.find((item) => item.id.toString() === id)

    if(!bill) {
      return null
    }
    return bill
  }

  async findByMonth(billMonth: string): Promise<Bill[] | null> {
    const bill = this.items.filter((item) => item.billMonth.toString() === billMonth)

    if(!bill) {
      return null
    }
    return bill
  }

  async findByClientId(clientId: string): Promise<Bill[] | null> {
      const bill = this.items.filter((item) => item.clientId.toString() === clientId)

      if(!bill) {
        return null
      }
      return bill
  }

  async save(bill: Bill): Promise<void> {
    const index = this.items.findIndex((item) => item.id === bill.id);

    this.items[index] = bill;
  }

  async delete(billId: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === billId);

    this.items.splice(index, 1);
  }


}