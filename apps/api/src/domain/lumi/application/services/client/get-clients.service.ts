import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../../../core/either';
import { ResourceNotFoundError } from '../../../../../core/errors/resource-not-found-error';
import { BillRepository } from '../../repositories/bill.repository';
import { ClientRepository } from '../../repositories/client.repository';

interface GetClientsServiceResponse {
  clients: {
    id: string;
    name: string;
    email: string;
    numberClient: string;
    bills: {
      id: string;
      clientId: string;
      clientNumber: string;
      referenceMonth: Date;
      billMonth: string;
      pdfPath: string;
      energyConsumptionKwh: number;
      energyConsumptionValue: number;
      sceeEnergyKWh: number;
      sceeEnergyValue: number;
      compensatedEnergyKWh: number;
      compensatedEnergyValue: number;
      publicLightingValue: number;
      totalValue: number;
      createdAt: Date;
      updatedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }[];
}

type GetClientsServiceResult = Either<ResourceNotFoundError, GetClientsServiceResponse>;

@Injectable()
export class GetClientsService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly billRepository: BillRepository
  ) {}

  async execute(): Promise<GetClientsServiceResult> {
    const clients = await this.clientRepository.findAll();

    if (!clients || clients.length === 0) {
      return left(new ResourceNotFoundError());
    }

    const clientsWithBills = await Promise.all(
      clients.map(async (client) => {
        const bills = await this.billRepository.findManyByClientId(client.id.toString());
        return {
          id: client.id.toString(),
          name: client.name,
          email: client.email,
          numberClient: client.numberClient,
          bills: bills.map(bill => ({
            id: bill.id.toString(),
            clientId: bill.clientId.toString(),
            clientNumber: bill.clientNumber,
            referenceMonth: bill.referenceMonth,
            billMonth: bill.billMonth,
            pdfPath: bill.pdfPath,
            energyConsumptionKwh: bill.energyConsumptionKwh,
            energyConsumptionValue: bill.energyConsumptionValue,
            sceeEnergyKWh: bill.sceeEnergyKWh,
            sceeEnergyValue: bill.sceeEnergyValue,
            compensatedEnergyKWh: bill.compensatedEnergyKWh,
            compensatedEnergyValue: bill.compensatedEnergyValue,
            publicLightingValue: bill.publicLightingValue,
            totalValue: bill.totalValue,
            createdAt: bill.createdAt || new Date(),
            updatedAt: bill.updatedAt || new Date()
          })),
          createdAt: client.createdAt || new Date(),
          updatedAt: client.updatedAt || new Date()
        };
      })
    );

    return right({
      clients: clientsWithBills
    });
  }
}








