/**
 * Design note — «مطبخ على الورق»: a warm editorial page with one direct menu,
 * where the customer selects the grape-leaf type once and quantities beside every item.
 */
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Clock, Instagram, Leaf, MapPin, Menu, MessageCircle, Minus, Music2, Plus, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = ""; // أضيفي الرقم بصيغة 201XXXXXXXXX قبل الإطلاق.
const TIKTOK_URL = ""; // أضيفي رابط TikTok الكامل هنا قبل الإطلاق.
const heroImage = "/manus-storage/delicious-grape-leaves-hero_9c69dcdc.jpg";
const brandMark = "/manus-storage/delicious-grape-leaves-mark_7ed4eb45.png";

type MenuItem = { id: string; title: string; description: string; price: number; category: "ورق عنب" | "فتة" | "إضافة"; tag?: string };
const orderTypes = ["عادي", "حار", "حامض"];
const menuItems: MenuItem[] = [
  { id: "20", title: "20 حبة", description: "لشخصين أو مزاجك لوحدك", price: 150, category: "ورق عنب" },
  { id: "30", title: "30 حبة", description: "للقعدة الصغيرة", price: 195, category: "ورق عنب" },
  { id: "50", title: "50 حبة", description: "الأكثر طلبًا", price: 335, category: "ورق عنب", tag: "الأكثر طلبًا" },
  { id: "80", title: "80 حبة", description: "للمة الحلوة", price: 500, category: "ورق عنب" },
  { id: "100", title: "100 حبة", description: "للعزومات", price: 600, category: "ورق عنب" },
  { id: "fatta-small", title: "فتة صغيرة", description: "طبق فردي متكامل", price: 150, category: "فتة" },
  { id: "fatta-large", title: "فتة كبيرة", description: "للمشاركة واللمة", price: 300, category: "فتة" },
  { id: "potatoes", title: "4 قطع بطاطس", description: "إضافة على طلبك", price: 15, category: "إضافة" },
];

function scrollToSection(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }

export default function Home() {
  const [orderType, setOrderType] = useState("عادي");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useMemo(() => menuItems.filter((item) => (quantities[item.id] ?? 0) > 0).map((item) => ({ ...item, quantity: quantities[item.id], subtotal: item.price * quantities[item.id] })), [quantities]);
  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const changeQuantity = (id: string, amount: number) => setQuantities((current) => ({ ...current, [id]: Math.max(0, Math.min(99, (current[id] ?? 0) + amount)) }));
  const orderMessage = `أهلًا، أريد طلب من ورق العنب اللذيذ:\n• نوع ورق العنب: ${orderType}\n` + cartItems.map((item) => `• ${item.category} — ${item.title} × ${item.quantity} = ${item.subtotal} ج.م`).join("\n") + `\n• الإجمالي النهائي: ${total} ج.م\n\nالاسم:\nالعنوان والمنطقة:\nالموعد المناسب:`;
  const sendOrder = () => { if (!cartItems.length) { toast.error("زِد العدد بجانب صنف واحد على الأقل قبل إرسال الطلب."); return; } if (!WHATSAPP_NUMBER) { toast.info("سنضيف رقم واتساب الطلبات هنا قبل الإطلاق."); return; } window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`, "_blank", "noopener,noreferrer"); };
  const openTikTok = () => { if (!TIKTOK_URL) { toast.info("سنضيف رابط TikTok هنا قبل الإطلاق."); return; } window.open(TIKTOK_URL, "_blank", "noopener,noreferrer"); };

  return <main className="site-shell paper-grain" dir="rtl">
    <header className="site-header" aria-label="التنقل الرئيسي"><a className="brand-lockup" href="#top" aria-label="ورق العنب اللذيذ - الرئيسية"><img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" /><span><strong>ورق العنب</strong><em>اللذيذ</em></span></a><nav className="desktop-nav" aria-label="أقسام الموقع"><button onClick={() => scrollToSection("order")}>المنيو</button><button onClick={() => scrollToSection("delivery")}>التوصيل</button><button onClick={() => scrollToSection("contact")}>تواصل</button></nav><button className="header-order" onClick={sendOrder}><MessageCircle size={17} /> اطلب الآن</button><button className="mobile-menu-button" aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>{isMenuOpen ? <X size={23} /> : <Menu size={24} />}</button></header>
    {isMenuOpen && <div className="mobile-menu" aria-label="قائمة الجوال">{[["المنيو", "order"], ["التوصيل", "delivery"], ["تواصل", "contact"]].map(([label, id]) => <button key={id} onClick={() => { setIsMenuOpen(false); scrollToSection(id); }}>{label}<ArrowLeft size={18} /></button>)}<button className="mobile-order" onClick={sendOrder}>إرسال طلب عبر واتساب</button></div>}

    <section id="top" className="hero-section" aria-labelledby="hero-title"><div className="hero-copy"><div className="eyebrow"><Sparkles size={15} /> ورق عنب منزلي في القاهرة</div><h1 id="hero-title">لفّة متظبطة.<span>قعدة مبسوطة.</span></h1><p>اختار نوع ورق العنب، ثم زِد العدد جنب كل صنف — والإجمالي يبان فورًا.</p><div className="hero-actions"><button className="primary-cta" onClick={() => scrollToSection("order")}>اطلب من المنيو <ArrowLeft size={18} /></button><span className="hero-note"><Leaf size={16} /> طازج عند الطلب</span></div></div><div className="hero-visual" aria-label="صينية ورق عنب طازج"><div className="hero-image-wrap"><img src={heroImage} alt="صينية ورق عنب محضرة طازجة بالليمون" /></div><div className="hero-sticker"><span>01</span><small>اختيار اليوم</small></div><div className="hero-side-note">طعم بيتي<br />بشكل جديد</div></div></section>

    <section id="order" className="order-section root-direct-section" aria-labelledby="order-title"><div className="order-intro"><div><div className="section-index">01 <span>/</span> المنيو</div><h2 id="order-title">اطلبها <em>بسهولة.</em></h2></div><p>نوع واحد في البداية، وبعدها كل الأصناف والعدد في قائمة واحدة.</p></div><div className="root-direct-shell"><div className="root-menu-flow"><section className="root-type-step"><div className="root-step-heading"><span>1</span><div><small>أولًا</small><h3>حدد نوع ورق العنب</h3></div></div><div className="root-type-options" role="radiogroup" aria-label="نوع ورق العنب">{orderTypes.map((item) => <button key={item} role="radio" aria-checked={orderType === item} className={orderType === item ? "selected" : ""} onClick={() => setOrderType(item)}>{orderType === item && <Check size={14} />}{item}</button>)}</div></section><section className="root-items-step"><div className="root-step-heading"><span>2</span><div><small>اختار والعدد جنبك</small><h3>كل الأصناف في منيو واحد</h3></div></div><div className="root-menu-list">{menuItems.map((item) => { const qty = quantities[item.id] ?? 0; return <article key={item.id} className={`root-menu-row ${qty > 0 ? "selected" : ""}`}><div className="root-row-copy"><div><small>{item.category}</small>{item.tag && <b>{item.tag}</b>}</div><strong>{item.title}</strong><span>{item.description}{item.category === "ورق عنب" && <em> · {orderType}</em>}</span></div><div className="root-row-price"><strong>{item.price}</strong><small>ج.م</small></div><div className="root-row-quantity"><button aria-label={`إنقاص ${item.title}`} onClick={() => changeQuantity(item.id, -1)} disabled={qty === 0}><Minus size={15} /></button><output aria-label={`عدد ${item.title}`}>{qty}</output><button aria-label={`زيادة ${item.title}`} onClick={() => changeQuantity(item.id, 1)}><Plus size={15} /></button></div></article>})}</div><p className="root-menu-note"><Clock size={15} /> زِد العدد بجانب أي صنف، ثم راجع الإجمالي على اليسار.</p></section></div><aside className="root-order-summary" aria-label="ملخص وإجمالي الطلب"><div className="compact-summary-head"><span>ملخص طلبك</span><ShoppingBag size={17} /></div><div className="summary-type-row"><span>نوع ورق العنب</span><strong>{orderType}</strong></div>{cartItems.length ? <div className="root-summary-items">{cartItems.map((item) => <div key={item.id}><span>{item.title} <small>× {item.quantity}</small></span><strong>{item.subtotal} ج.م</strong></div>)}</div> : <p className="root-summary-empty">زِد العدد بجانب الصنف المطلوب.</p>}<div className="compact-total"><span>الإجمالي النهائي</span><strong>{total} <small>ج.م</small></strong></div><button className="compact-submit" onClick={sendOrder}><Send size={16} /> إرسال الطلب</button><p>سيظهر النوع والكميات في رسالة واتساب.</p></aside></div></section>

    <section id="delivery" className="delivery-strip" aria-labelledby="delivery-title"><div className="delivery-mark"><img src={brandMark} alt="" /></div><div><p>التوصيل</p><h2 id="delivery-title">من مطبخنا <em>لبيتك.</em></h2></div><div className="delivery-points"><span><MapPin size={18} /> القاهرة — المناطق تضاف قبل الإطلاق</span><span><Clock size={18} /> تجهيز مسبق حسب الطلب</span></div><button className="light-cta" onClick={sendOrder}>اطلب الآن <ArrowLeft size={17} /></button></section>
    <section id="contact" className="contact-section" aria-labelledby="contact-title"><div><div className="section-index">02 <span>/</span> تواصل</div><h2 id="contact-title">تابعنا وخليك<br /><em>قريب من الجديد.</em></h2></div><div className="social-links"><a href="https://www.instagram.com/delicious_grape_leaves94/" target="_blank" rel="noreferrer"><Instagram size={22} /><span>Instagram</span><small>@delicious_grape_leaves94</small><ArrowLeft size={17} /></a><button onClick={openTikTok}><Music2 size={22} /><span>TikTok</span><small>أضف الرابط لاحقًا</small><ArrowLeft size={17} /></button><button onClick={sendOrder}><MessageCircle size={22} /><span>WhatsApp</span><small>لطلباتك واستفساراتك</small><ArrowLeft size={17} /></button></div></section>
    <footer className="site-footer"><a className="brand-lockup footer-brand" href="#top" aria-label="العودة إلى بداية الصفحة"><img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" /><span><strong>ورق العنب</strong><em>اللذيذ</em></span></a><p>من مطبخنا لبيتك في القاهرة.</p><button onClick={sendOrder}>واتساب الطلبات</button></footer>
  </main>;
}
