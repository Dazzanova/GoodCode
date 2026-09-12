import { getAllTopicsAdmin, getAllPatternsAdmin } from "@/lib/services/admin-taxonomy";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";

export default async function TaxonomyPage() {
  const [topics, patterns] = await Promise.all([getAllTopicsAdmin(), getAllPatternsAdmin()]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">Topics & Patterns</h1>

      <div className="mt-10">
        <h2 className="text-lg font-medium text-foreground">Topics</h2>
        <div className="mt-3 space-y-1">
          {topics.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="text-foreground">{t.name}</span>
              <span className="text-muted">{t._count.problems} problems</span>
            </div>
          ))}
        </div>
        <TaxonomyForm kind="topic" />
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <h2 className="text-lg font-medium text-foreground">Patterns</h2>
        <div className="mt-3 space-y-1">
          {patterns.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span className="text-foreground">{p.name}</span>
              <span className="text-muted">{p._count.problems} problems</span>
            </div>
          ))}
        </div>
        <TaxonomyForm kind="pattern" />
      </div>
    </div>
  );
}