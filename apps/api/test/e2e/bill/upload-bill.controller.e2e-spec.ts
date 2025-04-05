import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as fs from 'fs'; // Importa o módulo fs para verificar o arquivo
import * as path from 'path'; // Importa o módulo path
import * as request from 'supertest';
import { BillFactory } from '../../factories/make-bill';

describe('Upload Bill (E2E)', () => {  
  let app: INestApplication;
  let billFactory: BillFactory;
  
  beforeEach(async () => {    
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],      
      providers: [
        BillFactory,        
      ],    
    }).compile();
    
    app = moduleRef.createNestApplication();
    billFactory = moduleRef.get(BillFactory);

    await app.init();  
  });

  test('[POST] /bills/upload', async () => {
    const filePath = path.resolve(__dirname, '../fixtures/example.pdf'); 
    console.log('File path:', filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    const response = await request(app.getHttpServer())
      .post('/bills/upload')
      .attach('file', filePath);

    console.log('Response body:', response.body); // Adicione este log para depuração
    expect(response.status).toBe(201);

    // expect(response.body).toEqual({      
    //   bill: expect.objectContaining({
    //     id: expect.any(String),        
    //     fileName: 'example.pdf',
    //   }),    
    // });
  });
});