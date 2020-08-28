'use strict';

const { CronJob } = require('cron');
const { env, bucket } = require('./lib');

const job = new CronJob(env.schedule, async () => {
  await bucket.mirror(env.fromBucket, env.toBucket);
}, null, true, env.tz);

job.start();
