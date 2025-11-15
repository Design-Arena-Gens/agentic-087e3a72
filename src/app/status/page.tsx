export default async function StatusPage() {
  const envs = [
    { key: "TELEGRAM_BOT_TOKEN", present: Boolean(process.env.TELEGRAM_BOT_TOKEN) },
    { key: "TELEGRAM_CHAT_ID", present: Boolean(process.env.TELEGRAM_CHAT_ID) },
    { key: "HYPERLIQUID_PRIVATE_KEY", present: Boolean(process.env.HYPERLIQUID_PRIVATE_KEY) },
  ];
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Runtime status</h2>
      <ul className="mono">
        {envs.map((e) => (
          <li key={e.key}>{e.key}: {e.present ? "? set" : "? missing"}</li>
        ))}
      </ul>
      <p>Configure project environment variables in Vercel for production.</p>
    </div>
  );
}
