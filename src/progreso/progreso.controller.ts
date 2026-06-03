import { Controller, Post, Body } from '@nestjs/common';
import { ProgresoService } from './progreso.service';
import { CompletarNivelDto } from './dto/completar-nivel.dto';

@Controller('progreso')
export class ProgresoController {
  constructor(private readonly progresoService: ProgresoService) {}

  // POST /progreso/completar
  @Post('completar')
  completar(@Body() dto: CompletarNivelDto) {
    return this.progresoService.completarNivel(dto);
  }
}
