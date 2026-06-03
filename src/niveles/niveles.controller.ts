import { Controller, Get, Param } from '@nestjs/common';
import { NivelesService } from './niveles.service';
import type { TipoJuego } from '../types/juegos';

@Controller('niveles')
export class NivelesController {
  constructor(private readonly nivelesService: NivelesService) {}

  // GET /niveles/cazador_silabas
  @Get(':tipoJuego')
  findAll(@Param('tipoJuego') tipoJuego: TipoJuego) {
    return this.nivelesService.findByTipoJuego(tipoJuego);
  }

  // GET /niveles/cazador_silabas/:nivelId
  @Get(':tipoJuego/:nivelId')
  findOne(
    @Param('tipoJuego') tipoJuego: TipoJuego,
    @Param('nivelId') nivelId: string,
  ) {
    return this.nivelesService.findOne(tipoJuego, nivelId);
  }
}
