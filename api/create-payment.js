
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://usahemp.store/");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-API-KEY"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { amount, orderId, email, name } = req.body;

    const apiKey = process.env.MAXELPAY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing API Key" });
    }

    const response = await fetch(
      "https://api.maxelpay.com/api/v1/payments/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey
        },
        body: JSON.stringify({
          orderId: orderId,
          amount: amount,
          currency: "USD",
          description: "usahemp Order",
          customerEmail: email,
          customerName: name,
          successUrl: "https://usahemp.store/payment-success",
          cancelUrl: "https://usahemp.store/payment-failed",
          callbackUrl: "https://usahemp.store/api/webhook"
        })
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
