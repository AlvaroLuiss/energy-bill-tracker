import { Client } from "../../enterprise/entities/client";

export abstract class ClientRepository {
  abstract create(user: Client): Promise<void>;
  abstract findByEmail(email: string): Promise<Client | null>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findAll(): Promise<Client[]>;
  abstract save(user: Client): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
