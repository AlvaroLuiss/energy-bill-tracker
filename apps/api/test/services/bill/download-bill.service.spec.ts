import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Bill } from '@/domain/lumi/enterprise/entities/bill';
import { ResourceNotFoundError } from '../../../src/core/errors/resource-not-found-error';
import { DownloadBillService } from '../../../src/domain/lumi/application/services/bill/download-bill.service';
import { InMemoryBillRepository } from '../../repositories/in-memory-bill.repository';

let inMemoryBillRepository: InMemoryBillRepository;
let sut: DownloadBillService;

describe('DownloadBillService', () => {
  beforeEach(() => {    
    inMemoryBillRepository = new InMemoryBillRepository();
    sut = new DownloadBillService(inMemoryBillRepository);  
  });

  it('should return ResourceNotFoundError when bill does not exist', async () => {    
    const result = await sut.execute({ 
      billId: 'non-existent-id'
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);  
  });
});
  
    it('should return ResourceNotFoundError when bill has no pdfPath', async () => {    
      const bill = Bill.create({
        clientId: new UniqueEntityID(),     
        clientNumber: '123456',
        referenceMonth: new Date(),      
        billMonth: 'Janeiro',
        pdfPath: '',      
        energyConsumptionKwh: 100,
        energyConsumptionValue: 50,      
        sceeEnergyKWh: 80,
        sceeEnergyValue: 40,
        compensatedEnergyKWh: 20,
        compensatedEnergyValue: 10,
        publicLightingValue: 30,
        totalValue: 140,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
    const result = await sut.execute({ billId: bill.id.toString() });
    
    expect(result.isLeft()).toBe(true);
    
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);  
});
  
    it('should return ResourceNotFoundError when PDF file does not exist', async () => {    
      const bill = Bill.create({
        clientId: new UniqueEntityID(),
        clientNumber: '123456',      
        referenceMonth: new Date(),      
        billMonth: 'Janeiro',
        pdfPath: 'non-existent-path.pdf',      
        energyConsumptionKwh: 100,
        energyConsumptionValue: 50,      
        sceeEnergyKWh: 80,
        sceeEnergyValue: 40,
        compensatedEnergyKWh: 20,
        compensatedEnergyValue: 10,
        publicLightingValue: 30,
        totalValue: 140,
});

    await inMemoryBillRepository.create(bill);
    
    const result = await sut.execute({ billId: bill.id.toString() });
    
    expect(result.isLeft()).toBe(true);
    
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);  
  });
