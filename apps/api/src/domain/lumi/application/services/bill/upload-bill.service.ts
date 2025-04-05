import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../../../core/either';
import { InvalidFieldError } from '../../../../../core/errors/invalid-field-error';
import { ResourceNotFoundError } from '../../../../../core/errors/resource-not-found-error';
import { Bill } from '../../../enterprise/entities/bill';
import { Client } from '../../../enterprise/entities/client';
import { ExtractedInvoiceData, extractPdfText } from '../../pdf/pdf-parse';
import { BillRepository } from '../../repositories/bill.repository';
import { ClientRepository } from '../../repositories/client.repository';

interface UploadBillServiceRequest {
  fileBuffer: Buffer;
}

type UploadBillServiceResponse = Either<
  ResourceNotFoundError | InvalidFieldError,
  ExtractedInvoiceData
>;

@Injectable()
export class UploadBillService {
  constructor(
    private readonly billRepository: BillRepository,
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute({
    fileBuffer,
  }: UploadBillServiceRequest): Promise<UploadBillServiceResponse> {
    if (!fileBuffer || fileBuffer.length === 0) {
      return left(new InvalidFieldError());
    }

    const extractedData = await this.extractTextFromPdf(fileBuffer);
    if (!extractedData) {
      return left(new ResourceNotFoundError());
    }

    let client = await this.clientRepository.findByClientNumber(extractedData.clientNumber);
    if (!client) {
      client = Client.create({
        numberClient: extractedData.clientNumber,
        name: `${extractedData.clientName}`,
        email: `${extractedData.clientName.replace(/\s+/g, '')}@example.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.clientRepository.create(client);
    }

    const bill = Bill.create({
      clientId: client.id,
      clientNumber: extractedData.clientNumber, 
      referenceMonth: new Date(extractedData.referenceMonth),
      billMonth: extractedData.referenceMonth,
      pdfPath: '', 
      energyConsumptionKwh: extractedData.energyElectric.quantity,
      energyConsumptionValue: extractedData.energyElectric.value,
      sceeEnergyKWh: extractedData.energySCEEE.quantity,
      sceeEnergyValue: extractedData.energySCEEE.value,
      compensatedEnergyKWh: extractedData.energyCompensated.quantity,
      compensatedEnergyValue: extractedData.energyCompensated.value,
      publicLightingValue: extractedData.publicLightingContribution,
    });

    await this.billRepository.create(bill);

    return right(extractedData);
  }

  private async extractTextFromPdf(fileBuffer: Buffer): Promise<ExtractedInvoiceData | null> {
    try {
      return await extractPdfText(fileBuffer);
    } catch (err) {
      console.error('Error extracting text from PDF:', err);
      return null;
    }
  }
}
