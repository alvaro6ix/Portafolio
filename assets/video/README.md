# Videos de proyectos (.webm)

Los videos de esta carpeta se muestran **encima** de la imagen del proyecto.
Si el archivo no existe todavía, el portafolio simplemente muestra la imagen —
no se rompe nada. En cuanto pongas el `.webm` con el nombre exacto, aparece solo.

## Nombres esperados y estado

| Archivo             | Proyecto                  | Estado                    |
|---------------------|---------------------------|---------------------------|
| `sicametcrm.webm`   | CRM & Bot SICAMET         | ✅ 0.57 MB (30 s)         |
| `portalcert.webm`   | Portal de Certificados    | ✅ 0.72 MB (34 s)         |
| `vaultsicamet.webm` | Gestor de Contraseñas     | ✅ 0.50 MB (23 s)         |
| `ticketsapp.webm`   | Tickets & Proyectos       | ✅ 0.47 MB (37 s)         |
| `sibelle.webm`      | Sibelle Psicología        | ✅ 0.56 MB (30 s) vertical |

`vaultsicamet.webm` está **desactivado en el HTML** (comentado): la grabación
muestra nombres reales del personal, sus usuarios de correo y las URLs internas.
Regrabar con datos ficticios antes de reactivarlo.

El *Verificador de Perfil Térmico* y el *Generador de Certificados* usan
**captura fija**, no video.

Los originales sin comprimir (92 MB) quedaron en `_originales/`. **Puedes borrar
esa carpeta** cuando estés conforme con el resultado — no la usa el sitio.

### Videos verticales

Si el clip es vertical (grabado en marco de teléfono), agrégale la clase
`work__video--portrait` para que se vea completo en lugar de recortado:

```html
<video class="work__video work__video--portrait" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1">
```

## Comportamiento

- **Desktop**: el video se reproduce al pasar el mouse sobre la tarjeta y se
  reinicia al salir.
- **Móvil / táctil**: se reproduce automáticamente mientras la tarjeta está en pantalla.
- Siempre en **silencio** y en **loop**.
- Con `prefers-reduced-motion` activado no se reproduce (solo queda la imagen).

## Recomendaciones para grabar

- **Relación de aspecto**: 4:3 (la tarjeta recorta a ~800×600). Cualquier otra
  proporción también funciona, pero se recorta con `object-fit: cover`.
- **Resolución**: 1280×960 es más que suficiente. No hace falta 4K.
- **Duración**: 6–15 segundos en loop. Muestra una sola acción clara por video.
- **Sin audio**: el audio se ignora, así que quítalo para bajar el peso.
- **Peso objetivo**: menos de 2 MB por video. Idealmente ~1 MB.
- **Datos sensibles**: recuerda que estos proyectos son privados/NDA — usa datos
  de prueba o desenfoca nombres de clientes reales antes de grabar.

### Comprimir con ffmpeg

Estos son los comandos que se usaron (bajan ~95% el peso). La clave es reducir
de 60 fps a 24 y escalar a 900 px de ancho:

```bash
# Horizontal
ffmpeg -i original.webm -c:v libvpx-vp9 -crf 34 -b:v 0 -an -r 24 \
  -vf "scale=900:-2" -row-mt 1 -cpu-used 4 salida.webm

# Vertical (marco de teléfono)
ffmpeg -i original.webm -c:v libvpx-vp9 -crf 34 -b:v 0 -an -r 24 \
  -vf "scale=-2:640" -row-mt 1 -cpu-used 4 salida.webm

# Recortar a 30 s desde el inicio: agrega -t 30
# Recortar desde el segundo 45: agrega -ss 45 -t 30
```

Sube el `-crf` (por ejemplo a 40) si necesitas archivos más ligeros; bájalo
(por ejemplo a 30) si quieres más calidad.

## Cómo agregar video a otro proyecto

Dentro de su `.work__img-wrap` en `index.html`, después del `<img>`:

```html
<video class="work__video" muted loop playsinline preload="metadata" aria-hidden="true" tabindex="-1">
    <source src="assets/video/NOMBRE.webm" type="video/webm">
</video>
```
