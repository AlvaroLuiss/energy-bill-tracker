import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Client } from '@/domain/lumi/enterprise/entities/client';
import { GetClientsService } from '../../../src/domain/lumi/application/services/client/get-clients.service';
import { InMemoryBillRepository } from '../../repositories/in-memory-bill.repository';
import { InMemoryClientRepository } from '../../repositories/in-memory-client.repository';

let inMemoryClientRepository: InMemoryClientRepository;
let inMemoryBillRepository: InMemoryBillRepository;
let sut: GetClientsService;

describe('GetClientsService', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository();
    inMemoryBillRepository = new InMemoryBillRepository();
    sut = new GetClientsService(inMemoryClientRepository, inMemoryBillRepository);
  });

  it('should be able to get all clients', async () => {
    const client1 = Client.create({
      numberClient: '1234567890',
      name: 'John Doe',
      email: 'johndoe@example.com',
      bills: ['bill1', 'bill2']
    });

    const client2 = Client.create({
      numberClient: '0987654321',
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      bills: ['bill3', 'bill4']
    });

    await inMemoryClientRepository.create(client1);
    await inMemoryClientRepository.create(client2);

    const result = await sut.execute();
    
    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const clients = result.value.clients;

      expect(clients).toHaveLength(2);

      expect(clients).toContainEqual(
        expect.objectContaining({
          id: client1.id.toString(),
          name: client1.name,
          email: client1.email,
          numberClient: client1.numberClient,
          bills: expect.any(Array),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      );

      expect(clients).toContainEqual(
        expect.objectContaining({
          id: client2.id.toString(),
          name: client2.name,
          email: client2.email,
          numberClient: client2.numberClient,
          bills: expect.any(Array),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        })
      );
    }
  });

  
  it('should return a ResourceNotFoundError if no clients are found', async () => {
    const result = await sut.execute();
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
