'use client'
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CategorySelectorProps {
  categories: Array<{
    _id: string;
    title?: string;
    slug?: { current?: string };
    description?: string;
    productCount?: number;
  }>;
}

export function CategorySelectorComponent({ categories }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  // const [expanded, setExpanded] = useState<string | null>(null); // Removed to fix unused-vars
  const router = useRouter();
  const params = useSearchParams();

  const queryValue = params?.get("query") ?? "";

  const filtered = categories.filter((c) =>
    (c.title ?? "").toLowerCase().includes(filter.toLowerCase())
  );

  function applyCategory(slug?: string) {
    const qp = new URLSearchParams();
    if (queryValue) qp.set("query", queryValue);
    if (slug) qp.set("category", slug);
    const q = qp.toString();
    router.push(`/search${q ? `?${q}` : ""}`);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:border-purple-400 hover:shadow-md transition-all flex items-center space-x-3 group"
      >
        <span className="text-sm font-bold text-gray-700 group-hover:text-purple-600">Categories</span>
        <span className="text-xs text-gray-400 group-hover:text-purple-600">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute left-1/2 sm:left-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 z-40 mt-4 w-[calc(100vw-40px)] sm:w-72 bg-white border border-gray-100 shadow-2xl rounded-3xl p-6 overflow-hidden">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search Categories..."
            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/30 mb-6"
          />

          <ul className="max-h-80 overflow-y-auto space-y-2 custom-scrollbar pr-2">
            <li>
              <button
                onClick={() => applyCategory(undefined)}
                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
              >
                All Items
              </button>
            </li>

            {filtered.map((cat) => (
              <li key={cat._id} className="group">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors">
                  <div className="flex-1">
                    <button
                      onClick={() => applyCategory(cat.slug?.current)}
                      className="text-left font-bold text-sm text-gray-800 group-hover:text-purple-600 transition-colors"
                    >
                      {cat.title}
                    </button>
                    {cat.description && (
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-purple-200 group-hover:text-purple-700 transition-colors">{cat.productCount ?? 0}</span>
                  </div>
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="text-xs font-bold text-gray-300 px-4 py-8 text-center">Nothing Found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}