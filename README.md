# PWA Tareas Offline

Hola, este proyecto es una aplicación de tareas que funciona incluso si no tienes conexión a internet. La app está construida en Angular (usando Angular Material para el diseño) y el backend usa NestJS con una base de datos SQLite. Cuando recuperas conexión, todo lo que hiciste offline se sincroniza automáticamente.

---

## ¿Por qué elegí estas tecnologías?

- **Angular:** porque es robusto, fácil de mantener y tiene muy buen soporte para hacer aplicaciones PWA (Progressive Web App).
- **Angular Material:** me permite lograr un diseño visual atractivo y responsivo sin complicarme con el CSS.
- **NestJS:** es un framework para Node.js muy organizado, ideal para crear APIs bien estructuradas.
- **SQLite:** es rápido de instalar y perfecto para pruebas locales.
- **IndexedDB (con la librería idb):** permite guardar los datos en el navegador cuando el usuario está offline.
- **Service Worker:** se encarga de que la app funcione e instale como si fuera una aplicación móvil o de escritorio, y que cargue aunque no tengas internet.

---

## ¿Cómo funciona la sincronización offline/online?

- Cuando el usuario crea tareas, si no hay conexión a internet, se guardan localmente en el navegador (usando IndexedDB).
- Cuando la conexión vuelve, La app da opciones para que el usuario pueda elegir que sincronizar en caso tal de que un usuario cometa errores previos al guardar.
- Cada tarea muestra si está "pendiente" o "sincronizada", así el usuario siempre sabe el estado.
- El backend guarda las tareas en una base de datos SQLite para que no se pierdan.

---

## Cosas técnicas importantes

- **Almacenamiento local:** Uso IndexedDB para almacenar tareas offline y la librería idb para hacerlo más simple.
- **Política de reintento:** Si la sincronización falla, se vuelve a intentar cuando regrese la conexión.
- **Manejo de errores:** Si algo falla al sincronizar, las tareas quedan marcadas como "pendiente" y se reintenta después.  
- **PWA:** Angular maneja el manifest y el service worker para que la app funcione offline y sea instalable en cualquier dispositivo.
- **Interfaz responsive:** Con Angular Material, la app se adapta bien a celular, tablet y escritorio.

---

## ¿Cómo correr el proyecto localmente?

### 1. Requisitos
- Tener instalado Node.js (recomendado v18 o superior)
- Tener npm (v9 o superior)

---

### 2. Levantar el backend (NestJS)


cd backend-pwa
npm install
npm run start:dev

### 3. Levantar el backend (AngularJS)
cd frontend-pwa
npm install
ng serve
