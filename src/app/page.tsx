import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid">
      <section className="card" style={{ gridColumn: "span 12" }}>
        <div className="h1">ScalpMaster AI</div>
        <p>Professional 5?15m scalping bot for high-liquidity crypto pairs on Hyperliquid.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          <span className="badge">Testnet first</span>
          <span className="badge">Max 1% risk</span>
          <span className="badge">Max 3x leverage</span>
        </div>
      </section>

      <section className="card" style={{ gridColumn: "span 12" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>Automation</h2>
          <Link href="/api/cron" className="button">Run strategy now</Link>
        </div>
        <p className="mono" style={{ opacity: 0.8 }}>Cron: every 5 minutes via Vercel</p>
        <ul>
          <li>Signals and executions sent to Telegram</li>
          <li>Trades: BTC/USDT, ETH/USDT, SOL/USDT</li>
          <li>TP1 50%, TP2 30%, TP3 20%; hard SL always</li>
        </ul>
        <p style={{ opacity: 0.8 }}>
          Set env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, HYPERLIQUID_PRIVATE_KEY.
        </p>
      </section>
    </div>
  );
}
