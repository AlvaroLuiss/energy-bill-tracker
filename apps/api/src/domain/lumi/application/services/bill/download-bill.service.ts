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

      const bill = await this.billRepository.findById(billId);

      if (!bill) {

        return left(new ResourceNotFoundError());
      }

      if (!bill.pdfPath) {
        return left(new ResourceNotFoundError());
      }


      

      if (!fs.existsSync(bill.pdfPath)) {

        return left(new ResourceNotFoundError());
      }

      const fileName = path.basename(bill.pdfPath);


      const fileStats = await fs.promises.stat(bill.pdfPath);
      if (fileStats.size === 0) {
        return left(new ResourceNotFoundError());
      }

      return right({
        filePath: bill.pdfPath,
        fileName,
      });
    } catch (error) {
      return left(new ResourceNotFoundError());
    }
  }
}
