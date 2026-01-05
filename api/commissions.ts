import { db } from './_lib/db';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
     try {
         const { rows } = await db.query('SELECT * FROM commissions ORDER BY created_at DESC');
         
         const commissions = rows.map((r: any) => ({
             id: r.id,
             opportunityId: r.opportunity_id,
             type: r.type,
             amount: parseFloat(r.amount),
             status: r.status,
             dueDate: r.due_date,
             invoiceUrl: r.invoice_url,
             paidAt: r.paid_at
         }));
         return res.status(200).json(commissions);
     } catch (error) {
         console.error('Database Error:', error);
         return res.status(500).json({ error: 'Failed to fetch commissions' });
     }
  }

  if (req.method === 'POST') {
     const data = req.body;
     const items = Array.isArray(data) ? data : [data];

     try {
         for (const com of items) {
             await db.query(`
                 INSERT INTO commissions (
                    id, opportunity_id, type, amount, status, due_date, invoice_url, paid_at
                 )
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (id) DO UPDATE SET
                 opportunity_id = EXCLUDED.opportunity_id,
                 type = EXCLUDED.type,
                 amount = EXCLUDED.amount,
                 status = EXCLUDED.status,
                 due_date = EXCLUDED.due_date,
                 invoice_url = EXCLUDED.invoice_url,
                 paid_at = EXCLUDED.paid_at
             `, [
                 com.id,
                 com.opportunityId,
                 com.type,
                 com.amount,
                 com.status,
                 com.dueDate,
                 com.invoiceUrl,
                 com.paidAt
             ]);
         }
         return res.status(200).json({ success: true });
     } catch (error) {
         console.error('Database Error:', error);
         return res.status(500).json({ error: 'Failed to save commissions' });
     }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
