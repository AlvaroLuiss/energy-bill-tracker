import { Module } from '@nestjs/common'
import { HttpModule } from './database/http/http.module'

@Module({
  imports: [
    HttpModule,
  ],
})
export class AppModule {}
