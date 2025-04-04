import { Entity } from "../../../../core/entities/entity";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { Optional } from "../../../../core/types/optional";


interface ClientProps {
  name: string;
  email: string;

  numberClient: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export class Client extends Entity<ClientProps> {

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get numberClient(): string {
    return this.props.numberClient;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public updateEmail(newEmail: string): void {
    this.props.email = newEmail;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<ClientProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): Client {
    const client = new Client(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return client;
  }
}
