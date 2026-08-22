/**
 * Design note — «مطبخ على الورق»: warm ivory, dew-sage and clay accents;
 * flavor first, boxed portions second, and a deliberately compact order total.
 */
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Clock,
  Instagram,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Music2,
  Plus,
  Send,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = ""; // أضيفي الرقم بصيغة 201XXXXXXXXX قبل الإطلاق.
const TIKTOK_URL = ""; // أضيفي رابط TikTok الكامل هنا قبل الإطلاق.

const heroImage = "/manus-storage/delicious-grape-leaves-hero_9c69dcdc.jpg";
const brandMark = "/manus-storage/delicious-grape-leaves-mark_7ed4eb45.png";

type MenuItem = { id: string; title: string; description: string; price: number; category: string; tag?: string };

const grapePortions: MenuItem[] = [
  { id: "20", title: "20 حبة", description: "لشخصين أو مزاجك لوحدك", price: 150, category: "ورق عنب" },
  { id: "30", title: "30 حبة", description: "للقعدة الصغيرة", price: 195, category: "ورق عنب" },
  { id: "50", title: "50 حبة", description: "الأكثر طلبًا", price: 335, category: "ورق عنب", tag: "الأكثر طلبًا" },
  { id: "80", title: "80 حبة", description: "للمة الحلوة", price: 500, category: "ورق عنب" },
  { id: "100", title: "100 حبة", description: "للعزومات", price: 600, category: "ورق عنب" },
];

const fattaPortions: MenuItem[] = [
  { id: "fatta-small", title: "فتة صغيرة", description: "طبق فردي متكامل", price: 150, category: "فتة ورق عنب" },
  { id: "fatta-large", title: "فتة كبيرة", description: "للمشاركة واللمة", price: 300, category: "فتة ورق عنب", tag: "مناسبة للّمة" },
];

const orderTypes = ["عادي", "حار", "حامض"];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [quantities, setQuantities] = useState<Record<string, number>>({ "30": 1 });
  const [orderType, setOrderType] = useState("عادي");
  const [potatoesCount, setPotatoesCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItems = useMemo(
    () => [...grapePortions, ...fattaPortions]
      .filter((item) => (quantities[item.id] ?? 0) > 0)
      .map((item) => ({ ...item, quantity: quantities[item.id], subtotal: quantities[item.id] * item.price })),
    [quantities],
  );
  const productsTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const extrasTotal = potatoesCount * 15;
  const total = productsTotal + extrasTotal;

  const changeQuantity = (id: string, amount: number) => {
    setQuantities((current) => ({ ...current, [id]: Math.max(0, Math.min(99, (current[id] ?? 0) + amount)) }));
  };

  const orderMessage = `أهلًا، أريد طلب من ورق العنب اللذيذ:\n` +
    `• نوع الطلب: ${orderType}\n` +
    cartItems.map((item) => `• ${item.category} — ${item.title} × ${item.quantity} = ${item.subtotal} ج.م`).join("\n") +
    (potatoesCount ? `\n• بطاطس: ${potatoesCount} × 4 قطع = ${extrasTotal} ج.م` : "") +
    `\n• الإجمالي النهائي: ${total} ج.م\n\n` +
    `الاسم:\nالعنوان والمنطقة:\nالموعد المناسب:`;

  const sendOrder = () => {
    if (cartItems.length === 0) { toast.error("اختار حجم واحد على الأقل قبل إرسال الطلب."); return; }
    if (!WHATSAPP_NUMBER) { toast.info("سنضيف رقم واتساب الطلبات هنا قبل الإطلاق."); return; }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`, "_blank", "noopener,noreferrer");
  };

  const openTikTok = () => {
    if (!TIKTOK_URL) { toast.info("سنضيف رابط TikTok هنا قبل الإطلاق."); return; }
    window.open(TIKTOK_URL, "_blank", "noopener,noreferrer");
  };

  const renderPortionCard = (item: MenuItem) => {
    const quantity = quantities[item.id] ?? 0;
    return (
      <article className={`portion-card ${quantity > 0 ? "selected" : ""}`} key={item.id}>
        {item.tag && <b>{item.tag}</b>}
        <div className="portion-card-head"><strong>{item.title}</strong><em>{item.price} <small>ج.م</small></em></div>
        <span>{item.description}</span>
        <div className="card-quantity" aria-label={`عدد ${item.title}`}>
          <button aria-label={`إنقاص ${item.title}`} onClick={() => changeQuantity(item.id, -1)} disabled={quantity === 0}><Minus size={14} /></button>
          <output aria-label={`العدد المختار من ${item.title}`}>{quantity}</output>
          <button aria-label={`زيادة ${item.title}`} onClick={() => changeQuantity(item.id, 1)}><Plus size={14} /></button>
        </div>
        {quantity > 0 && <p>{quantity} × {item.price} = <strong>{quantity * item.price} ج.م</strong></p>}
      </article>
    );
  };

  return (
    <main className="site-shell paper-grain" dir="rtl">
      <header className="site-header" aria-label="التنقل الرئيسي">
        <a className="brand-lockup" href="#top" aria-label="ورق العنب اللذيذ - الرئيسية"><img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" /><span><strong>ورق العنب</strong><em>اللذيذ</em></span></a>
        <nav className="desktop-nav" aria-label="أقسام الموقع"><button onClick={() => scrollToSection("order")}>المنيو</button><button onClick={() => scrollToSection("delivery")}>التوصيل</button><button onClick={() => scrollToSection("contact")}>تواصل</button></nav>
        <button className="header-order" onClick={sendOrder}><MessageCircle size={17} /> اطلب الآن</button>
        <button className="mobile-menu-button" aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>{isMenuOpen ? <X size={23} /> : <Menu size={24} />}</button>
      </header>

      {isMenuOpen && <div className="mobile-menu" aria-label="قائمة الجوال">
        {[["المنيو", "order"], ["التوصيل", "delivery"], ["تواصل", "contact"]].map(([label, id]) => <button key={id} onClick={() => { setIsMenuOpen(false); scrollToSection(id); }}>{label}<ArrowLeft size={18} /></button>)}
        <button className="mobile-order" onClick={sendOrder}>إرسال طلب عبر واتساب</button>
      </div>}

      <section id="top" className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy"><div className="eyebrow"><Sparkles size={15} /> ورق عنب منزلي في القاهرة</div><h1 id="hero-title">لفّة متظبطة.<span>قعدة مبسوطة.</span></h1><p>اختار النوع أولًا، ثم الأحجام والعدد اللي يناسبك — والإجمالي يبان فورًا.</p><div className="hero-actions"><button className="primary-cta" onClick={() => scrollToSection("order")}>اطلب من المنيو <ArrowLeft size={18} /></button><span className="hero-note"><Leaf size={16} /> طازج عند الطلب</span></div></div>
        <div className="hero-visual" aria-label="صينية ورق عنب طازج"><div className="hero-image-wrap"><img src={heroImage} alt="صينية ورق عنب محضرة طازجة بالليمون" /></div><div className="hero-sticker"><span>01</span><small>اختيار اليوم</small></div><div className="hero-side-note">طعم بيتي<br />بشكل جديد</div></div>
      </section>

      <section id="order" className="order-section" aria-labelledby="order-title">
        <div className="order-intro"><div><div className="section-index">01 <span>/</span> المنيو</div><h2 id="order-title">اطلبها <em>على مزاجك.</em></h2></div><p>ابدأ بتحديد النوع، ثم اختار أي حجم وعدده. الإجمالي موجود في بطاقة صغيرة جنبك.</p></div>

        <div className="order-layout compact-menu-layout">
          <div className="steps-area compact-menu">
            <div className="choice-step flavor-first">
              <div className="step-heading"><span>1</span><div><small>أولًا</small><h3>حدد نوع الطلب</h3></div></div>
              <div className="flavor-row">{orderTypes.map((item) => <button key={item} className={orderType === item ? "active" : ""} onClick={() => setOrderType(item)}>{item}</button>)}</div>
            </div>

            <div className="choice-step last-step unified-menu-step">
              <div className="step-heading"><span>2</span><div><small>المنيو كامل</small><h3>اختار اللي تحتاجه والعدد</h3></div></div>
              <div className="portion-card-grid unified-card-grid">
                {grapePortions.map(renderPortionCard)}
                {fattaPortions.map(renderPortionCard)}
                <article className={`portion-card potato-card ${potatoesCount > 0 ? "selected" : ""}`}>
                  <div className="portion-card-head"><strong>4 قطع بطاطس</strong><em>15 <small>ج.م</small></em></div>
                  <span>إضافة على طلبك</span>
                  <div className="card-quantity" aria-label="عدد إضافات البطاطس">
                    <button aria-label="إنقاص البطاطس" onClick={() => setPotatoesCount((count) => Math.max(0, count - 1))} disabled={potatoesCount === 0}><Minus size={14} /></button>
                    <output aria-label="عدد إضافات البطاطس">{potatoesCount}</output>
                    <button aria-label="زيادة البطاطس" onClick={() => setPotatoesCount((count) => Math.min(99, count + 1))}><Plus size={14} /></button>
                  </div>
                  {potatoesCount > 0 && <p>{potatoesCount} × 15 = <strong>{extrasTotal} ج.م</strong></p>}
                </article>
              </div>
            </div>
          </div>

          <aside className="compact-summary" aria-label="الإجمالي">
            <div className="compact-summary-head"><span>إجمالي الطلب</span><ShoppingBag size={17} /></div>
            <div className="compact-order-type"><span>نوع الطلب</span><strong>{orderType}</strong></div>
            {cartItems.length ? <div className="compact-summary-items">{cartItems.map((item) => <div key={item.id}><span>{item.title} <small>× {item.quantity}</small></span><strong>{item.subtotal} ج.م</strong></div>)}{potatoesCount > 0 && <div><span>بطاطس <small>× {potatoesCount}</small></span><strong>{extrasTotal} ج.م</strong></div>}</div> : <p className="compact-empty">اختار حجمك من المربعات.</p>}
            <div className="compact-total"><span>الإجمالي</span><strong>{total} <small>ج.م</small></strong></div>
            <button className="compact-submit" onClick={sendOrder}><Send size={16} /> إرسال الطلب</button>
          </aside>
        </div>
      </section>

      <section id="delivery" className="delivery-strip" aria-labelledby="delivery-title"><div className="delivery-mark"><img src={brandMark} alt="" /></div><div><p>التوصيل</p><h2 id="delivery-title">من مطبخنا <em>لبيتك.</em></h2></div><div className="delivery-points"><span><MapPin size={18} /> القاهرة — المناطق تضاف قبل الإطلاق</span><span><Clock size={18} /> تجهيز مسبق حسب الطلب</span></div><button className="light-cta" onClick={sendOrder}>اطلب الآن <ArrowLeft size={17} /></button></section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title"><div><div className="section-index">02 <span>/</span> تواصل</div><h2 id="contact-title">تابعنا وخليك<br /><em>قريب من الجديد.</em></h2></div><div className="social-links"><a href="https://www.instagram.com/delicious_grape_leaves94/" target="_blank" rel="noreferrer"><Instagram size={22} /><span>Instagram</span><small>@delicious_grape_leaves94</small><ArrowLeft size={17} /></a><button onClick={openTikTok}><Music2 size={22} /><span>TikTok</span><small>أضف الرابط لاحقًا</small><ArrowLeft size={17} /></button><button onClick={sendOrder}><MessageCircle size={22} /><span>WhatsApp</span><small>لطلباتك واستفساراتك</small><ArrowLeft size={17} /></button></div></section>

      <footer className="site-footer"><a className="brand-lockup footer-brand" href="#top" aria-label="العودة إلى بداية الصفحة"><img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" /><span><strong>ورق العنب</strong><em>اللذيذ</em></span></a><p>من مطبخنا لبيتك في القاهرة.</p><button onClick={sendOrder}>واتساب الطلبات</button></footer>
    </main>
  );
}
