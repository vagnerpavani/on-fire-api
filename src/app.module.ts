import { Module } from '@nestjs/common';
import { MainModule } from './modules/main.module';

@Module({
  imports: [MainModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
