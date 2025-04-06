import { GetClientsService } from '@/domain/lumi/application/services/client/get-clients.service'
import {
  Controller,
  Get,
  UsePipes
} from '@nestjs/common'
import {
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'
import { z } from 'zod'

const getClientsResponseSchema = z.object({  
  clients: z.array(z.object({
    id: z.string().uuid(),    
    name: z.string(),
    email: z.string().email(),
    numberClient: z.string(),
    bills: z.array(z.object({
      id: z.string().uuid(),
      clientId: z.string().uuid(),
      clientNumber: z.string(),
      referenceMonth: z.date(),
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
    })),
    createdAt: z.date().optional().transform((val) => val?.toISOString()),
    updatedAt: z.date().optional().transform((val) => val?.toISOString()),
  })
)})

class GetClientsResponseData extends createZodDto(getClientsResponseSchema) {}
@ApiTags('Client')
@Controller('clients')
@UsePipes(ZodValidationPipe)
export class GetClientsController {    
  constructor(private getClientsService: GetClientsService) {}
  @Get()  
  @ApiResponse({
    status: 200,    
    description: 'Clients retrieved successfully.',
    type: class GetClientsResponseData extends createZodDto(
      getClientsResponseSchema,
    ) {}    
 })

  async handle(): Promise<GetClientsResponseData> {

    const result = await this.getClientsService.execute();

    if (result.isLeft()) {
      throw new Error('No clients found');    
    }

    return {
      clients: result.value.clients.map(client => ({
        id: client.id.toString(),
        name: client.name,
        email: client.email,
        numberClient: client.numberClient,
        bills: client.bills.map(bill => ({
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
          createdAt: bill.createdAt?.toISOString(),
          updatedAt: bill.updatedAt?.toISOString()
        })),
        createdAt: client.createdAt?.toISOString(),
        updatedAt: client.updatedAt?.toISOString()
      }))
    };
  }
}
