# 🛡️ PrevIA – Protege tus textos

**Versión:** v0.1.1  
**Autora:** Sara Cubero García-Conde  
**Año:** 2025  

Extensión para navegador (Firefox / Edge / Chrome) que analiza y transforma textos para **proteger información personal (PII)** antes de compartirla con herramientas de inteligencia artificial.  
Todo el procesamiento se realiza **100 % localmente**, sin enviar datos a servidores externos.

---

## 🚀 Funcionalidad principal

PrevIA permite:

- Analizar texto y **detectar datos personales** (nombre, DNI, teléfono, correo, IBAN, direcciones, URLs, etc.).
- **Seudonimizar**, **generalizar** o **anonimizar manualmente** la información detectada.
- Exportar el texto procesado de forma segura (`.txt` con marca temporal).
- Evaluar el **riesgo estimado (bajo, medio, alto)** según la cantidad de datos sensibles.
- Insertar avisos predefinidos (p. ej. *Confidencialidad*, *Citación académica*, *Tono institucional*).
- Personalizar los tipos de protección activos.
- Mantener un uso completamente **offline y privado** (sin tráfico de red ni almacenamiento de contenido).

---

## 🧩 Estructura técnica

El proyecto está desarrollado en **JavaScript, HTML y Bootstrap**, siguiendo el estándar de extensiones **Manifest V3**.

### Archivos principales

| Archivo | Descripción |
|----------|--------------|
| `popup.html` | Interfaz principal de la extensión. |
| `todo.js` | Lógica de análisis, detección, transformación y eventos. |
| `patterns.js` | Expresiones regulares y tokens de sustitución. |
| `utils.js`, `ui.js` | Funciones auxiliares y renderizado. |
| `manifest.json` | Configuración de permisos y recursos de la extensión. |

### Flujo interno

1. **Entrada de texto**  
2. **Análisis PII**  
3. **Transformación (seudonimizar / generalizar / anonimizar)**  
4. **Revisión manual**  
5. **Exportación o copia segura**

---

## 🧠 Principios de diseño

- **Privacy by Design**: todo se ejecuta localmente, sin exfiltración de datos.  
- **Security by Default**: permisos mínimos y revisión manual recomendada.  
- **Uso responsable**: la herramienta no sustituye el juicio humano.  
- **Modularidad y trazabilidad**: patrones fácilmente actualizables.

---

## ⚙️ Instalación

### En Firefox

1. Ve a `about:debugging#/runtime/this-firefox`.  
2. Pulsa **“Cargar complemento temporal”**.  
3. Selecciona el archivo `manifest.json` del proyecto.

### En Microsoft Edge / Chrome

1. Accede a `edge://extensions` o `chrome://extensions`.  
2. Activa el **modo de desarrollador**.  
3. Usa **“Cargar descomprimida”** y elige la carpeta del proyecto.

---

## 🧾 Ejemplo rápido

1. Pega un texto con datos personales en el campo de entrada.  
2. Pulsa **Analizar** → verás un resumen de hallazgos y el nivel de riesgo.  
3. Usa **Seudonimizar** o **Generalizar** para generar una versión segura.  
4. Descarga el texto o cópialo al portapapeles.  

---

## 🧩 Dependencias

- **Bootstrap 5.3** (interfaz)  
- APIs estándar de **JavaScript ES6**  
- Sin dependencias externas ni librerías conectadas a Internet.

---

## 🔐 Licencias

Este proyecto combina **dos licencias complementarias**, una para el código y otra para la documentación:

- **Código fuente:**  
  Distribuido bajo la licencia [GNU General Public License v3.0 (GPLv3)](https://www.gnu.org/licenses/gpl-3.0.txt).  
  Permite uso, copia y modificación, siempre manteniendo la misma licencia.

- **Documentación, memoria y materiales (PDF, textos, imágenes):**  
  © 2025 Sara Cubero García-Conde.  
  Licencia [Creative Commons Reconocimiento-NoComercial-CompartirIgual 4.0 (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).

---

## 🧭 Enlaces útiles

- 🌐 **Sitio web:** [https://sarafullstack.github.io](https://sarafullstack.github.io)  
- 💻 **Código fuente:** [https://github.com/SaraFullStack/PrevIA](https://github.com/SaraFullStack/PrevIA)  
- 🧾 **Extensión Edge:** [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/previa-%E2%80%93-protege-tus-text/kofcadpkohaomaabekmdkelbfpjcekpg)  
- 🦊 **Extensión Firefox:** [addons.mozilla.org/es-ES/firefox/addon/previa/](https://addons.mozilla.org/es-ES/firefox/addon/previa/)

---

## ⚖️ Aviso ético

PrevIA promueve el uso responsable de la inteligencia artificial.  
El resultado generado debe revisarse manualmente para evitar falsos positivos o pérdida de contexto.  
No debe utilizarse para automatizar decisiones que afecten a personas ni para sustituir procesos de cumplimiento legal.
