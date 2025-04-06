import { DownloadBillService } from '@/domain/lumi/application/services/bill/download-bill.service';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';

@ApiTags('Bill')
@Controller('bills')
export class DownloadBillController {
  constructor(private downloadBillService: DownloadBillService) {}

  @Get(':id/download')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Bill ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'PDF file downloaded successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'PDF file not found.',
  })
  async download(@Param('id') id: string, @Res() res: Response) {
    console.log(`Iniciando download da bill ${id}`);
    
    try {
      const result = await this.downloadBillService.execute({
        billId: id,
      });

      if (result.isLeft()) {
        console.log('Download service retornou erro');
        return res.status(404).json({ 
          message: 'PDF não encontrado',
          error: 'NOT_FOUND'
        });
      }

      const { filePath, fileName } = result.value;
      console.log(`Preparando download do arquivo: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        console.error(`Arquivo não existe fisicamente: ${filePath}`);
        return res.status(404).json({ 
          message: 'Arquivo PDF não encontrado no servidor',
          error: 'FILE_NOT_FOUND'
        });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      
      try {
        const fileStats = fs.statSync(filePath);
        console.log(`Tamanho do arquivo: ${fileStats.size} bytes`);
        
        if (fileStats.size === 0) {
          return res.status(404).json({ 
            message: 'Arquivo PDF vazio',
            error: 'EMPTY_FILE'
          });
        }
      } catch (error) {
        console.error('Erro ao ler estatísticas do arquivo:', error);
        return res.status(500).json({ 
          message: 'Erro ao ler arquivo',
          error: 'FILE_READ_ERROR'
        });
      }

      return res.sendFile(filePath, (err) => {
        if (err) {
          console.error('Erro ao enviar arquivo:', err);
          return res.status(500).json({ 
            message: 'Erro ao enviar arquivo',
            error: 'SEND_FILE_ERROR'
          });
        }
        console.log('Arquivo enviado com sucesso');
      });
    } catch (error) {
      console.error('Erro ao processar download:', error);
      return res.status(500).json({ 
        message: 'Erro interno ao processar o download',
        error: 'INTERNAL_ERROR'
      });
    }
  }
}
