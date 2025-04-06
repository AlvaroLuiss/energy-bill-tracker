import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ClientFactory } from '../../factories/make-client';


describe('Get Client (E2E)', () => {  
  let app: INestApplication;  
  let clientFactory: ClientFactory;

    beforeEach(async () => {    
    const moduleRef = await Test.createTestingModule({      
      imports: [AppModule, DatabaseModule],      
      providers: [        
        ClientFactory,        
      ],        
    }).compile();
    
    app = moduleRef.createNestApplication();    
    clientFactory = moduleRef.get(ClientFactory);

    await app.init();    
  });

  test('[GET] /clients', async () => {    
    const client = await clientFactory.makePrismaClient();

    const response = await request(app.getHttpServer())      
    .get('/clients');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      clients: expect.arrayContaining([
        expect.objectContaining({
          id: client.id.toString(),
          name: client.name,
          email: client.email,
          numberClient: client.numberClient,
          bills: expect.any(Array),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      ])
    });
  });
});






















