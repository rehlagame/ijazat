// File: api/leaves.js

import { kv } from '@vercel/kv';

// هذا السطر يخبر Vercel بتشغيل هذه الدالة تحديداً على بيئة الـ Edge
export const config = {
  runtime: 'edge',
};

// هذا هو "اسم المفتاح" الذي سنحفظ فيه بياناتنا داخل قاعدة بيانات KV
const LEAVES_KEY = 'my-company-leaves';

export default async function handler(request) {
  try {
    // الطريقة الصحيحة للتعامل مع الطلبات في بيئة الـ Edge
    if (request.method === 'GET') {
      const leaves = await kv.get(LEAVES_KEY);
      // إرجاع رد بصيغة JSON بالطريقة الصحيحة في الـ Edge
      return new Response(JSON.stringify(leaves || []), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    else if (request.method === 'POST') {
      // قراءة البيانات من الطلب بالطريقة الصحيحة في الـ Edge
      const updatedLeaves = await request.json();
      await kv.set(LEAVES_KEY, updatedLeaves);
      return new Response(JSON.stringify({ message: 'Leaves updated successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    else {
      return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}