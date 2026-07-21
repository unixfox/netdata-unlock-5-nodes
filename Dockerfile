FROM denoland/deno:alpine-2.9.3

RUN apk add --no-cache tini

RUN addgroup --gid 10001 --system app \
 && adduser --uid 10000 --system --ingroup app --home /home/app app

WORKDIR /app

ENV DENO_DIR=/deno-dir
RUN mkdir -p /deno-dir

COPY deno.json deno.lock main.ts ./
RUN deno cache main.ts \
 && chown -R 10000:10001 /deno-dir /app

USER app

EXPOSE 8000

ENTRYPOINT ["/sbin/tini", "--", "deno"]
CMD ["run", "--allow-net", "--allow-env", "--allow-read=.env", "main.ts"]
