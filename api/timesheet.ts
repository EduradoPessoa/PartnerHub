import { db } from './_lib/db';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
     try {
         const { rows } = await db.query('SELECT * FROM timesheet ORDER BY created_at DESC');
         
         const timesheet = rows.map((r: any) => ({
             id: r.id,
             userId: r.user_id,
             opportunityId: r.opportunity_id,
             date: r.date, // might need formatting depending on how pg returns date
             hours: parseFloat(r.hours),
             description: r.description
         }));
         return res.status(200).json(timesheet);
     } catch (error) {
         console.error('Database Error:', error);
         return res.status(500).json({ error: 'Failed to fetch timesheet' });
     }
  }

  if (req.method === 'POST') {
     const data = req.body;
     const items = Array.isArray(data) ? data : [data];

     try {
         for (const entry of items) {
             await db.query(`
                 INSERT INTO timesheet (
                    id, user_id, opportunity_id, date, hours, description
                 )
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (id) DO UPDATE SET
                 user_id = EXCLUDED.user_id,
                 opportunity_id = EXCLUDED.opportunity_id,
                 date = EXCLUDED.date,
                 hours = EXCLUDED.hours,
                 description = EXCLUDED.description
             `, [
                 entry.id,
                 entry.userId,
                 entry.opportunityId,
                 entry.date,
                 entry.hours,
                 entry.description
             ]);
         }
         return res.status(200).json({ success: true });
     } catch (error) {
         console.error('Database Error:', error);
         return res.status(500).json({ error: 'Failed to save timesheet' });
     }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
