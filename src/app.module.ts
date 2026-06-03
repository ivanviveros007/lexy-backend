import { Module } from '@nestjs/common';
import { NivelesModule } from './niveles/niveles.module';
import { ProgresoModule } from './progreso/progreso.module';

@Module({
  imports: [NivelesModule, ProgresoModule],
})
export class AppModule {}
