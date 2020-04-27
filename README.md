INSTALACIÓN

1. clonar el repositorio
2. ejecutar npm i
3. ejecutar comando npm run dev

TESTS

1. ejecutar comando npm run test

Para ejecutar los sets de test de un fichero concreto

1. ejecutar comando npm run test test/<<nombre-fichero>>

CONSIDERACIONES

El presente código está orientado a montar una API REST muy básica en node + express.

Para poder compartir información entre los diferentes ficheros de routes bajo la carpeta /routes, se han creado variables globales en express de forma que se pueda acceder/modificar desde cualquier punto (práctica desaconsejada pero permitida con fines didácticos)

No se ha tenido en cuenta la realización de validaciones de datos así como uso de un sistema de generación de identificadores fiables u otras características que deberían estar presentes en un proyecto real. Esto se ha codificado así para centrar el tiro en la generacion de una API REST con node + express.

Para más información sobre generación de ids/uuids buscar 'uuid npm' (ej. https://www.npmjs.com/package/uuid)

la dependencia slugify permite generar lo que se conocen como 'slugs'. Dado que el identificador viene de la URL y esta debe ser comprensible y recordable por el usuario que la usa, para acceder a recursos que deben ser compartidos se accederá mediante un slug en lugar de su identificador interno. Ver más información aquí: https://www.ondho.com/que-es-slug-como-crearlo/

De momento para hacer test con diferentes niveles de usuarios no hay test automáticos, habrá que probar manualmente con tokens con diferentes niveles de usuario (user y admin).

Los métodos DELETE /orders y PUT /contacts/:id no existen dado que el diseño de la API así lo prohible. Se podría haber creado 2 test en concreto que verificaran que al llamar a esos métodos devuelve sendos errores 404.

Se ha limitado mediante un middleware configurable el acceso a diferentes métodos pero únicamente en aquellos que haga falta. El middleware permite interceptar la petición, comprobar si es necesario que haya un usuario autenticado (reciba un token) y que el perfil que tiene es uno de los permitidos para dicha acción.
