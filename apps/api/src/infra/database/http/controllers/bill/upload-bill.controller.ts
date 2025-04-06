import { UploadBillService } from '@/domain/lumi/application/services/bill/upload-bill.service'
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'
import { z } from 'zod'


const uploadBillSchema = z.object({
  file: z.any(),
})

const uploadBillResponseSchema = z.object({
  
  clientNumber: z.string(),
  clientName: z.string(),
  referenceMonth: z.string(),
  energyElectric: z.object({
    quantity: z.number(),
    value: z.number(),
  }),
  energySCEEE: z.object({
    quantity: z.number(),
    value: z.number(),
  }),
  energyCompensated: z.object({
    quantity: z.number(),
    value: z.number(),
  }),
  publicLightingContribution: z.number(),
  totalValue: z.number(),
})


class UploadBillResponseData extends createZodDto(
  uploadBillResponseSchema,
) {}

@ApiTags('Bill')
@Controller('bills')
@UsePipes(ZodValidationPipe)
export class UploadBillController {  
  constructor(private uploadBillService: UploadBillService) {}

  @Post('upload')  
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({   
    schema: {
      type: 'object',      
      properties: {
        file: {
          type: 'string',          
          format: 'binary',
        },      
      },    
    },
  })  
  @ApiResponse({
    status: 201,    
    description: 'Bill uploaded successfully.',
    type: class UploadBillResponseData extends createZodDto(
    uploadBillResponseSchema,
    ) {},
  })
  @ApiBadRequestResponse({    
    description: 'Validation failed. The provided file is not valid.',  
  })
  async handle(@UploadedFile() file: Express.Multer.File): Promise<UploadBillResponseData> {    

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.uploadBillService.execute({
      fileBuffer: file.buffer, 
    });

    if (result.isLeft()) {
      const error = result.value;
      throw new BadRequestException(error.message);
    }

    return {
      clientNumber: result.value.clientNumber,
      clientName: result.value.clientName,
      referenceMonth: result.value.referenceMonth,
      energyElectric: result.value.energyElectric,
      energySCEEE: result.value.energySCEEE,
      energyCompensated: result.value.energyCompensated,
      publicLightingContribution: result.value.publicLightingContribution,
      totalValue: result.value.totalValue,
    };
  }
}
