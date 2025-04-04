import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { Either, left, right } from '../../../../../core/either';
import { InvalidFieldError } from '../../../../../core/errors/invalid-field-error';
import { ResourceNotFoundError } from '../../../../../core/errors/resource-not-found-error';
import { Bill } from '../../../enterprise/entities/bill';
import { Client } from '../../../enterprise/entities/client';
import { ExtractedInvoiceData, extractPdfText } from '../../pdf/pdf-parse';
import { BillRepository } from '../../repositories/bill.repository';
import { ClientRepository } from '../../repositories/client.repository';

interface UploadBillServiceRequest {
  filePath: string;
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
    filePath,
  }: UploadBillServiceRequest): Promise<UploadBillServiceResponse> {
    if (!filePath || !filePath.endsWith('.pdf')) {
      return left(new InvalidFieldError());
    }

    const fileBuffer = await this.readFile(filePath);
    if (!fileBuffer) {
      return left(new ResourceNotFoundError());
    }

    const extractedData = await this.extractTextFromPdf(fileBuffer);
    if (!extractedData) {
      return left(new ResourceNotFoundError());
    }


    let client = await this.clientRepository.findByClientNumber(extractedData.clientNumber);
    if (!client) {
      client = Client.create({
        numberClient: extractedData.clientNumber,
        name: `Cliente ${extractedData.clientName}`,
        email: `${extractedData.clientName}@example.com`, 
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
      pdfPath: filePath,
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

  private async readFile(filePath: string): Promise<Buffer | null> {
    try {
      return await fs.readFile(filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Error reading file:', err); 
      }
      return null;
    }
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
