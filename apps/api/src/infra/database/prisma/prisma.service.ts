import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'


@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
    })
  }

  onModuleInit(): Promise<void> {
    return this.$connect()
  }

  onModuleDestroy(): Promise<void> {
    return this.$disconnect()
  }
}
