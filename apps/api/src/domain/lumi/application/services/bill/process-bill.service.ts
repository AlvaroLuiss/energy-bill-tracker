import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../../../core/either';
import { InvalidFieldError } from '../../../../../core/errors/invalid-field-error';

interface ProcessBillServiceRequest {
  extractedData: {
    clientNumber?: string;
    referenceMonth?: string;
    energyElectric?: { quantity: number; value: number };
    energySCEEE?: { quantity: number; value: number };
    energyCompensated?: { quantity: number; value: number };
    publicLightingContribution?: number;
  };
}

type ProcessBillServiceResponse = Either<
  InvalidFieldError,
  {
    clientNumber: string;
    referenceMonth: string;
    energyConsumption: number;
    energyCompensated: number;
    totalValueWithoutGD: number;
    gdSavings: number;
  }
>;

@Injectable()
export class ProcessBillService {
  constructor() {}

  async execute({
    extractedData,
  }: ProcessBillServiceRequest): Promise<ProcessBillServiceResponse> {
    if (!this.isValidData(extractedData)) {
      return left(new InvalidFieldError());
    }

    const energyConsumption =
      (extractedData.energyElectric?.quantity || 0) +
      (extractedData.energySCEEE?.quantity || 0);

    const totalValueWithoutGD =
      (extractedData.energyElectric?.value || 0) +
      (extractedData.energySCEEE?.value || 0) +
      (extractedData.publicLightingContribution || 0);

    const gdSavings = extractedData.energyCompensated?.value || 0;

    return right({
      clientNumber: extractedData.clientNumber!,
      referenceMonth: extractedData.referenceMonth!,
      energyConsumption,
      energyCompensated: extractedData.energyCompensated?.quantity || 0,
      totalValueWithoutGD,
      gdSavings,
      extractedData, 
    });
  }

  private isValidData(data: ProcessBillServiceRequest['extractedData']): boolean {
    return (
      !!data.clientNumber &&
      !!data.referenceMonth &&
      data.energyElectric?.quantity !== undefined &&
      data.energyElectric?.value !== undefined &&
      data.energySCEEE?.quantity !== undefined &&
      data.energySCEEE?.value !== undefined &&
      data.energyCompensated?.quantity !== undefined &&
      data.energyCompensated?.value !== undefined &&
      data.publicLightingContribution !== undefined
    );
  }
}
