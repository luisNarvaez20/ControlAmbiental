# Monitoreo PIS

## Descripción
Este proyecto permite el monitoreo de indicadores ambientales como temperatura, humedad y CO2. Incluye tanto un backend como un frontend.

## Despliegue Manual

### Requisitos
- Node.js
- npm

### Instrucciones

1. Clonar el repositorio o descargar el repositorio en archivo .zip:
   ```bash
   git clone https://github.com/Thaisncp/monitoreo_pis6to.git

### Configurar y ejecutar el backend:
    cd monitoreo_pis6to/backend_monitoreo
    npm install
    npm start

Configurar y ejecutar el frontend:

    cd ../frontend_monitoreo
    npm install
    npm start

### Despliegue con Docker
Requisitos

    Docker
    Docker Compose

Instrucciones

Clonar el repositorio:

    git clone https://github.com/tu_usuario/monitoreo_pis6to.git

Ejecutar Docker Compose:

    cd monitoreo_pis6to
    docker-compose up --build

Esto construirá y desplegará tanto el backend como el frontend utilizando Docker.
Notas Adicionales

Asegúrate de que los puertos necesarios estén disponibles y no estén siendo utilizados por otros servicios.
    Puedes detener los contenedores de Docker con el siguiente comando:

    docker-compose down

### ENLACE A APP DESPLEGADA

      https://calm-cliff-0dc42120f.5.azurestaticapps.net/

Este README proporciona instrucciones claras para desplegar el proyecto tanto manualmente como con Docker.
