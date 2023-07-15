import { load } from "https://deno.land/std@0.194.0/dotenv/mod.ts";
import { everyMinute } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";

const env = await load();

await new Deno.Command("brew", {
  args: ["install", "libpq"],
}).output();

await new Deno.Command("brew", {
  args: ["link", "--force", "libpq"],
}).output();

everyMinute(async () => {
  const { stdout: dump } = await new Deno.Command("pg_dump", {
    args: [env.DB_CONNECTION_URL],
  }).output();

  await Deno.writeFile(`./${env.DUMP_NAME}-${Date.now()}.sql`, dump);
});
