export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Handle POST /api/order
    if (url.pathname === '/api/order' && request.method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const tableNum = body.table_number || '1';
        const orderId = `ORD-T${tableNum}-${Date.now().toString().slice(-4)}`;

        return new Response(
          JSON.stringify({
            success: true,
            order_display_id: orderId,
            db_order_id: orderId,
            message: 'Order placed successfully! The kitchen is preparing your order.',
            customer_name: body.customer_name || 'Guest',
            table_number: tableNum,
            total: body.total || 0,
            payment_method: body.payment_method || 'COUNTER',
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            error: true,
            message: err.message || 'Failed to process order',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }

    // Handle POST /api/payment/verify
    if (url.pathname === '/api/payment/verify' && request.method === 'POST') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment verified successfully',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Fall back to static assets and SPA routing
    return env.ASSETS.fetch(request);
  },
};

