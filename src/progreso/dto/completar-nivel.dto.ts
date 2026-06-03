import { IsString, IsNumber, IsUUID, Min } from 'class-validator';
import type { ProgresoCompletarPayload } from '../../types/juegos';

export class CompletarNivelDto implements ProgresoCompletarPayload {
  @IsUUID()
  usuarioId: string;

  @IsUUID()
  nivelId: string;

  @IsNumber()
  @Min(0)
  puntosObtenidos: number;

  @IsNumber()
  @Min(0)
  tiempoCompletadoSegundos: number;

  @IsNumber()
  @Min(0)
  aciertos: number;

  @IsNumber()
  @Min(0)
  errores: number;
}
