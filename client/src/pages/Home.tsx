/**
 * Design note — «مطبخ على الورق»: warm ivory, dew-sage and clay accents;
 * editorial asymmetric food layout; tactile paper layers; calm, direct ordering.
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
  Plus,
  Send,
  ShoppingBag,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = ""; // أضيفي الرقم بصيغة 201XXXXXXXXX قبل الإطلاق.

const heroImage = "/manus-storage/delicious-grape-leaves-hero_9c69dcdc.jpg";
const detailImage = "/manus-storage/delicious-grape-leaves-detail_a83761d1.jpg";
const tableImage = "/manus-storage/delicious-grape-leaves-table_fd7b8b07.jpg";
const brandMark = "/manus-storage/delicious-grape-leaves-mark_7ed4eb45.png";

const portions = [
  { count: "20", price: 150, note: "لشخصين أو مزاجك لوحدك" },
  { count: "30", price: 195, note: "للقعدة الصغيرة" },
  { count: "50", price: 335, note: "الخيار المحبوب" },
  { count: "80", price: 500, note: "للمة الحلوة" },
  { count: "100", price: 600, note: "للعزومات" },
];

const flavors = ["عادي", "حامض", "سبايسي", "ليمون زيادة"];

const specialDishes = [
  { name: "فتة ورق عنب صغيرة", price: 150 },
  { name: "فتة ورق عنب كبيرة", price: 300 },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [portion, setPortion] = useState(portions[0]);
  const [flavor, setFlavor] = useState("عادي");
  const [potatoes, setPotatoes] = useState(false);
  const [specialDish, setSpecialDish] = useState<(typeof specialDishes)[number] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeItem = specialDish ?? portion;
  const total = activeItem.price + (potatoes ? 15 : 0);
  const itemLabel = specialDish ? specialDish.name : `${portion.count} حبة ورق عنب`;

  const orderMessage = useMemo(
    () =>
      `أهلًا، أريد طلب من ورق العنب اللذيذ:\n` +
      `• الطلب: ${itemLabel}\n` +
      `• الطعم: ${flavor}\n` +
      `• بطاطس: ${potatoes ? "إضافة 4 قطع" : "لا"}\n` +
      `• الإجمالي: ${total} ج.م\n\n` +
      `الاسم:\nالعنوان والمنطقة:\nالموعد المناسب:`,
    [flavor, itemLabel, potatoes, total],
  );

  const sendOrder = () => {
    if (!WHATSAPP_NUMBER) {
      toast.info("سنضيف رقم واتساب الطلبات هنا قبل الإطلاق.");
      return;
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`, "_blank", "noopener,noreferrer");
  };

  const selectPortion = (item: (typeof portions)[number]) => {
    setSpecialDish(null);
    setPortion(item);
  };

  const selectSpecial = (item: (typeof specialDishes)[number]) => {
    setSpecialDish((current) => (current?.name === item.name ? null : item));
  };

  return (
    <main className="site-shell paper-grain" dir="rtl">
      <header className="site-header" aria-label="التنقل الرئيسي">
        <a className="brand-lockup" href="#top" aria-label="ورق العنب اللذيذ - الرئيسية">
          <img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" />
          <span>
            <strong>ورق العنب</strong>
            <em>اللذيذ</em>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="أقسام الموقع">
          <button onClick={() => scrollToSection("story")}>حكايتنا</button>
          <button onClick={() => scrollToSection("menu")}>المنيو</button>
          <button onClick={() => scrollToSection("delivery")}>التوصيل</button>
        </nav>

        <button className="header-order" onClick={sendOrder}>
          <MessageCircle size={17} />
          <span>اطلب الآن</span>
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
            ["حكايتنا", "story"],
            ["المنيو", "menu"],
            ["التوصيل", "delivery"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => {
                setIsMenuOpen(false);
                scrollToSection(id);
              }}
            >
              {label}
              <ArrowLeft size={18} />
            </button>
          ))}
          <button className="mobile-order" onClick={sendOrder}>
            إرسال طلب عبر واتساب
          </button>
        </div>
      )}

      <section id="top" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> معمول على مزاجك في القاهرة</div>
          <h1 id="hero-title">
            ورق عنب
            <span>يلفّ اليوم</span>
            <i>ويفرّح القعدة.</i>
          </h1>
          <p>
            وصفة منزلية بطعم متظبط. اختار الكمية والطعم، وإحنا نجهزهولك بعناية.
          </p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={() => scrollToSection("menu")}>
              شوف المنيو <ArrowLeft size={18} />
            </button>
            <button className="text-cta" onClick={() => scrollToSection("delivery")}>
              <span>التوصيل في القاهرة</span>
              <span className="text-cta-line" />
            </button>
          </div>
          <div className="hero-footnote"><span /> طازج عند الطلب · تجهيز بحب</div>
        </div>

        <div className="hero-visual" aria-label="صينية ورق عنب طازج">
          <div className="hero-image-wrap">
            <img src={heroImage} alt="صينية ورق عنب محضرة طازجة بالليمون" />
          </div>
          <div className="hero-sticker hero-sticker-top"><Leaf size={18} /> لفّات متظبطة</div>
          <div className="hero-sticker hero-sticker-bottom">
            <span>01</span>
            <small>اختيار اليوم</small>
          </div>
          <div className="hero-side-note">طعم بيتي<br />بشكل جديد</div>
        </div>
      </section>

      <div className="rolling-line" aria-hidden="true">
        <span>ورق عنب لذيذ</span><b>✦</b><span>يتحضّر بحب</span><b>✦</b><span>على مزاجك</span><b>✦</b><span>ورق عنب لذيذ</span>
      </div>

      <section id="story" className="story-section section-pad" aria-labelledby="story-title">
        <div className="section-index">01 <span>/</span> حكاية الطعم</div>
        <div className="story-grid">
          <div className="story-media">
            <div className="paper-frame frame-large">
              <img src={detailImage} alt="طبق صغير من ورق العنب المحشي" />
            </div>
            <div className="story-mini-note">كل لفّة<br /><strong>بتتحضّر لوحدها.</strong></div>
          </div>
          <div className="story-copy">
            <p className="mini-label">من مطبخنا لبيتك</p>
            <h2 id="story-title">الفرق يبان<br />من أول <em>لفّة.</em></h2>
            <p className="body-copy">
              بنلفّ ورق العنب بحرص، ونوازن الحموضة والتتبيلة عشان كل حبة تبقى بطعمها. وجبة بيتية مريحة، لكن بتفاصيل تستاهلها القعدة.
            </p>
            <div className="story-points">
              <span><Check size={15} /> تجهيز عند الطلب</span>
              <span><Check size={15} /> اختيارات على مزاجك</span>
              <span><Check size={15} /> مناسب للّمة والعزومة</span>
            </div>
            <button className="underline-link" onClick={() => scrollToSection("menu")}>
              اختار طلبك <ArrowLeft size={17} />
            </button>
          </div>
        </div>
      </section>

      <section id="menu" className="menu-section section-pad" aria-labelledby="menu-title">
        <div className="menu-head">
          <div>
            <div className="section-index">02 <span>/</span> المنيو</div>
            <h2 id="menu-title">اختار <em>اللي يكفيك.</em></h2>
          </div>
          <p>غيّر الكمية والطعم، وراجع طلبك قبل ما تبعته على واتساب.</p>
        </div>

        <div className="menu-layout">
          <div className="menu-controls">
            <div className="menu-group">
              <div className="group-title"><span>أولًا</span><h3>كم حبة نفسك فيها؟</h3></div>
              <div className="portion-list" role="radiogroup" aria-label="اختيار كمية ورق العنب">
                {portions.map((item) => {
                  const selected = !specialDish && portion.count === item.count;
                  return (
                    <button
                      type="button"
                      key={item.count}
                      className={`portion-option ${selected ? "selected" : ""}`}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => selectPortion(item)}
                    >
                      <span className="portion-number">{item.count}<small>حبة</small></span>
                      <span className="portion-note">{item.note}</span>
                      <strong>{item.price}<small>ج.م</small></strong>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="menu-group menu-group-split">
              <div className="group-title"><span>أو</span><h3>فتة ورق عنب</h3></div>
              <div className="special-grid">
                {specialDishes.map((item) => {
                  const selected = specialDish?.name === item.name;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      className={`special-option ${selected ? "selected" : ""}`}
                      onClick={() => selectSpecial(item)}
                    >
                      <Utensils size={19} />
                      <span>{item.name}</span>
                      <strong>{item.price} <small>ج.م</small></strong>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="order-card" aria-label="ملخص الطلب">
            <div className="order-card-top">
              <span>طلبك اليوم</span>
              <ShoppingBag size={19} />
            </div>
            <div className="order-item-main">
              <small>{specialDish ? "اختيار خاص" : "ورق عنب"}</small>
              <strong>{itemLabel}</strong>
              <span>{activeItem.price} ج.م</span>
            </div>
            <div className="flavor-picker">
              <p>تحبه إزاي؟</p>
              <div>
                {flavors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={flavor === item ? "active" : ""}
                    onClick={() => setFlavor(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className={`extra-toggle ${potatoes ? "active" : ""}`}
              onClick={() => setPotatoes((enabled) => !enabled)}
              aria-pressed={potatoes}
            >
              <span className="extra-icon">{potatoes ? <Minus size={15} /> : <Plus size={15} />}</span>
              <span>أضف 4 قطع بطاطس</span>
              <strong>+15 ج.م</strong>
            </button>
            <div className="order-total"><span>الإجمالي</span><strong>{total} <small>ج.م</small></strong></div>
            <button className="order-submit" onClick={sendOrder}>
              <Send size={18} /> إرسال الطلب عبر واتساب
            </button>
            <p className="order-note">هتضيف اسمك وعنوانك وميعادك في رسالة واتساب.</p>
          </aside>
        </div>
      </section>

      <section className="process-section section-pad" aria-labelledby="process-title">
        <div className="process-title-wrap">
          <div className="section-index">03 <span>/</span> الطلب بسيط</div>
          <h2 id="process-title">من اختياره<br />لحد <em>أول لقمة.</em></h2>
        </div>
        <div className="process-list">
          <article>
            <span>01</span>
            <div><h3>اختار طلبك</h3><p>حدد الكمية والطعم والإضافات من المنيو.</p></div>
            <Leaf size={23} />
          </article>
          <article>
            <span>02</span>
            <div><h3>ابعت على واتساب</h3><p>رسالة مرتبة فيها تفاصيل طلبك وعنوانك.</p></div>
            <MessageCircle size={23} />
          </article>
          <article>
            <span>03</span>
            <div><h3>نلفّه ونوصله</h3><p>يتجهز طازج ويتوصل لبيتك في القاهرة.</p></div>
            <ShoppingBag size={23} />
          </article>
        </div>
      </section>

      <section id="delivery" className="delivery-section" aria-labelledby="delivery-title">
        <div className="delivery-photo">
          <img src={tableImage} alt="مائدة منزلية عليها ورق عنب وليمون" />
        </div>
        <div className="delivery-copy">
          <div className="section-index light">04 <span>/</span> التوصيل</div>
          <h2 id="delivery-title">غداك جاهز،<br /><em>بس قول لنا فين.</em></h2>
          <p>استقبل طلباتك على واتساب، واكتب المنطقة والموعد المناسب. تفاصيل مناطق ورسوم التوصيل هتتضاف هنا قبل الإطلاق.</p>
          <div className="delivery-info">
            <span><MapPin size={19} /> القاهرة — تفاصيل المناطق قريبًا</span>
            <span><Clock size={19} /> تجهيز مسبق حسب الطلب</span>
          </div>
          <button className="light-cta" onClick={sendOrder}>ابدأ طلبك <ArrowLeft size={18} /></button>
        </div>
      </section>

      <section className="feedback-section section-pad" aria-labelledby="feedback-title">
        <div className="feedback-mark"><img src={brandMark} alt="" /></div>
        <div>
          <p className="mini-label">بعد التجربة</p>
          <h2 id="feedback-title">كلامكم <em>يفرق.</em></h2>
          <p className="body-copy">التقييمات الحقيقية هنعرضها هنا لما تشاركونا تجربتكم. ابعتولنا رأيكم على Instagram أو واتساب.</p>
        </div>
        <a className="instagram-link" href="https://www.instagram.com/delicious_grape_leaves94/" target="_blank" rel="noreferrer">
          <Instagram size={20} />
          <span>@delicious_grape_leaves94</span>
          <ArrowLeft size={17} />
        </a>
      </section>

      <footer className="site-footer">
        <a className="brand-lockup footer-brand" href="#top" aria-label="العودة إلى بداية الصفحة">
          <img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" />
          <span><strong>ورق العنب</strong><em>اللذيذ</em></span>
        </a>
        <p>من مطبخنا لبيتك في القاهرة.</p>
        <div className="footer-links">
          <a href="https://www.instagram.com/delicious_grape_leaves94/" target="_blank" rel="noreferrer">Instagram</a>
          <button onClick={sendOrder}>WhatsApp</button>
        </div>
      </footer>
    </main>
  );
}
