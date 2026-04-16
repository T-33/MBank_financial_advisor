"use client";
import { ShoppingBag, Star, Truck, ExternalLink } from "lucide-react";
import { formatSomCompact } from "@/lib/format";

type Product = {
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  freeDelivery: boolean;
};

type Props = {
  paidPrice: number;
  product: Product;
  savings: number;
  savingsPercent: number;
};

export default function MMarketCrossSellCard({ paidPrice, product, savings, savingsPercent }: Props) {
  const hasSavings = savings > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#ECECEC] p-4 max-w-[280px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5 text-emerald-600" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-slate-900 leading-tight">Нашёл в MMarket</p>
          <p className="text-[11px] text-slate-400 truncate">{product.category}</p>
        </div>
      </div>

      {/* Product */}
      <div className="flex gap-3 mb-3">
        <div className="w-[72px] h-[72px] rounded-xl bg-[#F5F5F5] overflow-hidden flex-shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-slate-900 leading-tight line-clamp-2 mb-1.5">
            {product.name}
          </p>
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-[11px] text-slate-600 font-medium">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>
          {product.freeDelivery && (
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-emerald-600" />
              <span className="text-[11px] text-emerald-600 font-medium">Бесплатная доставка</span>
            </div>
          )}
        </div>
      </div>

      {/* Price comparison */}
      <div className="bg-[#F8FAF8] rounded-xl p-3 mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[11px] text-slate-400">MMarket</span>
          <span className="text-[11px] text-slate-400">Вы заплатили</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[20px] font-bold text-emerald-600">{formatSomCompact(product.price)}</span>
          <span className="text-[16px] text-slate-400 line-through">{formatSomCompact(paidPrice)}</span>
        </div>
        {hasSavings && (
          <div className="mt-2 inline-flex items-center gap-1 bg-emerald-600/10 rounded-lg px-2 py-0.5">
            <span className="text-[12px] font-semibold text-emerald-600">
              Экономия: {formatSomCompact(savings)} ({savingsPercent}%)
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        className="w-full py-2.5 rounded-xl text-[14px] font-semibold text-white flex items-center justify-center gap-1.5"
        style={{
          background: "linear-gradient(135deg, #00B85A 0%, #008D3F 100%)",
          boxShadow: "0 4px 16px rgba(0,156,77,0.28)",
        }}
      >
        <span>Открыть в MMarket</span>
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
}
