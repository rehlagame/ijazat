import { kv } from '@vercel/kv';

// هذا هو "اسم الملف" الذي سنحفظ فيه بياناتنا داخل قاعدة بيانات KV
const LEAVES_KEY = 'my-company-leaves';

export default async function handler(request, response) {
  try {
    if (request.method === 'GET') {
      // إذا كان الطلب هو "جلب البيانات"
      const leaves = await kv.get(LEAVES_KEY);
      // إذا لم تكن هناك بيانات مخزنة من قبل، أرجع مصفوفة فارغة
      return response.status(200).json(leaves || []);
    }
    else if (request.method === 'POST') {
      // إذا كان الطلب هو "حفظ البيانات"
      const updatedLeaves = request.body;
      await kv.set(LEAVES_KEY, updatedLeaves);
      return response.status(200).json({ message: 'Leaves updated successfully' });
    }
    else {
      // إذا كان الطلب من نوع آخر غير مسموح به
      return response.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}