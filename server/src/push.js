import 'dotenv/config';
import webpush from 'web-push';
import { listPushSubscriptions, deletePushSubscription } from './db/index.js';

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:example@example.com';

const enabled = Boolean(publicKey && privateKey);

if (enabled) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export function isPushEnabled() {
  return enabled;
}

export async function sendPushToAll(payload) {
  if (!enabled) return;

  const subscriptions = await listPushSubscriptions();
  const body = JSON.stringify(payload);

  await Promise.all(
    subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      };
      try {
        await webpush.sendNotification(pushSubscription, body);
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await deletePushSubscription(sub.endpoint);
        } else {
          console.error('Error enviando push:', err.message);
        }
      }
    })
  );
}
