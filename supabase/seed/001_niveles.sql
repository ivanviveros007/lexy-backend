-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: niveles de ejemplo por cada tipo de juego
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Cazador de Sílabas ─────────────────────────────────────────────────────
INSERT INTO niveles (tipo_juego, numero_nivel, titulo, descripcion, dificultad, puntos_recompensa, tiempo_limite_segundos, configuracion)
VALUES
(
  'cazador_silabas', 1,
  '¡Primera caza!', 'Palabras de 2 sílabas', 1, 50, 60,
  '{
    "tipo": "cazador_silabas",
    "minAciertos": 2,
    "palabras": [
      { "palabra": "gato",  "silabas": ["ga", "to"] },
      { "palabra": "luna",  "silabas": ["lu", "na"] },
      { "palabra": "mesa",  "silabas": ["me", "sa"] }
    ]
  }'
),
(
  'cazador_silabas', 2,
  '¡Tres sílabas!', 'Palabras de 3 sílabas', 2, 80, 75,
  '{
    "tipo": "cazador_silabas",
    "minAciertos": 2,
    "palabras": [
      { "palabra": "pelota",   "silabas": ["pe", "lo", "ta"] },
      { "palabra": "camino",   "silabas": ["ca", "mi", "no"] },
      { "palabra": "verano",   "silabas": ["ve", "ra", "no"] }
    ]
  }'
);

-- ── Palabras Gemelas ───────────────────────────────────────────────────────
INSERT INTO niveles (tipo_juego, numero_nivel, titulo, descripcion, dificultad, puntos_recompensa, tiempo_limite_segundos, configuracion)
VALUES
(
  'palabras_gemelas', 1,
  '¿Son iguales?', 'Discrimina b y d', 1, 60, 60,
  '{
    "tipo": "palabras_gemelas",
    "minAciertos": 3,
    "pares": [
      { "palabraA": "beso",  "palabraB": "peso",  "sonGemelas": false },
      { "palabraA": "dado",  "palabraB": "dado",  "sonGemelas": true  },
      { "palabraA": "dama",  "palabraB": "bama",  "sonGemelas": false },
      { "palabraA": "sala",  "palabraB": "sala",  "sonGemelas": true  }
    ]
  }'
);

-- ── Intruso de las Rimas ───────────────────────────────────────────────────
INSERT INTO niveles (tipo_juego, numero_nivel, titulo, descripcion, dificultad, puntos_recompensa, tiempo_limite_segundos, configuracion)
VALUES
(
  'intruso_rimas', 1,
  '¡Busca al intruso!', 'Grupos de 4 palabras con un intruso', 1, 70, 90,
  '{
    "tipo": "intruso_rimas",
    "minAciertos": 2,
    "grupos": [
      { "palabras": ["gato", "pato", "rato", "pino"],  "intruso": "pino"  },
      { "palabras": ["sol",  "col",  "flor",  "rol"],   "intruso": "flor"  },
      { "palabras": ["pan",  "can",  "tan",  "mar"],    "intruso": "mar"   }
    ]
  }'
);

-- ── Conductor del Texto ────────────────────────────────────────────────────
INSERT INTO niveles (tipo_juego, numero_nivel, titulo, descripcion, dificultad, puntos_recompensa, tiempo_limite_segundos, configuracion)
VALUES
(
  'conductor_texto', 1,
  'El jardín de Lexy', 'Texto corto y 2 preguntas', 1, 100, 120,
  '{
    "tipo": "conductor_texto",
    "minAciertos": 2,
    "texto": "Lexy tiene un jardín muy bonito. Hay rosas rojas y margaritas blancas. Cada mañana, Lexy riega las flores con una regadera azul. Le encantan los colores del jardín.",
    "preguntas": [
      {
        "pregunta": "¿De qué color son las rosas?",
        "opciones":   ["rojas", "blancas", "azules", "amarillas"],
        "respuestaCorrecta": "rojas"
      },
      {
        "pregunta": "¿Con qué riega Lexy las flores?",
        "opciones":   ["una manguera", "una regadera azul", "un cubo rojo", "sus manos"],
        "respuestaCorrecta": "una regadera azul"
      }
    ]
  }'
);
