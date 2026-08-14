# Cortijo Pedro Jiménez

Web informativa del Cortijo Pedro Jiménez, finca para bodas y eventos
privados en Casares (Málaga). Sitio estático (HTML + CSS + JS, sin
frameworks ni base de datos), bilingüe (español / inglés).

## Ver el sitio en local

No hace falta instalar nada. Basta con abrir `index.html` en el navegador,
o levantar un servidor local sencillo desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
# y abrir http://localhost:8000
```

## Estructura

```
index.html              Toda la web (una sola página con secciones)
assets/css/style.css     Estilos
assets/js/main.js        Idioma, menú, galería y formulario de contacto
assets/images/           Fotos (extraídas del dosier del Cortijo)
CNAME                    Dominio propio para GitHub Pages
.github/workflows/       Despliegue automático a GitHub Pages
```

## Idioma (ES / EN)

Cada texto tiene sus dos versiones directamente en el HTML, con atributos
`data-es` y `data-en` (o `data-es-alt` / `data-en-alt` para descripciones
de imágenes). El botón ES/EN de la cabecera cambia el idioma sin recargar
la página y recuerda la elección del visitante. Para editar un texto,
busca la línea en `index.html` y cambia el valor en español y en inglés.

## Formulario de contacto

El formulario usa [Web3Forms](https://web3forms.com/), un servicio
gratuito que reenvía los mensajes del formulario directamente a un email,
sin necesidad de servidor propio ni base de datos.

**Antes de publicar, hay que activarlo:**

1. Entra en https://web3forms.com/ y crea una clave gratuita con el email
   `cortijopedrojimenez@gmail.com` (solo pide el email, no hace falta
   contraseña ni tarjeta).
2. Copiarán una "Access Key". Ábrela desde el email que te llega.
3. En `index.html`, busca la línea:
   ```html
   <input type="hidden" name="access_key" value="REEMPLAZA_CON_TU_ACCESS_KEY_DE_WEB3FORMS">
   ```
   y sustituye el valor por la clave recibida.
4. Guarda, haz commit y push. A partir de ahí, cada mensaje del formulario
   llegará por email.

Mientras no se configure la clave, el formulario avisa al visitante de que
debe escribir directamente a `cortijopedrojimenez@gmail.com`.

## Fotos

Las fotos de `assets/images/` se extrajeron del dosier en PDF del Cortijo.
Para añadir o cambiar fotos, sustituye los archivos en esa carpeta
(mantén nombres similares y un tamaño razonable, idealmente por debajo de
300–400 KB por foto para que la web cargue rápido) y actualiza las
referencias en `index.html` si añades imágenes nuevas.

## Pendiente de completar

Este dosier no incluye tarifas ni el texto legal de condiciones/contrato,
así que la sección "Tarifas y condiciones" se ha dejado con una
explicación general (presupuesto a medida) en vez de precios o cláusulas
inventadas. Cuando tengáis el texto definitivo de condiciones/contrato,
lo sustituimos en esa sección.

La sección "Disponibilidad" está preparada para incrustar más adelante un
calendario de Google Calendar público (de solo lectura). Cuando lo
tengáis listo, se puede añadir un `<iframe>` de Google Calendar en esa
sección de `index.html`.

## Despliegue (GitHub Pages + dominio propio)

Cada push a `main` despliega automáticamente a GitHub Pages mediante el
workflow en `.github/workflows/deploy-pages.yml`.

Para que `cortijopedrojimenez.com` apunte al sitio:

1. En el proveedor del dominio, crea un registro `A` apuntando a las IPs
   de GitHub Pages (`185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153`), o un `CNAME` a
   `ricaurtejuanc.github.io` si usas un subdominio como `www`.
2. En GitHub: **Settings → Pages**, activa Pages para la rama `main` y
   confirma el dominio personalizado `cortijopedrojimenez.com` (ya está
   declarado en el archivo `CNAME` del repositorio).
3. Espera a que se verifique el DNS (puede tardar unas horas) y activa
   "Enforce HTTPS" en la misma pantalla.
