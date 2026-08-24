/**
 * Design note — «مطبخ على الورق»: a warm editorial page with one direct menu,
 * where the customer selects the grape-leaf type once and quantities beside every item.
 */
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Clock, Instagram, Leaf, MapPin, Menu, MessageCircle, Minus, Music2, Plus, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const WHATSAPP_NUMBER = "201141672769";
const TIKTOK_URL = "https://www.tiktok.com/@delicious_grape_leaves";
const heroImage = "/manus-storage/delicious-grape-leaves-hero_9c69dcdc.jpg";
const brandMark = "/manus-storage/delicious-grape-leaves-mark_7ed4eb45.png";

type MenuItem = { id: string; title: string; description: string; price: number; category: "ورق عنب" | "فتة" | "إضافة"; tag?: string };
const orderTypes = ["عادي", "حار"];
const menuItems: MenuItem[] = [
  { id: "20", title: "20 حبة", description: "لشخصين أو مزاجك لوحدك", price: 150, category: "ورق عنب" },
  { id: "30", title: "30 حبة", description: "للقعدة الصغيرة", price: 195, category: "ورق عنب" },
  { id: "50", title: "50 حبة / كيلو", description: "يعادل تقريبًا كيلو ورق عنب", price: 335, category: "ورق عنب", tag: "الأكثر طلبًا" },
  { id: "80", title: "80 حبة", description: "للمة الحلوة", price: 500, category: "ورق عنب" },
  { id: "100", title: "100 حبة", description: "للعزومات", price: 600, category: "ورق عنب" },
  { id: "fatta-small", title: "فتة صغيرة", description: "طبق فردي متكامل", price: 150, category: "فتة" },
  { id: "fatta-large", title: "فتة كبيرة", description: "للمشاركة واللمة", price: 300, category: "فتة" },
  { id: "potatoes", title: "4 قطع بطاطس", description: "إضافة على طلبك", price: 15, category: "إضافة" },
];

function scrollToSection(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }

export default function Home() {
  const managedProducts = trpc.publicSite.products.useQuery();
  const managedSettings = trpc.publicSite.settings.useQuery();
  const managedImages = trpc.publicSite.images.useQuery();
  const managedReviewImages = trpc.publicSite.reviewImages.useQuery();
  const [orderType, setOrderType] = useState("عادي");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<{ url: string; label: string; alt: string } | null>(null);
  const settings = useMemo(() => Object.fromEntries((managedSettings.data ?? []).map(item => [item.key, item.value])), [managedSettings.data]);
  const displayMenuItems = useMemo<MenuItem[]>(() => managedProducts.data?.length ? managedProducts.data.map(item => ({ id: String(item.id), title: item.nameAr, description: item.descriptionAr || "طلب طازج عند الطلب", price: item.price, category: item.category === "فتة" ? "فتة" : item.category === "إضافة" ? "إضافة" : "ورق عنب", tag: item.options && typeof item.options === "object" && "tag" in item.options && typeof item.options.tag === "string" ? item.options.tag : undefined })) : menuItems, [managedProducts.data]);
  const whatsappNumber = settings["contact.whatsapp"] || WHATSAPP_NUMBER;
  const tiktokUrl = settings["contact.tiktok"] || TIKTOK_URL;
  const images = useMemo(() => Object.fromEntries((managedImages.data ?? []).map(image => [image.slot, image.url])), [managedImages.data]);
  const copy = (key: string, fallback: string) => settings[key] || fallback;
  const heroMain = copy("home.title.primary", "لفّة متظبطة.");
  const heroAccent = copy("home.title.accent", "قعدة مبسوطة.");
  const heroDescription = copy("home.description", "اختار نوع ورق العنب، ثم زِد العدد جنب كل صنف — والإجمالي يبان فورًا.");
  const heroPhoto = images["hero-main"] || heroImage;
  const cartItems = useMemo(() => displayMenuItems.flatMap((item) => {
    const types = item.category === "ورق عنب" ? orderTypes : ["بدون نوع"];
    return types.map((itemType) => {
      const cartKey = item.category === "ورق عنب" ? `${item.id}::${itemType}` : item.id;
      const quantity = quantities[cartKey] ?? 0;
      return { ...item, itemType: item.category === "ورق عنب" ? itemType : null, cartKey, quantity, subtotal: item.price * quantity };
    }).filter((item) => item.quantity > 0);
  }), [displayMenuItems, quantities]);
  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const changeQuantity = (cartKey: string, amount: number) => setQuantities((current) => ({ ...current, [cartKey]: Math.max(0, Math.min(99, (current[cartKey] ?? 0) + amount)) }));
  const orderMessage = `أهلًا، أريد طلب من ورق العنب اللذيذ:\n` + cartItems.map((item) => `• ${item.category} — ${item.title}${item.itemType ? ` (${item.itemType})` : ""} × ${item.quantity} = ${item.subtotal} ج.م`).join("\n") + `\n• الإجمالي النهائي: ${total} ج.م\n\nالاسم:\nالعنوان والمنطقة:\nالموعد المناسب:`;
  const sendOrder = () => { if (!cartItems.length) { toast.error("زِد العدد بجانب صنف واحد على الأقل قبل إرسال الطلب."); return; } if (!whatsappNumber) { toast.info("سيضاف رقم واتساب الطلبات من لوحة الإدارة قبل الإطلاق."); return; } window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`, "_blank", "noopener,noreferrer"); };
  const openTikTok = () => { if (!tiktokUrl) { toast.info("سيضاف رابط TikTok من لوحة الإدارة قبل الإطلاق."); return; } window.open(tiktokUrl, "_blank", "noopener,noreferrer"); };

  return <main className="site-shell paper-grain" dir="rtl">
    <header className="site-header" aria-label="التنقل الرئيسي"><a className="brand-lockup" href="#top" aria-label="ورق العنب اللذيذ - الرئيسية"><img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" /><span><strong>ورق العنب</strong><em>اللذيذ</em></span></a><nav className="desktop-nav" aria-label="أقسام الموقع"><button onClick={() => scrollToSection("order")}>المنيو</button><button onClick={() => scrollToSection("delivery")}>التوصيل</button><button onClick={() => scrollToSection("reviews")}>آراء العملاء</button><button onClick={() => scrollToSection("contact")}>تواصل</button></nav><button className="header-order" onClick={sendOrder}><MessageCircle size={17} /> اطلب الآن</button><button className="mobile-menu-button" aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>{isMenuOpen ? <X size={23} /> : <Menu size={24} />}</button></header>
    {isMenuOpen && <div className="mobile-menu" aria-label="قائمة الجوال">{[["المنيو", "order"], ["التوصيل", "delivery"], ["تواصل", "contact"]].map(([label, id]) => <button key={id} onClick={() => { setIsMenuOpen(false); scrollToSection(id); }}>{label}<ArrowLeft size={18} /></button>)}<button className="mobile-order" onClick={sendOrder}>إرسال طلب عبر واتساب</button></div>}

    <section id="top" className="hero-section" aria-labelledby="hero-title"><div className="hero-copy"><div className="eyebrow"><Sparkles size={15} /> {copy("home.eyebrow", "ورق عنب منزلي في القاهرة")}</div><h1 id="hero-title">{heroMain}<span>{heroAccent}</span></h1><p>{heroDescription}</p><div className="hero-actions"><button className="primary-cta" onClick={() => scrollToSection("order")}>{copy("order.cta", "اطلب من المنيو")} <ArrowLeft size={18} /></button><span className="hero-note"><Leaf size={16} /> {copy("home.note", "طازج عند الطلب")}</span></div></div><div className="hero-visual" aria-label="صينية ورق عنب طازج"><div className="hero-image-wrap"><img src={heroPhoto} alt={copy("home.heroAlt", "صينية ورق عنب محضرة طازجة بالليمون")} /></div><div className="hero-sticker"><span>01</span><small>{copy("home.sticker", "اختيار اليوم")}</small></div><div className="hero-side-note">{copy("home.sideNote", "طعم بيتي بشكل جديد")}</div></div></section>

            <section id="order" className="order-section root-direct-section" aria-labelledby="order-title"><div className="order-intro"><div><div className="section-index">01 <span>/</span> المنيو</div><h2 id="order-title">اطلبها <em>بسهولة.</em></h2></div><p>اختر النوع أولًا، ثم أضف الصنف والعدد. يمكنك تبديل النوع وإضافة الصنف نفسه مجددًا.</p></div><div className="root-direct-shell"><div className="root-menu-flow"><section className="root-type-step"><div className="root-step-heading"><span>1</span><div><small>أولًا</small><h3>حدد النوع الذي ستضيفه الآن</h3></div></div><div className="root-type-options" role="radiogroup" aria-label="نوع ورق العنب">{orderTypes.map((item) => <button key={item} role="radio" aria-checked={orderType === item} className={orderType === item ? "selected" : ""} onClick={() => setOrderType(item)}>{orderType === item && <Check size={14} />}{item}</button>)}</div></section><section className="root-items-step"><div className="root-step-heading"><span>2</span><div><small>أضف بالعدد الذي تريده</small><h3>كل الأصناف في منيو واحد</h3></div></div><div className="root-menu-list">{displayMenuItems.map((item) => { const cartKey = item.category === "ورق عنب" ? `${item.id}::${orderType}` : item.id; const qty = quantities[cartKey] ?? 0; return <article key={`${item.id}-${orderType}`} className={`root-menu-row ${qty > 0 ? "selected" : ""}`}><div className="root-row-copy"><div><small>{item.category}</small>{item.tag && <b>{item.tag}</b>}</div><strong>{item.title}</strong><span>{item.description}{item.category === "ورق عنب" && <em> · النوع المضاف الآن: {orderType}</em>}</span></div><div className="root-row-price"><strong>{item.price}</strong><small>ج.م</small></div><div className="root-row-quantity"><button aria-label={`إنقاص ${item.title}`} onClick={() => changeQuantity(cartKey, -1)} disabled={qty === 0}><Minus size={15} /></button><output aria-label={`عدد ${item.title}`}>{qty}</output><button aria-label={`زيادة ${item.title}`} onClick={() => changeQuantity(cartKey, 1)}><Plus size={15} /></button></div></article>})}</div><p className="root-menu-note"><Clock size={15} /> بدّل بين عادي وحار ثم أضف الصنف نفسه مرة أخرى إن رغبت.</p></section></div><aside className="root-order-summary" aria-label="ملخص وإجمالي الطلب"><div className="compact-summary-head"><span>ملخص طلبك</span><ShoppingBag size={17} /></div>{cartItems.length ? <div className="root-summary-items">{cartItems.map((item) => <div key={item.cartKey}><span>{item.title}{item.itemType ? <small> · {item.itemType}</small> : null} <small>× {item.quantity}</small></span><strong>{item.subtotal} ج.م</strong></div>)}</div> : <p className="root-summary-empty">اختر النوع ثم زِد العدد بجانب الصنف المطلوب.</p>}<div className="compact-total"><span>الإجمالي النهائي</span><strong>{total} <small>ج.م</small></strong></div><button className="compact-submit" onClick={sendOrder}><Send size={16} /> إرسال الطلب</button><p>سيظهر النوع والكميات في رسالة واتساب.</p></aside></div></section>

    <section id="delivery" className="delivery-strip" aria-labelledby="delivery-title"><div className="delivery-mark"><img src={brandMark} alt="" /></div><div><p>{copy("delivery.label", "التوصيل")}</p><h2 id="delivery-title">{copy("delivery.title", "من مطبخنا")} <em>{copy("delivery.accent", "لبيتك.")}</em></h2></div><div className="delivery-points"><span><MapPin size={18} /> {copy("delivery.areas", "توصيل لجميع أنحاء القاهرة")}</span><span><MapPin size={18} /> {copy("delivery.pickup", "استلام من الثلاثيني — فيصل")}</span><span><Clock size={18} /> {copy("delivery.prepTime", "يفضل الحجز قبل يوم حتى الساعة 12، أو حسب الكمية المتوفرة")}</span><span><Clock size={18} /> {copy("delivery.eta", "وقت التوصيل يختلف حسب المنطقة")}</span><span><MessageCircle size={18} /> {copy("payment.methods", "الدفع: كاش، فودافون كاش، أو إنستاباي")}</span></div><button className="light-cta" onClick={sendOrder}>{copy("delivery.cta", "اطلب الآن")} <ArrowLeft size={17} /></button></section>
    <section id="reviews" className="contact-section" aria-labelledby="reviews-title"><div><div className="section-index">02 <span>/</span> آراء العملاء</div><h2 id="reviews-title">تجارب <em>من عملائنا.</em></h2></div><div className="image-grid">{managedReviewImages.data?.length ? managedReviewImages.data.map(review => <button type="button" className="review-image-button" key={review.id} onClick={() => setSelectedReview({ url: review.url, label: review.labelAr, alt: review.altAr || review.labelAr })}><img src={review.url} alt={review.altAr || review.labelAr} /><span>{review.labelAr} · اضغط للقراءة</span></button>) : <p className="empty-admin">ستظهر هنا صور آراء العملاء التي تضيفها من لوحة المالك.</p>}</div></section>
    {selectedReview && <div role="dialog" aria-modal="true" aria-label={selectedReview.label} onClick={() => setSelectedReview(null)} style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", padding: "1rem", background: "rgba(15, 35, 28, .78)" }}><div onClick={(event) => event.stopPropagation()} style={{ position: "relative", maxWidth: "min(960px, 96vw)", maxHeight: "92vh", overflow: "auto", padding: ".65rem", background: "#fffdf8" }}><button type="button" aria-label="إغلاق صورة الرأي" onClick={() => setSelectedReview(null)} style={{ position: "absolute", top: ".8rem", left: ".8rem", display: "grid", placeItems: "center", width: "2.25rem", height: "2.25rem", borderRadius: "50%", background: "#18372d", color: "white" }}><X size={18} /></button><img src={selectedReview.url} alt={selectedReview.alt} style={{ display: "block", maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }} /><p style={{ margin: ".65rem .2rem .1rem", color: "#18372d" }}>{selectedReview.label}</p></div></div>}
    <section id="contact" className="contact-section" aria-labelledby="contact-title"><div><div className="section-index">02 <span>/</span> تواصل</div><h2 id="contact-title">تابعنا وخليك<br /><em>قريب من الجديد.</em></h2></div><div className="social-links"><a href="https://www.instagram.com/delicious_grape_leaves94/" target="_blank" rel="noreferrer"><Instagram size={22} /><span>Instagram</span><small>@delicious_grape_leaves94</small><ArrowLeft size={17} /></a><button onClick={openTikTok}><Music2 size={22} /><span>TikTok</span><small>أضف الرابط لاحقًا</small><ArrowLeft size={17} /></button><button onClick={sendOrder}><MessageCircle size={22} /><span>WhatsApp</span><small>لطلباتك واستفساراتك</small><ArrowLeft size={17} /></button></div></section>
    <footer className="site-footer"><a className="brand-lockup footer-brand" href="#top" aria-label="العودة إلى بداية الصفحة"><img src={brandMark} alt="رمز ورقة عنب مطوية" className="brand-mark" /><span><strong>ورق العنب</strong><em>اللذيذ</em></span></a><p>من مطبخنا لبيتك في القاهرة.</p><button onClick={sendOrder}>واتساب الطلبات</button></footer>
  </main>;
}
