


# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
    npm install
```

3. Levantar la base de datos

```
    docker-compose up -d
```

4. Clonar el archivo **.env.example** y renombrarlo a **.env**

5. Llenar las variables de entorno definidas en el **.env**

6. Ejecutar la app en desarrollo

```
    npm run dev
```


# Build de producción

1. Poner la variable de entorno en .env MONGODB_URI, con la cadena de conexión de MongoDB de producción

## Stack utilizado

- NodeJs
- Express
- MongoDB
