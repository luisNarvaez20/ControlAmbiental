# Monitoreo PIS

## Descripción

Este proyecto consiste en una aplicación web desarrollada para el **monitoreo de condiciones ambientales**, permitiendo visualizar indicadores como **temperatura, humedad y concentración de CO₂**.

La aplicación está compuesta por un **backend**, encargado de gestionar la lógica y los datos del sistema, y un **frontend**, encargado de proporcionar la interfaz web para la visualización de la información.

El proyecto fue desarrollado como parte de un **Proyecto Integrador de Saberes (PIS)** y está orientado al seguimiento de variables ambientales mediante una interfaz web. Además, cuenta con configuración para su ejecución tanto de forma manual como mediante **Docker y Docker Compose**.

## Tecnologías

- Node.js
- npm
- Docker
- Docker Compose

## Despliegue Manual

### Requisitos

- Node.js
- npm
- Git

### Instrucciones

1. Clonar el repositorio o descargar el repositorio en formato `.zip`:

   ```bash
   git clone https://github.com/Thaisncp/monitoreo_pis6to.git
   cd monitoreo_pis6to
Configurar y ejecutar el backend

Ingresar al directorio del backend e instalar las dependencias:
```bash
cd backend_monitoreo
npm install
npm start

El backend se iniciará utilizando la configuración definida en el proyecto.

Configurar y ejecutar el frontend

En una nueva terminal, ingresar al directorio del frontend e instalar las dependencias:
```bash
cd monitoreo_pis6to/frontend_monitoreo
npm install
npm start

El frontend se iniciará utilizando la configuración definida en el proyecto.

Despliegue con Docker
Requisitos
Docker
Docker Compose
Instrucciones

Clonar el repositorio:
```bash
git clone https://github.com/Thaisncp/monitoreo_pis6to.git
cd monitoreo_pis6to

Ejecutar Docker Compose:
```bash
docker-compose up --build

Este comando construirá las imágenes necesarias y desplegará tanto el backend como el frontend utilizando contenedores Docker.

Detener los contenedores

Para detener los servicios y eliminar los contenedores creados por Docker Compose:
```bash
docker-compose down

Notas adicionales
Asegúrate de que los puertos utilizados por el backend y frontend estén disponibles y no estén siendo utilizados por otros servicios.

Si realizas cambios en las dependencias o en la configuración de Docker, puedes reconstruir los servicios utilizando:
```bash
docker-compose up --build

Para ejecutar el proyecto manualmente, es necesario instalar las dependencias de cada componente mediante npm install.
El backend y el frontend pueden ejecutarse de forma independiente durante el desarrollo.
Docker Compose permite ejecutar ambos componentes de manera conjunta mediante contenedores.

Este README proporciona las instrucciones necesarias para instalar, ejecutar y desplegar el proyecto, tanto de forma manual como utilizando Docker y Docker Compose.
