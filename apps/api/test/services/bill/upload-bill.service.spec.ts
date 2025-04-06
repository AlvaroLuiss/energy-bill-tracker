import { InvalidFieldError } from '@/core/errors/invalid-field-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import * as fs from 'fs';
import * as path from 'path';
import { ExtractedInvoiceData } from '../../../src/domain/lumi/application/pdf/pdf-parse';
import { UploadBillService } from '../../../src/domain/lumi/application/services/bill/upload-bill.service';
import { Bill } from '../../../src/domain/lumi/enterprise/entities/bill';
import { Client } from '../../../src/domain/lumi/enterprise/entities/client';
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
    const fileBuffer = fs.readFileSync(pdfPath);
    
    const mockExtractedData: ExtractedInvoiceData = {
      clientNumber: '123456',
      clientName: 'John Doe',
      referenceMonth: '2023-05',
      energyElectric: { quantity: 100, value: 50 },
      energySCEEE: { quantity: 80, value: 40 },
      energyCompensated: { quantity: 20, value: 10 },
      publicLightingContribution: 5,
      totalValue: 105,
    };

    jest.spyOn(sut as any, 'extractTextFromPdf').mockResolvedValue(mockExtractedData);
    jest.spyOn(sut as any, 'generateUploadPath').mockReturnValue({ filePath: '/mock/path/file.pdf' });
    jest.spyOn(fs.promises, 'stat').mockResolvedValue({} as fs.Stats);

    const result = await sut.execute({ fileBuffer });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const extractedData = result.value;
      expect(extractedData).toEqual(mockExtractedData);

      expect(inMemoryClientRepository.items).toHaveLength(1);
      expect(inMemoryClientRepository.items[0]).toBeInstanceOf(Client);
      expect(inMemoryClientRepository.items[0].numberClient).toBe('123456');

      expect(inMemoryBillRepository.items).toHaveLength(1);
      expect(inMemoryBillRepository.items[0]).toBeInstanceOf(Bill);
      expect(inMemoryBillRepository.items[0].clientNumber).toBe('123456');
    }
  });

  it('should return left with InvalidFieldError if fileBuffer is empty', async () => {
    const result = await sut.execute({ fileBuffer: Buffer.from('') });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidFieldError);
  });

  it('should return left with ResourceNotFoundError if PDF extraction fails', async () => {
    const fileBuffer = Buffer.from('mock pdf content');
    jest.spyOn(sut as any, 'extractTextFromPdf').mockResolvedValue(null);

    const result = await sut.execute({ fileBuffer });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
