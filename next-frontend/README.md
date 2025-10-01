### Detalle de Lógica de Desarrollo con Next.js 15

#### Para obtención de datos inicial al entrar a una ruta, se usan **2 archivos** por página:

- `page.tsx`: Guarda en un **objeto** la respuesta de una solicitud http que se ejecuta en el **servidor**. De este modo se obtiene cualquier dato de forma segura sin necesidad de que el cliente haga una solicitud http.

- `page.client.tsx`: Es **llamado** como componente en el archivo `page.tsx` recibiendo como **parámetro** el objeto respuesta de la solicitud http. 

#### Para interacción del cliente con **el o algún** servidor hay **2 escenarios**:

1. No es importante ocultar la lógica o URL final a la que se quiera hacer el llamado via http.

    - Se crea un servicio en src/services/**archivo.service.ts** y ese archivo debe manejar la lógica de interacción con cualquier servicio externo.
    - Este archivo es enviado al cliente por lo que no debe contener información sensible.
    - Cualquier variable de entorno definida en `.env` que se quiera utilizar en este servicio, debe comenzar con **NEXT_PUBLIC_** ya que será enviada al cliente.

2. Si es importante ocultar la lógica o URL final a la que se quiera hacer el llamado via http.

    - Se crea un endpoint en src/app/api/**ruta**/route.ts y ese archivo debe manejar la lógica de interacción con cualquier servicio externo.
    - Este archivo es ejecutado en el servidor por lo que puede contener información sensible.
    - Cualquier variable de entorno definida en `.env` que se quiera utilizar en este servicio, no debe comenzar con **NEXT_PUBLIC_** ya que será ejecutada en el servidor y puede contener información sensible.

### Detalle de Carpetas y Archivos (rutas)

- src/app/**layout.tsx**: Archivo principal de layout
- src/app/**page.tsx**: Página principal (ejecutada en el servidor para traer los datos de los productos)
- src/app/**page.client.tsx**: Página principal (componente que recibe los datos de productos y los muestra en el cliente)
- src/app/producto/**[slug]**/page.tsx: Página de producto (ejecutada en el servidor para traer los datos del producto)
- src/app/producto/**[slug]**/page.client.tsx: Página de producto (componente que recibe los datos del producto y los muestra en el cliente)
