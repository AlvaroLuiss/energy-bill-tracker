import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Bill } from '@/domain/lumi/enterprise/entities/bill'
import { Prisma, Bill as PrismaBill } from '@prisma/client'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const billHttpSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  clientNumber: z.string(),
  referenceMonth: z.date().transform((val) => val.toISOString()),
  billMonth: z.string(),
  pdfPath: z.string(),
  energyConsumptionKwh: z.number(),
  energyConsumptionValue: z.number(),
  sceeEnergyKWh: z.number(),
  sceeEnergyValue: z.number(),
  compensatedEnergyKWh: z.number(),
  compensatedEnergyValue: z.number(),
  publicLightingValue: z.number(),
  totalValue: z.number(),
  createdAt: z.date().optional().transform((val) => val?.toISOString()),
  updatedAt: z.date().optional().transform((val) => val?.toISOString()),
})
export class HttpBill extends createZodDto(billHttpSchema) {}

export class PrismaBillMapper { 
   static toDomain(raw: PrismaBill): Bill {
    return Bill.create(      
      {
        clientId: new UniqueEntityID(raw.clientId),
        clientNumber: raw.clientNumber,
        referenceMonth: raw.referenceMonth,
        billMonth: raw.billMonth,
        pdfPath: raw.pdfPath,
        energyConsumptionKwh: raw.energyConsumptionKwh.toNumber(),
        energyConsumptionValue: raw.energyConsumptionValue.toNumber(),
        sceeEnergyKWh: raw.sceeEnergyKWh.toNumber(),
        sceeEnergyValue: raw.sceeEnergyValue.toNumber(),
        compensatedEnergyKWh: raw.compensatedEnergyKWh.toNumber(),
        compensatedEnergyValue: raw.compensatedEnergyValue.toNumber(),
        publicLightingValue: raw.publicLightingValue.toNumber(),
        totalValue: raw.totalValue.toNumber(),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )  
  }
  static toPrisma(bill: Bill): Prisma.BillUncheckedCreateInput {    
    return {
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
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
    }  
  }
  static toHttp(bill: Bill): HttpBill {
    const httpBill = billHttpSchema.parse({
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
      compensatedEnergyKwh: bill.compensatedEnergyKWh,
      compensatedEnergyValue: bill.compensatedEnergyValue,
      publicLightingValue: bill.publicLightingValue,
      totalValue: bill.totalValue,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt
    });
    return httpBill;
  }
}
