import * as path from 'path';
import { UploadBillService } from '../../../src/domain/lumi/application/services/bill/upload-bill.service';
import { InMemoryBillRepository } from '../../repositories/in-memory-bill.repository';
import { InMemoryClientRepository } from '../../repositories/in-memory-client.repository';

let inMemoryBillRepository: InMemoryBillRepository;
let inMemoryClientRepository: InMemoryClientRepository;
let sut: UploadBillService;

describe('UploadBillService', () => {
  beforeEach(() => {
    inMemoryBillRepository = new InMemoryBillRepository();
    inMemoryClientRepository = new InMemoryClientRepository();

    sut = new UploadBillService(inMemoryBillRepository, inMemoryClientRepository);
  });

  it('should be able to upload a valid bill using a real PDF', async () => {
    const pdfPath = path.join(__dirname, '../../../src/domain/lumi/application/pdf/example.pdf');
    const fileBuffer = require('fs').readFileSync(pdfPath);
    const result = await sut.execute({ fileBuffer });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const extractedData = result.value;
      expect(extractedData.clientNumber).toBeTruthy();
      expect(extractedData.referenceMonth).toBeTruthy();
      expect(extractedData.energyElectric).toEqual(expect.objectContaining({
        quantity: expect.any(Number),
        value: expect.any(Number),
      }));
      expect(extractedData.energySCEEE).toEqual(expect.objectContaining({
        quantity: expect.any(Number),
        value: expect.any(Number),
      }));
      expect(extractedData.energyCompensated).toEqual(expect.objectContaining({
        quantity: expect.any(Number),
        value: expect.any(Number),
      }));
      expect(extractedData.publicLightingContribution).toBeGreaterThanOrEqual(0);
    }
  });
});