import { Injectable } from '@nestjs/common';


import { ClientRepository } from '@/domain/lumi/application/repositories/client.repository';
import { Client } from '@/domain/lumi/enterprise/entities/client';
import { PrismaClientMapper } from '../mappers/prisma-client-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaClientRepository implements ClientRepository {  
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<Client[]> {
    const clients = await this.prisma.client.findMany();
    return clients.map(PrismaClientMapper.toDomain);
  }

  async findByClientNumber(clientNumber: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        numberClient: clientNumber,
      },
    });
    if (!client) {
      return null;
    }
    return PrismaClientMapper.toDomain(client);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        email,
      },
    });
    if (!client) {
      return null;
    }
    return PrismaClientMapper.toDomain(client);
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        id,
      },
    });
    if (!client) {
      return null;
    }
    return PrismaClientMapper.toDomain(client);
  }

  async save(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client);
    await this.prisma.client.update({
      where: {
        id: client.id.toString(),
      },
      data,
    });
  }

  async create(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client);
    
    await this.prisma.client.create({     
       data,     
    });
  }


}