import { UploadBillService } from '@/domain/lumi/application/services/bill/upload-bill.service'
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { ZodValidationPipe } from 'nestjs-zod'
import { z } from 'zod'


const uploadBillSchema = z.object({
  file: z.any(),
})


@ApiTags('Bill')
@Controller('bills')
@UsePipes(ZodValidationPipe)
export class UploadBillController {  
  constructor(private uploadBillService: UploadBillService) {}
  @Post('upload')  
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
  })  @ApiResponse({
    status: 200,    description: 'Bill uploaded successfully.',
  })
  @ApiBadRequestResponse({    
    description: 'Validation failed. The provided file is not valid.',  
  })
  @UseInterceptors(FileInterceptor('file'))

  async handle(    
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {    
    console.log('Uploaded file:', file); 
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.uploadBillService.execute({
      fileBuffer: file.buffer, 
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case BadRequestException:
          throw error;

        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}