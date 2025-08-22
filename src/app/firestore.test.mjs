import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

async function main() {
  const rules = readFileSync('firestore.rules', 'utf8');

  const testEnv = await initializeTestEnvironment({
    projectId: 'demo-project',
    firestore: { rules }
  });

  const alice = testEnv.authenticatedContext('alice');
  const aliceDb = alice.firestore();

  await assertSucceeds(
    aliceDb.collection('users').doc('alice').set({ name: 'Alice' })
  );

  await assertSucceeds(
    aliceDb.collection('users').doc('alice').get()
  );

  console.log('Write and read tests passed!');

  await testEnv.cleanup();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
