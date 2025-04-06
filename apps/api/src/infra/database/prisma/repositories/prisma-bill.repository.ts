

import { Injectable } from '@nestjs/common'

import { BillRepository } from '../../../../domain/lumi/application/repositories/bill.repository'
import { Bill } from '../../../../domain/lumi/enterprise/entities/bill'
import { PrismaBillMapper } from '../mappers/prisma-bill-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaBillRepository implements BillRepository {  
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<Bill[]> {
    const bills = await this.prisma.bill.findMany();

    return bills.map(PrismaBillMapper.toDomain);
  }

  async findByClientId(clientId: string): Promise<Bill[]> {
    const bills = await this.prisma.bill.findMany({
      where: {
        clientId,
      },
      select: {
        id: true,
        clientId: true,
        clientNumber: true,
        referenceMonth: true,
        billMonth: true,
        pdfPath: true,
        energyConsumptionKwh: true,
        energyConsumptionValue: true,
        sceeEnergyKWh: true,
        sceeEnergyValue: true,
        compensatedEnergyKWh: true,
        compensatedEnergyValue: true,
        publicLightingValue: true,
        totalValue: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return bills.map(PrismaBillMapper.toDomain);
  }

  findByMonth(billMonth: string): Promise<Bill[] | null> {
    throw new Error('Method not implemented.')
  }
  async findManyByClientId(clientId: string): Promise<Bill[]> {
    const bills = await this.prisma.bill.findMany({
      where: {
        clientId,
      },
    });

    return bills.map(PrismaBillMapper.toDomain);
  }
  async findById(id: string): Promise<Bill | null> {
    const bill = await this.prisma.bill.findUnique({
      where: { id },
      select: {
        id: true,
        clientId: true,
        clientNumber: true,
        referenceMonth: true,
        billMonth: true,
        pdfPath: true,
        energyConsumptionKwh: true,
        energyConsumptionValue: true,
        sceeEnergyKWh: true,
        sceeEnergyValue: true,
        compensatedEnergyKWh: true,
        compensatedEnergyValue: true,
        publicLightingValue: true,
        totalValue: true,
        createdAt: true,
        updatedAt: true
      }
    });
  
    if (!bill) {
      return null;
    }
  
    return PrismaBillMapper.toDomain(bill);
  }

  

  async create(bill: Bill): Promise<void> {    
    const data = PrismaBillMapper.toPrisma(bill)
    
    await this.prisma.bill.create({
      data,
    })  
  }
  async save(bill: Bill): Promise<void> {    
    const data = PrismaBillMapper.toPrisma(bill)
    
    await this.prisma.bill.update({
      where: {        
        id: bill.id.toString(),
      },
      data,
    })  
  }
  async delete(id: string): Promise<void> {    
    await this.prisma.bill.delete({
      where: {        
        id,
      },   
    })
  }
}
