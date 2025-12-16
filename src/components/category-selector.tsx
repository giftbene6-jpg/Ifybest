'use client'
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CategorySelectorProps {
  categories: Array<{
    _id: string;
    title?: string;
    slug?: string;
    description?: string;
    productCount?: number;
  }>;
}

export function CategorySelectorComponent({ categories }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
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
    <div className="relative ">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="px-3 py-2 border rounded bg-white shadow-sm hover:shadow-md flex items-center space-x-2"
      >
        <span>Categories</span>
        <span className="text-xs text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-80 bg-white border rounded shadow-lg p-3">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search categories"
            className="w-full px-2 py-2 border rounded mb-3"
          />

          <ul className="max-h-64 overflow-y-auto space-y-1">
            <li>
              <button
                onClick={() => applyCategory(undefined)}
                className="w-full text-left px-2 py-2 rounded hover:bg-gray-100"
              >
                All categories
              </button>
            </li>

            {filtered.map((cat) => (
              <li key={cat._id} className="border-b last:border-b-0">
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="flex-1">
                    <button
                      onClick={() => applyCategory(cat.slug)}
                      className="text-left font-medium"
                    >
                      {cat.title}
                    </button>
                    {cat.description && (
                      <p className="text-xs text-gray-500">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <span className="text-sm text-gray-600">{cat.productCount ?? 0}</span>
                    <button
                      onClick={() => setExpanded((e) => (e === cat._id ? null : cat._id))}
                      className="text-xs text-gray-500 px-2"
                    >
                      {expanded === cat._id ? "▾" : "▸"}
                    </button>
                  </div>
                </div>
                {expanded === cat._id && (
                  <div className="px-3 pb-2 text-sm text-gray-700">Click a category to apply filter.</div>
                )}
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="text-sm text-gray-500 px-2 py-2">No categories</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}