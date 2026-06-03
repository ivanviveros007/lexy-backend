import type { Nivel, TipoJuego, ConfiguracionJuego } from '../../types/juegos';

export class NivelResponseDto implements Nivel {
  id: string;
  tipoJuego: TipoJuego;
  numeroNivel: number;
  titulo: string;
  descripcion?: string;
  dificultad: 1 | 2 | 3 | 4 | 5;
  puntosRecompensa: number;
  tiempoLimiteSegundos?: number;
  configuracion: ConfiguracionJuego;

  static fromRow(row: Record<string, any>): NivelResponseDto {
    const dto = new NivelResponseDto();
    dto.id = row.id;
    dto.tipoJuego = row.tipo_juego;
    dto.numeroNivel = row.numero_nivel;
    dto.titulo = row.titulo;
    dto.descripcion = row.descripcion ?? undefined;
    dto.dificultad = row.dificultad;
    dto.puntosRecompensa = row.puntos_recompensa;
    dto.tiempoLimiteSegundos = row.tiempo_limite_segundos ?? undefined;
    dto.configuracion = row.configuracion;
    return dto;
  }
}
