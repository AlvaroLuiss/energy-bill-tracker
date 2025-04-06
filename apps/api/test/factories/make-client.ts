import { PrismaClientMapper } from '@/infra/database/prisma/mappers/prisma-client-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'

import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '../../../api/src/core/entities/unique-entity-id'
import { Client, ClientProps } from '../../src/domain/lumi/enterprise/entities/client'

export function makeClient(  
  override: Partial<ClientProps> = {},
  id?: UniqueEntityID,
): Client {  
  const client = Client.create(    
    {
      name: faker.person.fullName(),      
      email: faker.internet.email(),
      numberClient: faker.string.numeric(10),      
      bills: [],
      createdAt: faker.date.past(),      
      updatedAt: faker.date.recent(),
      ...override,    
    },
    id,
  )
  return client
}
@Injectable()
export class ClientFactory {  
  constructor(private prismaService: PrismaService) {}
  async makePrismaClient(override: Partial<ClientProps> = {}): Promise<Client> {    
    const client = makeClient(override)
    await this.prismaService.client.create({
      data: PrismaClientMapper.toPrisma(client),    
    })    
    return client
  }
}