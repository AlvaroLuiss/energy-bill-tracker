import { UploadBillService } from "@/domain/lumi/application/services/bill/upload-bill.service";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database.module";
import { UploadBillController } from "./controllers/bill/upload-bill.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [UploadBillController],
  providers: [UploadBillService],
  exports: [],
})
export class HttpModule {}