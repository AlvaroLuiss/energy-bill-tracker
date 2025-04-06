import { Bill } from '@/domain/lumi/enterprise/entities/bill';
import { BillRepository } from '../../../application/repositories/bill.repository';

export class InMemoryBillRepository implements BillRepository {
  public items: Bill[] = [];

  async create(bill: Bill): Promise<void> {
    this.items.push(bill);
  }

  async findById(id: string): Promise<Bill | null> {
    return this.items.find((item) => item.id.toString() === id) || null;
  }

  async findManyByClientId(clientId: string): Promise<Bill[]> {
    return this.items.filter((item) => item.clientId.toString() === clientId);
  }

  async findByClientId(clientId: string): Promise<Bill[] | null> {
    const bills = this.items.filter((item) => item.clientId.toString() === clientId);
    return bills.length > 0 ? bills : null;
  }

  async findAll(): Promise<Bill[]> {
    return this.items;
  }

  async findByMonth(billMonth: string): Promise<Bill[] | null> {
    const bills = this.items.filter(
      (item) => item.referenceMonth.toISOString().slice(0, 7) === billMonth
    );
    return bills.length > 0 ? bills : null;
  }

  async save(bill: Bill): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === bill.id);
    if (itemIndex !== -1) {
      this.items[itemIndex] = bill;
    } else {
      this.items.push(bill);
    }
  }

  async delete(billId: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === billId);
    if (itemIndex !== -1) {
      this.items.splice(itemIndex, 1);
    }
  }
}
