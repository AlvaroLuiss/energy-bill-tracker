import { faker } from '@faker-js/faker'

import { PrismaBillMapper } from '@/infra/database/prisma/mappers/prisma-bill-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '../../../api/src/core/entities/unique-entity-id'
import { Bill, BillProps } from '../../src/domain/lumi/enterprise/entities/bill'

export function makeBill(
  override: Partial<BillProps> = {},
  id?: UniqueEntityID,): Bill {  
    const bill = Bill.create(
    {      
      clientId: new UniqueEntityID(),
      clientNumber: faker.string.numeric(10),
      referenceMonth: faker.date.past(),
      billMonth: faker.date.month(),
      pdfPath: faker.system.filePath(),
      energyConsumptionKwh: faker.number.float({ min: 0, max: 1000}),
      energyConsumptionValue: faker.number.float({ min: 0, max: 1000}),
      sceeEnergyKWh: faker.number.float({ min: 0, max: 1000 }),
      sceeEnergyValue: faker.number.float({ min: 0, max: 1000 }),
      compensatedEnergyKWh: faker.number.float({ min: 0, max: 1000}),
      compensatedEnergyValue: faker.number.float({ min: 0, max: 1000}),
      publicLightingValue: faker.number.float({ min: 0, max: 100}),
      totalValue: faker.number.float({ min: 0, max: 1000}),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id,  
  )
  return bill
}

@Injectable()
export class BillFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaBill(override: Partial<BillProps> = {}): Promise<Bill> {
    const bill = makeBill(override)
    await this.prismaService.bill.create({
      data: PrismaBillMapper.toPrisma(bill),
    })
    return bill
  }
}