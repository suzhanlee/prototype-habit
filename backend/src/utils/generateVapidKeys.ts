/**
 * Generate VAPID keys for Web Push notifications
 * Run this script once to generate keys and add them to your .env file
 */
import webpush from 'web-push';

function generateVapidKeys() {
  const vapidKeys = webpush.generateVAPIDKeys();

  console.log('='.repeat(80));
  console.log('VAPID Keys Generated Successfully!');
  console.log('='.repeat(80));
  console.log('\nAdd these to your backend .env file:\n');
  console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
  console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
  console.log(`VAPID_SUBJECT=mailto:admin@habittracker.com`);
  console.log('\n' + '='.repeat(80));
  console.log('\nKeep the private key SECRET and never commit it to version control!');
  console.log('='.repeat(80) + '\n');

  return vapidKeys;
}

if (require.main === module) {
  generateVapidKeys();
}

export { generateVapidKeys };
