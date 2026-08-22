/**
 * Design note — «مطبخ على الورق»: warm ivory, dew-sage and clay accents;
 * one short, calm ordering path where choice and price remain visible together.
 */
import { useMemo, useState } from "react";
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
const detailImage = "/manus-storage/delicious-grape-leaves-detail_a83761d1.jpg";
const brandMark = "/manus-storage/delicious-grape-leaves-mark_7ed4eb45.png";

type Product = "grape" | "fatta";
type MenuItem = { id: string; title: string; description: string; price: number; tag?: string };

const grapePortions: MenuItem[] = [
  { id: "20", title: "20 حبة", description: "لشخصين أو مزاجك لوحدك", price: 150 },
  { id: "30", title: "30 حبة", description: "للقعدة الصغيرة", price: 195 },
  { id: "50", title: "50 حبة", description: "الأكثر طلبًا", price: 335, tag: "الأكثر طلبًا" },
  { id: "80", title: "80 حبة", description: "للمة الحلوة", price: 500 },
  { id: "100", title: "100 حبة", description: "للعزومات", price: 600 },
];

const fattaPortions: MenuItem[] = [
  { id: "fatta-small", title: "فتة صغيرة", description: "طبق فردي متكامل", price: 150 },
  { id: "fatta-large", title: "فتة كبيرة", description: "للمشاركة واللمة", price: 300, tag: "مناسبة للّمة" },
];

const flavors = ["عادي", "حامض", "سبايسي", "ليمون زيادة"];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [product, setProduct] = useState<Product>("grape");
  const [selectedId, setSelectedId] = useState("30");
  const [flavor, setFlavor] = useState("عادي");
  const [potatoes, setPotatoes] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const options = product === "grape" ? grapePortions : fattaPortions;
  const selectedItem = useMemo(
    () => options.find((item) => item.id === selectedId) ?? options[0],
    [options, selectedId],
  );
  const total = selectedItem.price + (potatoes ? 15 : 0);
  const productName = product === "grape" ? "ورق عنب" : "فتة ورق عنب";

  const orderMessage = `أهلًا، أريد طلب من ورق العنب اللذيذ:\n` +
    `• الصنف: ${productName}\n` +
    `• الحجم: ${selectedItem.title}\n` +
    `• الطعم: ${flavor}\n` +
    `• بطاطس: ${potatoes ? "إضافة 4 قطع" : "لا"}\n` +
    `• الإجمالي: ${total} ج.م\n\n` +
    `الاسم:\nالعنوان والمنطقة:\nالموعد المناسب:`;

  const sendOrder = () => {
    if (!WHATSAPP_NUMBER) {
      toast.info("سنضيف رقم واتساب الطلبات هنا قبل الإطلاق.");
      return;
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`, "_blank", "noopener,noreferrer");
  };

  const chooseProduct = (nextProduct: Product) => {
    setProduct(nextProduct);
    setSelectedId(nextProduct === "grape" ? "30" : "fatta-small");
  };

  const openTikTok = () => {
    if (!TIKTOK_URL) {
      toast.info("سنضيف رابط TikTok هنا قبل الإطلاق.");
      return;
    }
    window.open(TIKTOK_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="site-shell paper-grain" dir="rtl">
      <header className="site-header" aria-label="التنقل الرئيسي">
        <a className="brand-lockup" href="#top" aria-label="ورق العنب اللذيذ - الرئيسية">
          <img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" />
          <span><strong>ورق العنب</strong><em>اللذيذ</em></span>
        </a>

        <nav className="desktop-nav" aria-label="أقسام الموقع">
          <button onClick={() => scrollToSection("order")}>المنيو</button>
          <button onClick={() => scrollToSection("delivery")}>التوصيل</button>
          <button onClick={() => scrollToSection("contact")}>تواصل</button>
        </nav>

        <button className="header-order" onClick={sendOrder}>
          <MessageCircle size={17} /> اطلب الآن
        </button>

        <button
          className="mobile-menu-button"
          aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={23} /> : <Menu size={24} />}
        </button>
      </header>

      {isMenuOpen && (
        <div className="mobile-menu" aria-label="قائمة الجوال">
          {[
            ["المنيو", "order"],
            ["التوصيل", "delivery"],
            ["تواصل", "contact"],
          ].map(([label, id]) => (
            <button key={id} onClick={() => { setIsMenuOpen(false); scrollToSection(id); }}>
              {label}<ArrowLeft size={18} />
            </button>
          ))}
          <button className="mobile-order" onClick={sendOrder}>إرسال طلب عبر واتساب</button>
        </div>
      )}

      <section id="top" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> ورق عنب منزلي في القاهرة</div>
          <h1 id="hero-title">لفّة متظبطة.<span>قعدة مبسوطة.</span></h1>
          <p>اختار طلبك في أقل من دقيقة، وإحنا نجهزه على مزاجك.</p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={() => scrollToSection("order")}>
              اطلب من المنيو <ArrowLeft size={18} />
            </button>
            <span className="hero-note"><Leaf size={16} /> طازج عند الطلب</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="صينية ورق عنب طازج">
          <div className="hero-image-wrap"><img src={heroImage} alt="صينية ورق عنب محضرة طازجة بالليمون" /></div>
          <div className="hero-sticker"><span>01</span><small>اختيار اليوم</small></div>
          <div className="hero-side-note">طعم بيتي<br />بشكل جديد</div>
        </div>
      </section>

      <section id="order" className="order-section" aria-labelledby="order-title">
        <div className="order-intro">
          <div>
            <div className="section-index">01 <span>/</span> اطلب بسهولة</div>
            <h2 id="order-title">اختار طلبك<br /><em>في 3 خطوات.</em></h2>
          </div>
          <p>كل اختيار واضح قدامك، والسعر النهائي يظهر فورًا.</p>
        </div>

        <div className="order-layout">
          <div className="steps-area">
            <div className="choice-step">
              <div className="step-heading"><span>1</span><div><small>اختار الصنف</small><h3>نفسك في إيه؟</h3></div></div>
              <div className="product-switch">
                <button className={product === "grape" ? "active" : ""} onClick={() => chooseProduct("grape")}>
                  <Leaf size={21} /><span>ورق عنب</span><small>لفّات على مزاجك</small>
                </button>
                <button className={product === "fatta" ? "active" : ""} onClick={() => chooseProduct("fatta")}>
                  <ShoppingBag size={20} /><span>فتة ورق عنب</span><small>طبق متكامل</small>
                </button>
              </div>
            </div>

            <div className="choice-step">
              <div className="step-heading"><span>2</span><div><small>حدد الكمية</small><h3>{product === "grape" ? "كام حبة تكفيك؟" : "اختار الحجم المناسب"}</h3></div></div>
              <div className={`size-grid ${product === "fatta" ? "fatta-grid" : ""}`} role="radiogroup" aria-label="اختيار حجم الطلب">
                {options.map((item) => {
                  const isSelected = selectedItem.id === item.id;
                  return (
                    <button key={item.id} className={`size-option ${isSelected ? "selected" : ""}`} role="radio" aria-checked={isSelected} onClick={() => setSelectedId(item.id)}>
                      {item.tag && <b>{item.tag}</b>}
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                      <em>{item.price} <small>ج.م</small></em>
                      {isSelected && <i><Check size={14} /></i>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="choice-step last-step">
              <div className="step-heading"><span>3</span><div><small>خلّيه على مزاجك</small><h3>تحبه إزاي؟</h3></div></div>
              <div className="flavor-row">
                {flavors.map((item) => <button key={item} className={flavor === item ? "active" : ""} onClick={() => setFlavor(item)}>{item}</button>)}
              </div>
              <button className={`potato-option ${potatoes ? "active" : ""}`} onClick={() => setPotatoes((current) => !current)} aria-pressed={potatoes}>
                <span>{potatoes ? <Minus size={16} /> : <Plus size={16} />}</span>
                <div><strong>أضف 4 قطع بطاطس</strong><small>إضافة اختيارية</small></div>
                <em>+15 ج.م</em>
              </button>
            </div>
          </div>

          <aside className="simple-summary" aria-label="ملخص طلبك">
            <div className="summary-photo"><img src={detailImage} alt="طبق من ورق العنب المحشي" /></div>
            <div className="summary-label"><span>طلبك</span><ShoppingBag size={18} /></div>
            <div className="summary-row"><span>{productName}</span><strong>{selectedItem.title}</strong></div>
            <div className="summary-row"><span>الطعم</span><strong>{flavor}</strong></div>
            {potatoes && <div className="summary-row"><span>إضافة بطاطس</span><strong>+15 ج.م</strong></div>}
            <div className="summary-total"><span>الإجمالي</span><strong>{total} <small>ج.م</small></strong></div>
            <button className="order-submit" onClick={sendOrder}><Send size={18} /> أرسل طلبي على واتساب</button>
            <p>بعد الضغط هتكتب اسمك وعنوانك وميعادك.</p>
          </aside>
        </div>
      </section>

      <section id="delivery" className="delivery-strip" aria-labelledby="delivery-title">
        <div className="delivery-mark"><img src={brandMark} alt="" /></div>
        <div><p>التوصيل</p><h2 id="delivery-title">من مطبخنا <em>لبيتك.</em></h2></div>
        <div className="delivery-points"><span><MapPin size={18} /> القاهرة — المناطق تضاف قبل الإطلاق</span><span><Clock size={18} /> تجهيز مسبق حسب الطلب</span></div>
        <button className="light-cta" onClick={sendOrder}>اطلب الآن <ArrowLeft size={17} /></button>
      </section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <div>
          <div className="section-index">02 <span>/</span> تواصل</div>
          <h2 id="contact-title">تابعنا وخليك<br /><em>قريب من الجديد.</em></h2>
        </div>
        <div className="social-links">
          <a href="https://www.instagram.com/delicious_grape_leaves94/" target="_blank" rel="noreferrer"><Instagram size={22} /><span>Instagram</span><small>@delicious_grape_leaves94</small><ArrowLeft size={17} /></a>
          <button onClick={openTikTok}><Music2 size={22} /><span>TikTok</span><small>أضف الرابط لاحقًا</small><ArrowLeft size={17} /></button>
          <button onClick={sendOrder}><MessageCircle size={22} /><span>WhatsApp</span><small>لطلباتك واستفساراتك</small><ArrowLeft size={17} /></button>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand-lockup footer-brand" href="#top" aria-label="العودة إلى بداية الصفحة"><img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" /><span><strong>ورق العنب</strong><em>اللذيذ</em></span></a>
        <p>من مطبخنا لبيتك في القاهرة.</p>
        <button onClick={sendOrder}>واتساب الطلبات</button>
      </footer>
    </main>
  );
}
