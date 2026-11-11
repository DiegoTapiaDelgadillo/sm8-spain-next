import { initBotId } from "botid/client/core";

// Vercel BotID (nivel Basic): añade la verificación a las peticiones protegidas.
// En desarrollo (`NODE_ENV=development`) no carga nada.
initBotId({
  protect: [{ path: "/api/contact", method: "POST" }],
});
