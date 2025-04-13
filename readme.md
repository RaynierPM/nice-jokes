# Nice jokes (Discord bot)

## Basic scripts (NPM, YARN, pnpm, etc)

```bash
# Important note
# To use the initialization codes on local development use first ENVFILE inline environment variable with the name of .env.file
# For example:
#
# ENVFILE=.env.local npm run start (or npm run dev) --- Having .env.local on root project directory

#=== Init project
npm run init
# OR
node --run init

# Create a template of .env file

#=== Build
npm run build
# OR
node --run build
# Bundle the code

#=== Initialize (dev and prod)
npm run start
# OR
node --run start
# start the the builded proyect

npm run dev
# OR
node --run dev
# Start project on dev mode (with watch)
```

## Self-hosting

### SSL Certificate

On folder .ssl add the cerficate and private Key for HTTPS (TLS/SSL certificate)
and use the enviroemnt variable HTTPS (true or false)
to add it to the server.

```conf
HTTPS=0|1
```

If https is true you must to add the following configurations.

```conf
HTTPS_KEY_NAME=<CERT_PRIV_KEY_NAME>
HTTPS_CERT_NAME=<CERT_NAME>
```

> Certificates **must** be on .ssl/folder
> Recommended to create a **_symLink_** to reference the certificate created
