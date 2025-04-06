import { BillRepository } from "@/domain/lumi/application/repositories/bill.repository";
import { ClientRepository } from "@/domain/lumi/application/repositories/client.repository";
import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaBillRepository } from "./prisma/repositories/prisma-bill.repository";
import { PrismaClientRepository } from "./prisma/repositories/prisma-client.repository";

@Module({
  imports: [],
  providers: [
    PrismaService,
  {
    provide: BillRepository,
    useClass: PrismaBillRepository,
  },
  {
    provide: ClientRepository,
    useClass: PrismaClientRepository,
  },
],
  exports: [PrismaService, BillRepository, ClientRepository],
})

export class DatabaseModule {}