INSERT INTO "Rol" (description, status) VALUES ('Entrenador', true), ('Jugador', true) ON CONFLICT DO NOTHING;
