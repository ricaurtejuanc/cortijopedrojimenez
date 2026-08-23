# Cortijo Pedro Jiménez

Web informativa del Cortijo Pedro Jiménez, finca para bodas y eventos
privados en Casares (Málaga). Sitio estático (HTML + CSS + JS, sin
frameworks), bilingüe (español / inglés). Usa Supabase únicamente para
contar visitas y mostrarlas en un panel de administración privado.

## Ver el sitio en local

No hace falta instalar nada. Basta con abrir `index.html` en el navegador,
o levantar un servidor local sencillo desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
# y abrir http://localhost:8000
```

## Estructura

```
index.html               Toda la web (una sola página con secciones)
admin.html                Panel de administración privado (estadísticas de visitas)
assets/css/style.css      Estilos de la web
assets/css/admin.css      Estilos del panel de administración
assets/js/main.js         Idioma, menú, galería y formulario de contacto
assets/js/track.js        Registra una visita en Supabase en cada carga de página
assets/js/admin.js        Login y estadísticas del panel de administración
assets/images/            Fotos (extraídas del dosier del Cortijo)
robots.txt                Evita que /admin.html aparezca en buscadores
CNAME                     Dominio propio para GitHub Pages
.github/workflows/        Despliegue automático a GitHub Pages
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

## Panel de administración (visitas y mensajes)

La web registra automáticamente, en una base de datos de
[Supabase](https://supabase.com/) creada solo para este sitio (proyecto
`cortijopedrojimenez_web`):

- **Una visita** (página y fecha, sin cookies ni datos personales) cada vez
  que alguien carga la web.
- **Un envío del formulario de contacto** (solo nombre, email y fecha —
  nunca el texto del mensaje) cada vez que se manda correctamente por
  Web3Forms.

El panel está en `/admin.html` (por ejemplo,
`https://cortijopedrojimenez.com/admin.html`) y muestra, para cada uno de
los dos: hoy, últimos 7 días, últimos 30 días, total histórico, y un
desglose día a día.

El contenido de los mensajes (lo que ha escrito cada persona) **no** se
guarda aquí, para no duplicarlo — se lee en el panel de
[Web3Forms](https://web3forms.com/) (ver más arriba). El panel propio solo
sirve para ver cuánta gente visita la web y cuánta llega a escribir.

**Antes de poder entrar al panel, hay que crear tu usuario** (esto se hace
una sola vez y solo tú puedes hacerlo, la web no tiene ningún formulario
de registro público):

1. Entra en https://supabase.com/dashboard/project/mrejqzsmuqxncupwfezq
   con la cuenta de Supabase que ya está conectada.
2. Ve a **Authentication → Users → Add user → Create new user**.
3. Escribe el email y la contraseña que quieras usar para entrar al panel
   (por ejemplo `cortijopedrojimenez@gmail.com` y una contraseña propia), y
   marca **"Auto Confirm User"** para no tener que verificar el email.
4. Ya puedes entrar en `/admin.html` con ese email y contraseña.

Al no haber ningún registro público, nadie más puede crear una cuenta ni
ver las estadísticas aunque encuentre la URL del panel.

## Pendiente de completar

La sección "Tarifas y condiciones" refleja el documento
`Rates and Conditions 2026`. Cuando cambien los precios o las condiciones
de una temporada a otra, hay que actualizar a mano la tabla y las tarjetas
correspondientes en `index.html` (sección `id="condiciones"`), en español
e inglés.

La web es solo informativa: no muestra disponibilidad ni calendario de
reservas, a petición expresa de la propiedad. Las consultas de fecha se
gestionan por el formulario de contacto o directamente por teléfono/email.

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
