<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Teslo API

1. Clonar proyecto
2. ```yarn install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos ```docker-compose up -d```
6. Levantar: ```yarn start:dev```
7. Ejecutar SEED ```http://localhost:3000/api/seed```

# Test
1. Ejecutar test ``` yarn run test --watchAll ```
2. Ver detalle en test: una vez ejecutado el test, con el 
mensaje de error en terminal, en las opciones, ir a opcion P,
y escribir products.controller o products.service para ver 
el detalle del error

3. Covertura de los test ``` yarn run test:cov ```
