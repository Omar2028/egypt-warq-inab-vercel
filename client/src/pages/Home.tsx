/**
 * Design note — «مطبخ على الورق»: warm ivory, dew-sage and clay accents;
 * a single calm ordering path: type → size → quantity → extras → total.
 */
import { useState } from "react";
import {
  ArrowLeft,
  Check,
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

type MenuItem = { id: string; title: string; description: string; price: number; tag?: string };

const orderTypes = ["عادي", "حار", "حامض"];
const grapePortions: MenuItem[] = [
  { id: "20", title: "20 حبة", description: "لشخصين أو مزاجك لوحدك", price: 150 },
  { id: "30", title: "30 حبة", description: "للقعدة الصغيرة", price: 195 },
  { id: "50", title: "50 حبة", description: "الأكثر طلبًا", price: 335, tag: "الأكثر طلبًا" },
  { id: "80", title: "80 حبة", description: "للمة الحلوة", price: 500 },
  { id: "100", title: "100 حبة", description: "للعزومات", price: 600 },
];
const extras: MenuItem[] = [
  { id: "fatta-small", title: "فتة صغيرة", description: "طبق فردي", price: 150 },
  { id: "fatta-large", title: "فتة كبيرة", description: "للمشاركة", price: 300 },
  { id: "potatoes", title: "4 قطع بطاطس", description: "إضافة جانبية", price: 15 },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [orderType, setOrderType] = useState("عادي");
  const [selectedSizeId, setSelectedSizeId] = useState("30");
  const [quantity, setQuantity] = useState(1);
  const [extraQuantities, setExtraQuantities] = useState<Record<string, number>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const selectedSize = grapePortions.find((item) => item.id === selectedSizeId) ?? grapePortions[1];
  const selectedExtras = extras
    .filter((item) => (extraQuantities[item.id] ?? 0) > 0)
    .map((item) => ({ ...item, quantity: extraQuantities[item.id], subtotal: item.price * extraQuantities[item.id] }));
  const baseTotal = selectedSize.price * quantity;
  const extrasTotal = selectedExtras.reduce((sum, item) => sum + item.subtotal, 0);
  const total = baseTotal + extrasTotal;

  const changeExtra = (id: string, amount: number) => setExtraQuantities((current) => ({
    ...current,
    [id]: Math.max(0, Math.min(99, (current[id] ?? 0) + amount)),
  }));

  const chooseSize = (id: string) => {
    setSelectedSizeId(id);
    setQuantity(1);
  };

  const orderMessage = `أهلًا، أريد طلب من ورق العنب اللذيذ:\n` +
    `• نوع الطلب: ${orderType}\n` +
    `• ورق عنب: ${selectedSize.title} × ${quantity} = ${baseTotal} ج.م\n` +
    selectedExtras.map((item) => `• ${item.title} × ${item.quantity} = ${item.subtotal} ج.م`).join("\n") +
    `\n• الإجمالي النهائي: ${total} ج.م\n\n` +
    `الاسم:\nالعنوان والمنطقة:\nالموعد المناسب:`;

  const sendOrder = () => {
    if (!WHATSAPP_NUMBER) { toast.info("سنضيف رقم واتساب الطلبات هنا قبل الإطلاق."); return; }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`, "_blank", "noopener,noreferrer");
  };

  const openTikTok = () => {
    if (!TIKTOK_URL) { toast.info("سنضيف رابط TikTok هنا قبل الإطلاق."); return; }
    window.open(TIKTOK_URL, "_blank", "noopener,noreferrer");
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
        <div className="hero-copy"><div className="eyebrow"><Sparkles size={15} /> ورق عنب منزلي في القاهرة</div><h1 id="hero-title">لفّة متظبطة.<span>قعدة مبسوطة.</span></h1><p>أربع خطوات واضحة تخلي طلبك جاهز في أقل من دقيقة.</p><div className="hero-actions"><button className="primary-cta" onClick={() => scrollToSection("order")}>اطلب من المنيو <ArrowLeft size={18} /></button><span className="hero-note"><Leaf size={16} /> طازج عند الطلب</span></div></div>
        <div className="hero-visual" aria-label="صينية ورق عنب طازج"><div className="hero-image-wrap"><img src={heroImage} alt="صينية ورق عنب محضرة طازجة بالليمون" /></div><div className="hero-sticker"><span>01</span><small>اختيار اليوم</small></div><div className="hero-side-note">طعم بيتي<br />بشكل جديد</div></div>
      </section>

      <section id="order" className="order-section easy-order-section" aria-labelledby="order-title">
        <div className="order-intro"><div><div className="section-index">01 <span>/</span> اطلب بسهولة</div><h2 id="order-title">طلبك في <em>4 خطوات.</em></h2></div><p>امشِ مع الخطوات بالترتيب، وبعدها أرسل الطلب من الملخص.</p></div>
        <div className="easy-order-shell">
          <div className="easy-order-flow">
            <section className="easy-order-step">
              <div className="order-step-title"><span>1</span><div><small>الخطوة الأولى</small><h3>حدد نوع الطلب</h3></div></div>
              <div className="type-options" role="radiogroup" aria-label="نوع الطلب">{orderTypes.map((item) => <button key={item} role="radio" aria-checked={orderType === item} className={orderType === item ? "selected" : ""} onClick={() => setOrderType(item)}>{orderType === item && <Check size={15} />}{item}</button>)}</div>
            </section>

            <section className="easy-order-step">
              <div className="order-step-title"><span>2</span><div><small>الخطوة الثانية</small><h3>اختر حجم الطلب</h3></div></div>
              <div className="easy-size-grid" role="radiogroup" aria-label="حجم طلب ورق العنب">
                {grapePortions.map((item) => <button key={item.id} role="radio" aria-checked={selectedSizeId === item.id} className={selectedSizeId === item.id ? "selected" : ""} onClick={() => chooseSize(item.id)}>{item.tag && <b>{item.tag}</b>}<strong>{item.title}</strong><span>{item.description}</span><em>{item.price} <small>ج.م</small></em>{selectedSizeId === item.id && <i><Check size={14} /></i>}</button>)}
              </div>
            </section>

            <section className="easy-order-step quantity-step">
              <div className="order-step-title"><span>3</span><div><small>الخطوة الثالثة</small><h3>حدد العدد</h3></div></div>
              <div className="selected-size-summary"><div><small>اختيارك</small><strong>{selectedSize.title} <span>— {orderType}</span></strong><em>{selectedSize.price} ج.م للطلب الواحد</em></div><div className="big-quantity-control"><button aria-label="إنقاص العدد" onClick={() => setQuantity((count) => Math.max(1, count - 1))}><Minus size={18} /></button><output aria-label="عدد الطلبات">{quantity}</output><button aria-label="زيادة العدد" onClick={() => setQuantity((count) => Math.min(99, count + 1))}><Plus size={18} /></button></div></div>
            </section>

            <section className="easy-order-step last-step">
              <div className="order-step-title"><span>4</span><div><small>اختياري</small><h3>أضف مع طلبك</h3></div></div>
              <div className="extras-grid">{extras.map((item) => { const extraQuantity = extraQuantities[item.id] ?? 0; return <article className={`extra-card ${extraQuantity > 0 ? "selected" : ""}`} key={item.id}><div><strong>{item.title}</strong><span>{item.description}</span><em>{item.price} ج.م</em></div><div className="mini-quantity-control"><button aria-label={`إنقاص ${item.title}`} onClick={() => changeExtra(item.id, -1)} disabled={extraQuantity === 0}><Minus size={14} /></button><output aria-label={`عدد ${item.title}`}>{extraQuantity}</output><button aria-label={`زيادة ${item.title}`} onClick={() => changeExtra(item.id, 1)}><Plus size={14} /></button></div></article>})}</div>
            </section>
          </div>

          <aside className="compact-easy-summary" aria-label="ملخص وإجمالي الطلب">
            <div className="compact-summary-head"><span>ملخص طلبك</span><ShoppingBag size={17} /></div>
            <div className="summary-type-row"><span>نوع الطلب</span><strong>{orderType}</strong></div>
            <div className="summary-base-row"><div><small>ورق عنب</small><strong>{selectedSize.title} <span>× {quantity}</span></strong></div><em>{baseTotal} ج.م</em></div>
            {selectedExtras.length > 0 && <div className="summary-extras-row">{selectedExtras.map((item) => <div key={item.id}><span>{item.title} × {item.quantity}</span><strong>{item.subtotal} ج.م</strong></div>)}</div>}
            <div className="compact-total"><span>الإجمالي النهائي</span><strong>{total} <small>ج.م</small></strong></div>
            <button className="compact-submit" onClick={sendOrder}><Send size={16} /> إرسال الطلب</button>
            <p>سيظهر النوع والكميات في رسالة واتساب.</p>
          </aside>
        </div>
      </section>

      <section id="delivery" className="delivery-strip" aria-labelledby="delivery-title"><div className="delivery-mark"><img src={brandMark} alt="" /></div><div><p>التوصيل</p><h2 id="delivery-title">من مطبخنا <em>لبيتك.</em></h2></div><div className="delivery-points"><span><MapPin size={18} /> القاهرة — المناطق تضاف قبل الإطلاق</span><span><Clock size={18} /> تجهيز مسبق حسب الطلب</span></div><button className="light-cta" onClick={sendOrder}>اطلب الآن <ArrowLeft size={17} /></button></section>
      <section id="contact" className="contact-section" aria-labelledby="contact-title"><div><div className="section-index">02 <span>/</span> تواصل</div><h2 id="contact-title">تابعنا وخليك<br /><em>قريب من الجديد.</em></h2></div><div className="social-links"><a href="https://www.instagram.com/delicious_grape_leaves94/" target="_blank" rel="noreferrer"><Instagram size={22} /><span>Instagram</span><small>@delicious_grape_leaves94</small><ArrowLeft size={17} /></a><button onClick={openTikTok}><Music2 size={22} /><span>TikTok</span><small>أضف الرابط لاحقًا</small><ArrowLeft size={17} /></button><button onClick={sendOrder}><MessageCircle size={22} /><span>WhatsApp</span><small>لطلباتك واستفساراتك</small><ArrowLeft size={17} /></button></div></section>
      <footer className="site-footer"><a className="brand-lockup footer-brand" href="#top" aria-label="العودة إلى بداية الصفحة"><img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" /><span><strong>ورق العنب</strong><em>اللذيذ</em></span></a><p>من مطبخنا لبيتك في القاهرة.</p><button onClick={sendOrder}>واتساب الطلبات</button></footer>
    </main>
  );
}
