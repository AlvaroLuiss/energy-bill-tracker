import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
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
  private readonly uploadsDir: string;

  constructor(
    private readonly billRepository: BillRepository,
    private readonly clientRepository: ClientRepository,
  ) {
    this.uploadsDir = path.resolve(__dirname, '../../../../../../data/uploads');
    this.ensureUploadsDirectory();
  }

  private ensureUploadsDirectory() {
    if (!fs.existsSync(this.uploadsDir)) {
      console.log(`Criando diretório de uploads: ${this.uploadsDir}`);
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  private generateUploadPath(clientNumber: string): { fileName: string; filePath: string } {
    // Cria um subdiretório para o ano e mês atual
    const now = new Date();
    const yearMonth = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const yearMonthPath = path.join(this.uploadsDir, yearMonth);

    if (!fs.existsSync(yearMonthPath)) {
      fs.mkdirSync(yearMonthPath, { recursive: true });
    }

    // Gera um nome de arquivo único com o número do cliente
    const fileName = `${clientNumber}-${Date.now()}.pdf`;
    const filePath = path.join(yearMonthPath, fileName);

    return { fileName, filePath };
  }

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

    try {
      // Gera o caminho do arquivo
      const { filePath } = this.generateUploadPath(extractedData.clientNumber);

      // Salva o arquivo
      console.log(`Salvando arquivo em: ${filePath}`);
      await fs.promises.writeFile(filePath, fileBuffer);

      // Verifica se o arquivo foi salvo corretamente
      const fileStats = await fs.promises.stat(filePath);
      console.log(`Arquivo salvo com tamanho: ${fileStats.size} bytes`);

      // Processa o cliente
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

      // Cria a bill com o caminho do arquivo
      const bill = Bill.create({
        clientId: client.id,
        clientNumber: extractedData.clientNumber,
        referenceMonth: new Date(extractedData.referenceMonth),
        billMonth: extractedData.referenceMonth,
        pdfPath: filePath, // Caminho absoluto do arquivo
        energyConsumptionKwh: extractedData.energyElectric.quantity,
        energyConsumptionValue: extractedData.energyElectric.value,
        sceeEnergyKWh: extractedData.energySCEEE.quantity,
        sceeEnergyValue: extractedData.energySCEEE.value,
        compensatedEnergyKWh: extractedData.energyCompensated.quantity,
        compensatedEnergyValue: extractedData.energyCompensated.value,
        publicLightingValue: extractedData.publicLightingContribution,
        totalValue: extractedData.totalValue,
      });

      await this.billRepository.create(bill);

      return right(extractedData);
    } catch (error) {
      console.error('Erro ao processar upload:', error);
      return left(new ResourceNotFoundError());
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
