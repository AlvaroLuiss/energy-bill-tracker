
import { Client } from '@/domain/lumi/enterprise/entities/client';
import { ClientRepository } from '../../src/domain/lumi/application/repositories/client.repository';


export class InMemoryClientRepository implements ClientRepository {
  public items: Client[] = [];

  async findByClientNumber(clientNumber: string): Promise<Client | null> {
    const client = this.items.find((item) => item.numberClient === clientNumber);
    return client || null;
  }

  async findAll(): Promise<Client[]> {
    return this.items;
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.items.find((item) => item.id.toString() === id);
    return client || null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = this.items.find((item) => item.email === email);
    return client || null;
  }

  async create(client: Client): Promise<void> {
    this.items.push(client);
  }

  async save(client: Client): Promise<void> {
    const clientIndex = this.items.findIndex((item) => item.id === client.id);
    if (clientIndex !== -1) {
      this.items[clientIndex] = client;
    } else {
      this.items.push(client);
    }
  }
}














