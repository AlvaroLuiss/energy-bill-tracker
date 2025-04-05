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

  // it('should not be able to upload a bill if the file does not exist', async () => {
  //   const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  //   const fileBuffer = Buffer.from(''); // Simulate an empty or invalid file buffer
  //   const result = await sut.execute({ fileBuffer });

  //   expect(result.isLeft()).toBe(true);
  //   expect(result.value).toBeInstanceOf(ResourceNotFoundError);

  //   consoleErrorSpy.mockRestore();
  // });

  // it('should not be able to upload a bill if the file is not a PDF', async () => {
  //   const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  //   const fileBuffer = Buffer.from('Invalid file content'); // Simulate invalid file content
  //   const result = await sut.execute({ fileBuffer });

  //   expect(result.isLeft()).toBe(true);
  //   expect(result.value).toBeInstanceOf(InvalidFieldError);

  //   consoleErrorSpy.mockRestore();
  // });

  // it('should create a new client if it does not exist', async () => {
  //   const pdfPath = path.join(__dirname, '../../../src/domain/lumi/application/pdf/example.pdf');
  //   const clientNumber = '7204076116';

  //   // Ensure the client does not exist before the test
  //   expect(await inMemoryClientRepository.findByClientNumber(clientNumber)).toBeNull();

  //   const fileBuffer = require('fs').readFileSync(pdfPath);
  //   const result = await sut.execute({ fileBuffer });

  //   expect(result.isRight()).toBe(true);
  //   if (result.isRight()) {
  //     const extractedData = result.value;
  //     expect(extractedData.clientNumber).toBe(clientNumber);

  //     // Check if the client was created
  //     const createdClient = await inMemoryClientRepository.findByClientNumber(clientNumber);
  //     expect(createdClient).not.toBeNull();
  //     expect(createdClient?.numberClient).toBe(clientNumber);
  //   }
  // });
});