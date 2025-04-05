

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
  findByMonth(billMonth: string): Promise<Bill[] | null> {
    throw new Error('Method not implemented.')
  }
  findByClientId(clientId: string): Promise<Bill[] | null> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Bill | null> {    
    const bill = await this.prisma.bill.findUnique({
      where: {
        id,
      },
    })

    if (!bill) {
      return null    
    }
    
    return PrismaBillMapper.toDomain(bill)  
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