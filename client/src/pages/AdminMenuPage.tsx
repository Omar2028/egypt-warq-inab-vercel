import { PackagePlus, Save } from "lucide-react";

type ProductCard = {
  id: number;
  nameAr: string;
  descriptionAr: string | null;
  price: number;
  category: string;
  isVisible: boolean;
};

/** Visual owner-facing menu editor; each product is intentionally handled as an independent card. */
export function AdminMenuPage({ products }: { products: ProductCard[] }) {
  return <section className="admin-panel" id="products"><div className="panel-heading"><div><span>01</span><div><p>المنيو والأسعار</p><h3>كل صنف في بطاقة مستقلة</h3></div></div><button type="button"><PackagePlus size={16} /> إضافة صنف</button></div><div className="edit-card-grid">{products.map(product => <article className="edit-card" key={product.id}><h4>{product.nameAr}</h4><label>اسم الصنف<input defaultValue={product.nameAr} /></label><label>الوصف<textarea defaultValue={product.descriptionAr || ""} /></label><label>السعر بالجنيه<input type="number" defaultValue={product.price} /></label><label>القسم<input defaultValue={product.category} /></label><button type="button"><Save size={16} /> حفظ هذا الصنف</button></article>)}</div></section>;
}
