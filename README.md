## Desarrollo

1. Descargar los **archivos necesarios** _(solo una vez)_:

    ```powershell
    sudo apt-get install git-lfs
    git lfs install
    git lfs pull
    ```

2. Instalar `mkcert` y crear certificados confiables **locales**:

    ```powershell
    # Instalar chocolatey
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    # Instalar mkcert (debe ser una powershell con permisos de administrador)
    choco install mkcert
    # Crear CA
    mkcert -install
    # Generar certificados en la carpeta docker/certs
    Push-Location docker/traefik/certs; mkcert localhost; Pop-Location
    ```

3. Servicios del docker-compose:

    ```powershell
    # Ejecutar
    docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build
    docker compose -f docker-compose.dev.yml --env-file .env.dev build --no-cache
    docker compose -f docker-compose.dev.yml --env-file .env.dev up -d
    # Detener
    docker compose -f docker-compose.dev.yml down -v
    ```

## Producción

- docker compose up -d --build

## Utilidades

- WPGraphQL
- WPGraphQL WooCommerce: https://github.com/wp-graphql/wp-graphql-woocommerce
- 