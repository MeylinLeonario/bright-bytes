"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Check, LockKeyhole, ShoppingBag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { getStudentShop, purchaseShopItem, StudentShop } from "@/lib/api";

export default function ShopPage() {
  const [shop, setShop] = useState<StudentShop | null>(null);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState<string | null>(null);
  const load = useCallback(() => getStudentShop().then(setShop).catch((e: Error) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);
  async function buy(id: string) { setBuying(id); setError(""); try { await purchaseShopItem(id); await load(); } catch (e) { setError(e instanceof Error ? e.message : "No se pudo completar la compra."); } finally { setBuying(null); } }
  return <main className="min-h-screen bg-muted/30"><div className="mx-auto max-w-6xl px-5 py-8"><header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[.18em] text-primary">Personaliza tu experiencia</p><h1 className="mt-2 text-3xl font-black">Tienda de Bytes</h1><p className="mt-2 text-sm text-muted-foreground">Tus compras y tu saldo quedan guardados en tu cuenta.</p></div><div className="flex gap-3"><span className="rounded-xl border bg-card px-4 py-2 font-black">{shop?.balance ?? "—"} Bytes</span><Link href="/student/dashboard" className={buttonVariants({variant:"outline"})}>Volver</Link></div></header>{error && <p className="mt-5 text-sm text-destructive">{error}</p>}<div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{shop?.items.map((item,index)=>{const affordable=shop.balance>=item.price;return <article key={item.id} className="flex flex-col rounded-2xl border bg-card p-5"><span className={`mb-4 grid size-12 place-items-center rounded-xl ${index%2 ? "bg-chart-2/10 text-chart-2":"bg-primary/10 text-primary"}`}><ShoppingBag/></span><h2 className="font-black">{item.name}</h2><p className="mt-1 flex-1 text-sm text-muted-foreground">{item.description}</p><Button className="mt-5 w-full" variant={item.owned?"secondary":affordable?"default":"outline"} disabled={item.owned||!affordable||buying!==null} onClick={()=>buy(item.id)}>{item.owned?<><Check/>Adquirido</>:affordable?(buying===item.id?"Comprando…":`${item.price} Bytes`):<><LockKeyhole/>Faltan {item.price-shop.balance} Bytes</>}</Button></article>})}</div>{!shop&&!error&&<p className="text-muted-foreground">Cargando tienda…</p>}</div></main>;
}
