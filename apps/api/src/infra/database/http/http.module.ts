import { UploadBillService } from "@/domain/lumi/application/services/bill/upload-bill.service";
import { GetClientsService } from "@/domain/lumi/application/services/client/get-clients.service";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database.module";
import { UploadBillController } from "./controllers/bill/upload-bill.controller";
import { GetClientsController } from "./controllers/client/get-clients.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [UploadBillController, GetClientsController],
  providers: [UploadBillService, GetClientsService],
  exports: [],
})
export class HttpModule {}