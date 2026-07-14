FROM denoland/deno:alpine

WORKDIR /app

COPY deno.json deno.lock main.ts ./

RUN deno install --entrypoint main.ts

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 8000

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read=.env", "main.ts"]
