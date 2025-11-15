import { NextResponse } from "next/server";
import { fetchCandles as hlCandles, fetchBalanceUSDT, submitBracketOrder } from "@/lib/hyperliquid";
import { generateSignal } from "@/lib/strategy";
import { planPosition } from "@/lib/risk";
import { sendTelegram } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function GET() {
  const pairs = [
    { symbol: "BTCUSDT" as const, display: "BTC/USDT" as const },
    { symbol: "ETHUSDT" as const, display: "ETH/USDT" as const },
    { symbol: "SOLUSDT" as const, display: "SOL/USDT" as const },
  ];

  const timeframe: "5m" | "15m" = "5m";
  const results: any[] = [];

  try {
    const balance = await fetchBalanceUSDT();

    for (const p of pairs) {
      const candles = await hlCandles(p.symbol, timeframe, 160);
      if (candles.length < 50) continue;
      const signal = generateSignal(p.display, timeframe, candles);
      const lastPrice = candles.at(-1)!.close;

      await sendTelegram({
        type: "SIGNAL",
        content: `Pair: ${p.display}\nTF: ${timeframe}\nSide: ${signal.side}\nPrice: ${lastPrice.toFixed(2)}\nConf: ${(signal.confidence * 100).toFixed(0)}%\nReason: ${signal.reason}`,
      });

      const plan = planPosition(signal, lastPrice, { balanceUSDT: balance }, { maxRiskFractionPerTrade: 0.01, maxLeverage: 3 });
      if (!plan) {
        results.push({ pair: p.display, action: "NO_TRADE" });
        continue;
      }

      const orderRes = await submitBracketOrder({
        market: p.symbol,
        side: signal.side === "LONG" ? "BUY" : "SELL",
        sizeUSDT: plan.sizeUSDT,
        leverage: plan.leverage,
        stopLoss: signal.stopLoss!,
        takeProfits: [signal.takeProfits[0], signal.takeProfits[1], signal.takeProfits[2]] as [number, number, number],
      });

      await sendTelegram({
        type: "ORDER",
        content: `Pair: ${p.display}\nTF: ${timeframe}\nAction: ${signal.side === "LONG" ? "OPEN LONG" : "OPEN SHORT"}\nNotional: ${plan.sizeUSDT.toFixed(2)} USDT @ ${lastPrice.toFixed(2)}\nLev: ${plan.leverage}x\nTPs: ${signal.takeProfits.map(v => v.toFixed(2)).join(" | ")}\nSL: ${signal.stopLoss!.toFixed(2)}\nStatus: ${orderRes.status} (${orderRes.id})`,
      });

      results.push({ pair: p.display, action: "TRADE", orderId: orderRes.id });
    }

    return NextResponse.json({ ok: true, results });
  } catch (err: any) {
    await sendTelegram({ type: "ERROR", content: `Cron error: ${err?.message || String(err)}` });
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
