import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Client } from '@/domain/lumi/enterprise/entities/client'
import { Prisma, Client as PrismaClient } from '@prisma/client'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const clientHttpSchema = z.object({  
  id: z.string().uuid(),
  name: z.string(),  
  email: z.string().email(),
  numberClient: z.string(),  
  createdAt: z.date().optional().transform((val) => val?.toISOString()),
  updatedAt: z.date().optional().transform((val) => val?.toISOString()),
})

export class HttpClient extends createZodDto(clientHttpSchema) {}

export class PrismaClientMapper { 
   static toDomain(raw: PrismaClient): Client {    
    return Client.create(      
      {
        name: raw.name ?? '',        
        email: raw.email ?? '',
        numberClient: raw.numberClient,        
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,      
      },
      new UniqueEntityID(raw.id),    )  
  }  static toPrisma(client: Client): Prisma.ClientUncheckedCreateInput {    
    return {      
      id: client.id.toString(),
      name: client.name,      
      email: client.email,
      numberClient: client.numberClient,      
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,    
    }
  }  

  static toHttp(client: Client): HttpClient {
    const httpClient = clientHttpSchema.parse({      
      id: client.id.toString(),
      name: client.name,      
      email: client.email,
      numberClient: client.numberClient,      
      createdAt: client.createdAt,
      updatedAt: client.updatedAt   
     })
    return httpClient
  }
}
























