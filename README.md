# 🔗 Stripchat M3U8 Extractor

Una extensión para Chrome que extrae automáticamente enlaces `.m3u8` de los videos en vivo de Stripchat, permitiendo acceder directamente a las resoluciones disponibles para un/a modelo. Útil para usuarios que deseen visualizar o descargar transmisiones mediante reproductores externos como VLC.

---

## 🧩 Características

- Extrae automáticamente el ID del stream desde la pestaña activa.
- Muestra un botón de **"Auto"** (modo adaptable) de inmediato.
- Carga y muestra resoluciones disponibles como `1080p`, `720p60`, `480p`, etc.
- Spinner de carga mientras se consultan las resoluciones.
- Permite abrir los enlaces directamente en una nueva pestaña.

---

## ⚙️ Instalación manual

1. Clona o descarga este repositorio:

   ```bash
   git clone https://github.com/Ni-tti/stripchat-m3u8-extractor.git
   ```

2. Abre Google Chrome y navega a:  
   `chrome://extensions/`

3. Activa el **Modo desarrollador** (arriba a la derecha).

4. Haz clic en **“Cargar descomprimida”** y selecciona la carpeta del repositorio.

---

## 🧠 Consideraciones técnicas

- La API de Stripchat no permite CORS, por lo tanto las peticiones se delegan al `background.js` usando `chrome.runtime.sendMessage`.
- Se consultan 4 endpoints diferentes:
  - `trans`, `girls`, `couples`, `men`
- El botón **Auto** se muestra inmediatamente, mientras que las resoluciones se muestran al completar la carga.

---

## 🧑‍💻 Autor

Desarrollado por [Nitti](https://github.com/Ni-tti).

¿Te gusta? ¡Contribuciones, estrellas y forks son bienvenidos!
