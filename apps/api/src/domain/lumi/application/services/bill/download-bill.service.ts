import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Either, left, right } from '../../../../../core/either';
import { ResourceNotFoundError } from '../../../../../core/errors/resource-not-found-error';
import { BillRepository } from '../../repositories/bill.repository';

interface DownloadBillServiceRequest {
  billId: string;
}

interface DownloadBillServiceResponse {
  filePath: string;
  fileName: string;
}

type DownloadBillResponse = Either<
  ResourceNotFoundError,
  DownloadBillServiceResponse
>;

@Injectable()
export class DownloadBillService {
  private readonly uploadsDir: string;

  constructor(private billRepository: BillRepository) {
    this.uploadsDir = path.resolve(__dirname, '../../../../../../data/uploads');
  }

  async execute({
    billId,
  }: DownloadBillServiceRequest): Promise<DownloadBillResponse> {
    try {
      console.log(`Buscando bill com ID: ${billId}`);
      const bill = await this.billRepository.findById(billId);

      if (!bill) {
        console.log('Bill não encontrada no banco de dados');
        return left(new ResourceNotFoundError());
      }

      if (!bill.pdfPath) {
        console.log('Bill encontrada mas não possui pdfPath');
        return left(new ResourceNotFoundError());
      }

      console.log(`PDF path encontrado: ${bill.pdfPath}`);
      

      if (!fs.existsSync(bill.pdfPath)) {
        console.error(`Arquivo físico não encontrado em: ${bill.pdfPath}`);
        return left(new ResourceNotFoundError());
      }

      const fileName = path.basename(bill.pdfPath);
      console.log(`Nome do arquivo: ${fileName}`);

      const fileStats = await fs.promises.stat(bill.pdfPath);
      if (fileStats.size === 0) {
        console.error('Arquivo está vazio');
        return left(new ResourceNotFoundError());
      }

      return right({
        filePath: bill.pdfPath,
        fileName,
      });
    } catch (error) {
      console.error('Erro no serviço de download:', error);
      return left(new ResourceNotFoundError());
    }
  }
}
