# inaesa-cms-demo

Demo de una sola página con la marca real de INAESA (navy #1D4171, Poppins) más un panel de administración (Decap CMS) para que el director suba y actualice avisos sin tocar código.

```
inaesa-cms-demo/
├── index.html          ← página pública (lee content/*.json por fetch)
├── styles.css
├── main.js
├── admin/
│   ├── index.html      ← carga el panel de Decap CMS
│   └── config.yml       ← qué puede editar el director (Avisos, Información general)
├── content/
│   ├── avisos.json      ← lo que se ve en la sección "Avisos"
│   └── info.json         ← dirección, teléfono, WhatsApp, correo, horario, mensaje del director
└── netlify.toml
```

## Qué es real y qué es inventado

- **Real:** dirección, teléfono, correo, WhatsApp del director (de INAESA) y la marca (color navy, Poppins, "Ciencia · Tecnología · Valores").
- **Inventado (para el demo):** los 5 avisos de `content/avisos.json`, el mensaje del director, y el escudo (es un círculo con "IN", no el logo real). Sustituye el escudo por el logo real en base64 o `<img>` antes de mostrarlo al cliente.
- **No incluido a propósito:** las 6 páginas del sitio real (secundaria, bachillerato, etc.), el carrusel del hero, las tarjetas flip y el conteo animado — se dejaron fuera para que el demo sea más simple, pero sí conserva animaciones de entrada y scroll-reveal.

## Probar el panel en tu computadora (sin desplegar nada)

1. `npm i -g decap-server` (una vez) y luego, en esta carpeta: `npx decap-server`
2. En otra terminal, sirve la carpeta: `npx serve .` (o `python3 -m http.server 8080`)
3. Abre `http://localhost:8080/admin/`. Como `local_backend: true` está activo en `config.yml`, Decap detecta el servidor local y te deja editar sin pedir login. Los cambios se escriben directamente en `content/avisos.json` y `content/info.json` de esta carpeta (necesitas que la carpeta sea un repo git — `git init` si aún no lo es).

## Poner esto en producción (Netlify)

1. Sube la carpeta a un repo y conéctalo a Netlify.
2. **Site settings → Identity → Enable Identity.**
3. **Identity → Registration:** cámbialo a "Invite only" (así solo el director puede entrar, no cualquiera que encuentre `/admin`).
4. **Identity → Services → Git Gateway → Enable Git Gateway.** Esto es lo que deja que Decap escriba en el repo en nombre del director sin darle un token de GitHub.
5. **Identity → Invite users** y manda la invitación al correo del director. Al aceptarla, cae en `/admin/` y ya puede editar.

Estos pasos no los puedo hacer yo: requieren entrar al panel de Netlify con la cuenta del cliente o la tuya.

## Nota sobre este demo vs. el sitio real de INAESA

Esto es una plantilla de demostración separada, no toca el sitio ya desplegado en Netlify. Cuando decidan avanzar con el CMS ahí, la estructura es la misma (`admin/config.yml` + `content/*.json`), solo hay que adaptar las colecciones a las secciones reales del sitio (por ejemplo, si quieren que también editen las 5 páginas de nivel).
