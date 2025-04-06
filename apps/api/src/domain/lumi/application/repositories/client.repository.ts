import { Client } from "../../enterprise/entities/client";

export abstract class ClientRepository {
  abstract create(client: Client): Promise<void>;
  abstract findByClientNumber(clientNumber: string): Promise<Client | null>;
  abstract findByEmail(email: string): Promise<Client | null>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findAll(): Promise<Client[]>;
  abstract save(user: Client): Promise<void>;
}
