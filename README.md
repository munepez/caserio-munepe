
 Caserío [MUNEPE] · Web de venta entre particulares

Landing page estática (HTML + Tailwind CDN + JavaScript puro). No necesita backend ni compilación.

```
index.html     → contenido, SEO y Open Graph
styles.css     → estilos propios y animaciones
script.js      → menú, galería/lightbox, formulario y WhatsApp (CONFIG arriba del todo)
images/        → tus fotos (nombres en images/LEEME.txt)
robots.txt / sitemap.xml → para Google
```

## 1. Personalizar

1. Abre `index.html`, `script.js`, `robots.txt` y `sitemap.xml` y usa **Buscar y reemplazar** (Ctrl+H) para cada texto entre `[corchetes]`. Borra también los corchetes.
   - `[MUNEPE]`, `[319.000 €]`, `[319000]`, `[294,68 m²]`, `[28.734 m²]`…
   - `[+34 600 000 000]` / `[+34600000000]`, `[tu-email@ejemplo.com]`, `[Nombre del propietario]`
   - `[https://tu-dominio.com]` → la URL final (p. ej. `https://caserio-munepe.vercel.app`)
   - `[43.3460]` / `[-2.8730]` → coordenadas exactas (clic derecho sobre el punto en Google Maps)
2. **WhatsApp:** en `script.js` cambia `whatsappNumero` (con prefijo 34).
3. **Formulario:** crea una cuenta gratis en <https://formspree.io>, crea un formulario y pon su ID en lugar de `[TU_ID_FORMSPREE]`.
4. **Mapa:** Google Maps → Compartir → Insertar un mapa → copia la URL del `src` en el `<iframe>`.
5. **Fotos:** cópialas en `images/` con los nombres de `images/LEEME.txt`.

Para verlo en local basta con abrir `index.html` en el navegador (el formulario solo envía una vez publicado).

## 2. Publicar gratis

### Opción A · Vercel (la más rápida)
Necesitas [Node.js](https://nodejs.org) instalado. Desde la carpeta del proyecto:

```bash
npm install -g vercel
vercel login
vercel --prod
```
Responde a las preguntas con Enter (sin framework, directorio `./`). Te dará una URL `https://xxxx.vercel.app`.

### Opción B · GitHub Pages
Necesitas [Git](https://git-scm.com) y una cuenta en GitHub. Crea un repositorio vacío llamado `caserio-munepe` en github.com y luego:

```bash
git init
git add .
git commit -m "Web del caserío"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/caserio-munepe.git
git push -u origin main
```
En GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
En 1-2 minutos estará en `https://TU_USUARIO.github.io/caserio-munepe/`.

Para actualizar la web más adelante:
```bash
git add . && git commit -m "Actualizo fotos" && git push
```

### Opción C · Netlify (sin terminal)
Entra en <https://app.netlify.com/drop> y arrastra la carpeta del proyecto.

## 3. Después de publicar
- Comprueba la vista previa de WhatsApp en <https://www.opengraph.xyz> (WhatsApp guarda en caché la vista previa; si cambias la foto, prueba a compartir la URL con `?v=2` al final).
- Da de alta la web en [Google Search Console](https://search.google.com/search-console) y envía `sitemap.xml`.
- Opcional: un dominio propio (≈10 €/año) da más confianza, p. ej. `caseriomunepe.com`.
=======
# caserio-munepe
Página web del caserio Munepe para la venta

