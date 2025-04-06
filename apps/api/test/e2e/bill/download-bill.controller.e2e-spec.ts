import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'supertest';
import { BillFactory } from '../../factories/make-bill';
import { ClientFactory } from '../../factories/make-client';

describe('Download Bill (E2E)', () => {
  let app: INestApplication;  
  let billFactory: BillFactory;
  let clientFactory: ClientFactory;
  let uploadsDir: string;
  
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({      
      imports: [AppModule, DatabaseModule],
      providers: [BillFactory, ClientFactory],    
    }).compile();

    app = moduleRef.createNestApplication();    
    billFactory = moduleRef.get(BillFactory);
    clientFactory = moduleRef.get(ClientFactory);
    
    await app.init();

    uploadsDir = path.resolve(__dirname, '../../../../data/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  });

  test('[GET] /bills/:id/download', async () => {    
    const client = await clientFactory.makePrismaClient();
    
    const pdfFileName = 'example.pdf';
    const destinationPath = path.resolve(uploadsDir, pdfFileName);
  
    const minimalPDF = '%PDF-1.4\n%EOF\n';
    fs.writeFileSync(destinationPath, minimalPDF);

    const bill = await billFactory.makePrismaBill({
      clientId: client.id,
      pdfPath: destinationPath 
    });

    const response = await request(app.getHttpServer())
      .get(`/bills/${bill.id}/download`)      
      .expect(200)
      .expect('Content-Type', 'application/pdf')      
      .expect('Content-Disposition', `attachment; filename="${pdfFileName}"`);

    expect(response.body).toBeInstanceOf(Buffer);
    

    if (fs.existsSync(destinationPath)) {
      fs.unlinkSync(destinationPath);
    }
  });

  test('[GET] /bills/:id/download - Non-existent bill', async () => {    
    const nonExistentId = 'non-existent-id';
    await request(app.getHttpServer())      
      .get(`/bills/${nonExistentId}/download`)
      .expect(404);  
  });

  afterAll(async () => {
    try {
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        if (files.length === 0) {
          fs.rmdirSync(uploadsDir);
        }
      }
    } catch (error) {
    }

    await app.close();
  });
});
