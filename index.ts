import { load } from 'https://deno.land/std@0.194.0/dotenv/mod.ts';
import { Cron } from 'npm:croner';
import { PutObjectCommand, S3Client } from 'npm:@aws-sdk/client-s3';

const env = await load();

const command = new Deno.Command('pg_dump', {
  args: [env.DB_CONNECTION_URL],
});

const client = new S3Client({
  region: 'auto',
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

const textDecoder = new TextDecoder();

Cron(env.CRON_PATTERN, async (): Promise<void> => {
  const { stdout: dump } = await command.output();

  await client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: `${env.DUMP_NAME}-${Date.now()}.sql`,
      Body: textDecoder.decode(dump),
    }),
  );
});
