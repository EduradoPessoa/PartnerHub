import { db } from './_lib/db';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
     try {
         const { rows } = await db.query('SELECT * FROM opportunities ORDER BY created_at DESC');
         
         const opportunities = rows.map((r: any) => ({
             id: r.id,
             executiveId: r.executive_id,
             companyName: r.company_name,
             cnpj: r.cnpj,
             contactName: r.contact_name,
             contactEmail: r.contact_email,
             projectType: r.project_type,
             estimatedValue: parseFloat(r.estimated_value),
             status: r.status,
             temperature: r.temperature,
             notes: r.notes,
             engineering: r.engineering_data || undefined,
             files: r.files || [],
             paymentConditions: r.payment_conditions,
             projectStartDate: r.project_start_date,
             projectDeadline: r.project_deadline,
             createdAt: r.created_at
         }));
         return res.status(200).json(opportunities);
     } catch (error) {
         console.error('Database Error:', error);
         return res.status(500).json({ error: 'Failed to fetch opportunities' });
     }
  }

  if (req.method === 'POST') {
     const data = req.body;
     const items = Array.isArray(data) ? data : [data];

     try {
         for (const op of items) {
             await db.query(`
                 INSERT INTO opportunities (
                    id, executive_id, company_name, cnpj, contact_name, contact_email, 
                    project_type, estimated_value, status, temperature, notes, 
                    engineering_data, files, payment_conditions, project_start_date, project_deadline, created_at
                 )
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                 ON CONFLICT (id) DO UPDATE SET
                 executive_id = EXCLUDED.executive_id,
                 company_name = EXCLUDED.company_name,
                 cnpj = EXCLUDED.cnpj,
                 contact_name = EXCLUDED.contact_name,
                 contact_email = EXCLUDED.contact_email,
                 project_type = EXCLUDED.project_type,
                 estimated_value = EXCLUDED.estimated_value,
                 status = EXCLUDED.status,
                 temperature = EXCLUDED.temperature,
                 notes = EXCLUDED.notes,
                 engineering_data = EXCLUDED.engineering_data,
                 files = EXCLUDED.files,
                 payment_conditions = EXCLUDED.payment_conditions,
                 project_start_date = EXCLUDED.project_start_date,
                 project_deadline = EXCLUDED.project_deadline
             `, [
                 op.id,
                 op.executiveId,
                 op.companyName,
                 op.cnpj,
                 op.contactName,
                 op.contactEmail,
                 op.projectType,
                 op.estimatedValue,
                 op.status,
                 op.temperature,
                 op.notes,
                 op.engineering ? JSON.stringify(op.engineering) : null,
                 op.files ? JSON.stringify(op.files) : '[]',
                 op.paymentConditions,
                 op.projectStartDate,
                 op.projectDeadline,
                 op.createdAt
             ]);
         }
         return res.status(200).json({ success: true });
     } catch (error) {
         console.error('Database Error:', error);
         return res.status(500).json({ error: 'Failed to save opportunities' });
     }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
