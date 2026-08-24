import { Save } from "lucide-react";

type TextField = { label: string; value: string; multiline?: boolean };

/** Owner-facing copy editor with human labels, not implementation keys. */
export function AdminTextPage({ fields }: { fields: TextField[] }) {
  return <section className="admin-panel" id="copy"><div className="panel-heading"><div><span>02</span><div><p>نصوص الموقع</p><h3>كل نص في حقل واضح</h3></div></div><small>غيّر النص ثم احفظه من البطاقة نفسها.</small></div><div className="edit-card-grid">{fields.map(field => <article className="edit-card" key={field.label}><h4>{field.label}</h4><label>{field.multiline ? <textarea defaultValue={field.value} /> : <input defaultValue={field.value} />}</label><button type="button"><Save size={16} /> حفظ هذا النص</button></article>)}</div></section>;
}
