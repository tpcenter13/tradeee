import { adminAuth } from '@/lib/firebase-admin';

export default async function handler(req, res) {
  try {
    const users = await adminAuth.listUsers();
    res.status(200).json({ success: true, count: users.users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
