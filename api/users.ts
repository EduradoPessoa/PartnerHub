import { db } from './_lib/db';

export default async function handler(req: any, res: any) {
  // CORS handling (if needed for local dev, but mostly handled by Vite proxy)
  
  if (req.method === 'GET') {
     try {
         const { rows } = await db.query('SELECT * FROM users ORDER BY created_at DESC');
         
         const users = rows.map((r: any) => ({
             id: r.id,
             name: r.name,
             role: r.role,
             email: r.email,
             avatar: r.avatar,
             location: r.location,
             phone: r.phone,
             leaderId: r.leader_id,
             pjDetails: r.pj_details || undefined
         }));
         return res.status(200).json(users);
     } catch (error) {
         console.error('Database Error:', error);
         return res.status(500).json({ error: 'Failed to fetch users' });
     }
  }

  if (req.method === 'POST') {
     const data = req.body;
     
     if (!data) {
         return res.status(400).json({ error: 'No data provided' });
     }

     const users = Array.isArray(data) ? data : [data];

     try {
         // Transaction-like behavior (optional, but good)
         // For simplicity in Vercel Postgres, just loop.
         for (const user of users) {
             await db.query(`
                 INSERT INTO users (id, name, role, email, avatar, location, phone, leader_id, pj_details)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (id) DO UPDATE SET
                 name = EXCLUDED.name,
                 role = EXCLUDED.role,
                 email = EXCLUDED.email,
                 avatar = EXCLUDED.avatar,
                 location = EXCLUDED.location,
                 phone = EXCLUDED.phone,
                 leader_id = EXCLUDED.leader_id,
                 pj_details = EXCLUDED.pj_details
             `, [
                 user.id, 
                 user.name, 
                 user.role, 
                 user.email, 
                 user.avatar, 
                 user.location, 
                 user.phone, 
                 user.leaderId, 
                 user.pjDetails ? JSON.stringify(user.pjDetails) : null
             ]);
         }
         return res.status(200).json({ success: true });
     } catch (error) {
         console.error('Database Error:', error);
         return res.status(500).json({ error: 'Failed to save users' });
     }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
