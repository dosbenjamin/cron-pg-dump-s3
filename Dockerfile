FROM denoland/deno:latest

RUN apt update && apt install -y --no-install-recommends postgresql-client

WORKDIR /app
USER deno

COPY index.ts .
RUN deno cache index.ts

CMD ["run", "--allow-all", "index.ts"]
