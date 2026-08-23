/**
 * Experimental design: an editorial food-commerce concept with glass navigation,
 * local cart state, progressive checkout, and no fabricated customer reviews.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, ChevronLeft, Clock3, MapPin, Menu, Minus, PackageCheck, Plus, Search, ShoppingBag, Sparkles, Truck, X } from "lucide-react";
import "./Prototype.css";

type Product = { id: string; name: string; category: string; price: number; description: string; badge?: string; tone: string; image: string };
type CartItem = Product & { key: string; type: string; qty: number };

const heroImage = "/manus-storage/delicious-grape-leaves-hero_9c69dcdc.jpg";
const brandMark = "/manus-storage/delicious-grape-leaves-mark_7ed4eb45.png";
const grapeImage = "/manus-storage/prototype-grape-leaves-card_39793993.jpg";
const fattaImage = "/manus-storage/prototype-fatta-card_d94c4dea.jpg";
const potatoesImage = "/manus-storage/prototype-potatoes-card_b451acbc.jpg";
const products: Product[] = [
  { id: "grape-20", name: "20 حبة", category: "ورق عنب", price: 150, description: "طلب خفيف ومجهز طازجًا.", tone: "sage", image: grapeImage },
  { id: "grape-30", name: "30 حبة", category: "ورق عنب", price: 195, description: "اختيار مناسب للقعدة الصغيرة.", badge: "الأكثر طلبًا", tone: "clay", image: grapeImage },
  { id: "grape-50", name: "50 حبة", category: "ورق عنب", price: 335, description: "حجم مناسب للّمة.", tone: "olive", image: grapeImage },
  { id: "fatta-small", name: "فتة صغيرة", category: "فتة", price: 150, description: "طبق فردي متكامل.", tone: "cream", image: fattaImage },
  { id: "fatta-large", name: "فتة كبيرة", category: "فتة", price: 300, description: "صحن للمشاركة.", tone: "saffron", image: fattaImage },
  { id: "potatoes", name: "4 قطع بطاطس", category: "إضافات", price: 15, description: "إضافة جانبية بسيطة.", tone: "clay", image: potatoesImage },
];
const categories = ["الكل", "ورق عنب", "فتة", "إضافات"];

export default function Prototype() {
  const [category, setCategory] = useState("الكل");
  const [selected, setSelected] = useState<Product | null>(null);
  const [type, setType] = useState("عادي");
  const [productQty, setProductQty] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [confirmedId, setConfirmedId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [tracking, setTracking] = useState(false);

  useEffect(() => { const saved = localStorage.getItem("dgl-prototype-cart"); if (saved) setCart(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem("dgl-prototype-cart", JSON.stringify(cart)); }, [cart]);
  const filtered = category === "الكل" ? products : products.filter((item) => item.category === category);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const service = mode === "delivery" && cart.length ? 25 : 0;
  const total = subtotal + service;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (product: Product, chosenType: string, qty: number) => {
    const key = `${product.id}-${chosenType}`;
    setCart((current) => {
      const found = current.find((item) => item.key === key);
      return found ? current.map((item) => item.key === key ? { ...item, qty: item.qty + qty } : item) : [...current, { ...product, key, type: chosenType, qty }];
    });
    setSelected(null); setCartOpen(true);
  };
  const changeCartQty = (key: string, qty: number) => setCart((current) => current.flatMap((item) => item.key === key ? (qty < 1 ? [] : [{ ...item, qty }]) : [item]));
  const beginCheckout = () => { if (cart.length) { setCartOpen(false); setCheckoutOpen(true); setCheckoutStep(1); } };
  const confirmOrder = () => { setConfirmedId(`DG-${Math.floor(1000 + Math.random() * 9000)}`); setCheckoutStep(4); setCart([]); };

  return <main className="proto-app" dir="rtl">
    <header className="proto-nav"><a href="/" className="proto-brand"><img className="proto-brand-mark" src={brandMark} alt="رمز ورقة عنب" /> ورق العنب <em>اللذيذ</em></a><nav><a href="#catalog">المنيو</a><a href="#tracker">تتبع الطلب</a><a href="#about">حكاية اللفة</a></nav><button className="cart-trigger" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>السلة</span>{itemCount > 0 && <b>{itemCount}</b>}</button></header>

    <section className="proto-hero"><div className="hero-capsule">مطبخ القاهرة · تجهيز عند الطلب <Sparkles size={14} /></div><div className="proto-hero-copy"><p>راحة الطلب، بلا تعقيد.</p><h1>اختارها.<br /><em>ونجهزها.</em></h1><span>اللفة المتظبطة من أول اختيار، لحد ما توصلك على باب البيت.</span><button onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>ابدأ الطلب <ArrowLeft size={18} /></button></div><div className="proto-hero-art"><img src={heroImage} alt="ورق عنب محضر طازج" /><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><span>من مطبخنا<br />لباب بيتك</span></div></section>

    <section id="catalog" className="catalog-section"><div className="catalog-heading"><div><p>01 / المنيو</p><h2>كل اللي تحتاجه<br /><em>في سلة واحدة.</em></h2></div><span>اضغط على أي صنف لتخصيصه وإضافته.</span></div><div className="catalog-tabs">{categories.map((tab) => <button key={tab} className={category === tab ? "active" : ""} onClick={() => setCategory(tab)}>{tab}</button>)}</div><motion.div layout className="catalog-grid">{filtered.map((product, index) => <motion.article layout key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }} className={`product-card tone-${product.tone}`}><div className="product-wash" style={{ backgroundImage: `url(${product.image})` }}><span>{product.category}</span>{product.badge && <b>{product.badge}</b>}</div><div><h3>{product.name}</h3><p>{product.description}</p></div><footer><strong>{product.price} <small>ج.م</small></strong><button aria-label={`تخصيص ${product.name}`} onClick={() => { setSelected(product); setProductQty(1); setType("عادي"); }}><Plus size={18} /></button></footer></motion.article>)}</motion.div></section>

    <section id="tracker" className="tracker-section"><div><p>02 / تتبع الطلب</p><h2>عايز تعرف<br /><em>طلبك وصل لفين؟</em></h2></div><div className="tracker-panel"><label htmlFor="track-order">رقم الطلب</label><div><input id="track-order" value={trackId} onChange={(e) => setTrackId(e.target.value)} placeholder="مثال: DG-2401" /><button onClick={() => setTracking(Boolean(trackId))}><Search size={18} /> تتبع</button></div>{tracking ? <div className="tracking-progress"><span className="active"><Check size={13} /> تم الاستلام</span><i /><span className="active"><Clock3 size={13} /> تحت التجهيز</span><i /><span><Truck size={13} /> في الطريق</span><i /><span><PackageCheck size={13} /> تم التسليم</span></div> : <p>هذه واجهة تجريبية؛ أدخل أي رقم لمعاينة حالة الطلب.</p>}</div></section>

    <section id="about" className="proto-note"><span>حكاية اللفة</span><h2>اختيارات واضحة، تجهيز على مهلك،<br />ولفة متظبطة توصلك دافية.</h2><a href="/">عودة للنسخة الحالية <ChevronLeft size={17} /></a></section>

    <AnimatePresence>{selected && <motion.div className="proto-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}><motion.section className="product-modal" initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .98 }} onClick={(e) => e.stopPropagation()}><button className="close-button" onClick={() => setSelected(null)}><X size={19} /></button><div className="modal-visual" style={{ backgroundImage: `linear-gradient(0deg, rgba(18,55,43,.62), rgba(18,55,43,.05)), url(${selected.image})` }}><span>{selected.category}</span><strong>{selected.name}</strong></div><div className="modal-content"><p className="modal-kicker">تخصيص الطلب</p><h2>{selected.name}</h2><p>{selected.description}</p>{selected.category === "ورق عنب" && <div className="type-picker"><span>نوع الطلب</span><div>{["عادي", "حار", "حامض"].map((choice) => <button key={choice} className={type === choice ? "active" : ""} onClick={() => setType(choice)}>{choice}</button>)}</div></div>}<div className="modal-bottom"><div className="quantity-picker"><button onClick={() => setProductQty((qty) => Math.max(1, qty - 1))}><Minus size={16} /></button><output>{productQty}</output><button onClick={() => setProductQty((qty) => Math.min(99, qty + 1))}><Plus size={16} /></button></div><button className="add-product" onClick={() => addToCart(selected, selected.category === "ورق عنب" ? type : "عادي", productQty)}>أضف للسلة · {selected.price * productQty} ج.م</button></div></div></motion.section></motion.div>}</AnimatePresence>

    <AnimatePresence>{cartOpen && <motion.div className="cart-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)}><motion.aside className="cart-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 310, damping: 31 }} onClick={(e) => e.stopPropagation()}><header><div><ShoppingBag size={19} /><h2>سلتك</h2></div><button className="close-button" onClick={() => setCartOpen(false)}><X size={19} /></button></header>{cart.length ? <><div className="cart-lines">{cart.map((item) => <article key={item.key}><div><strong>{item.name}</strong><span>{item.type}</span><small>{item.price * item.qty} ج.م</small></div><div className="mini-control"><button onClick={() => changeCartQty(item.key, item.qty - 1)}><Minus size={14} /></button><output>{item.qty}</output><button onClick={() => changeCartQty(item.key, item.qty + 1)}><Plus size={14} /></button></div></article>)}</div><div className="fulfillment-toggle"><button className={mode === "delivery" ? "active" : ""} onClick={() => setMode("delivery")}><Truck size={16} /> توصيل</button><button className={mode === "pickup" ? "active" : ""} onClick={() => setMode("pickup")}><MapPin size={16} /> استلام</button></div><div className="cart-total"><span>الإجمالي</span><strong>{total} <small>ج.م</small></strong><p>{mode === "delivery" ? `يشمل 25 ج.م رسوم توصيل تجريبية` : "استلام من نقطة تحدد لاحقًا"}</p></div><button className="checkout-button" onClick={beginCheckout}>إكمال الطلب <ArrowLeft size={17} /></button></> : <div className="empty-cart"><ShoppingBag size={30} /><h3>السلة فارغة</h3><p>أضف صنفًا من المنيو لتبدأ.</p><button onClick={() => { setCartOpen(false); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>استعرض المنيو</button></div>}</motion.aside></motion.div>}</AnimatePresence>

    <AnimatePresence>{checkoutOpen && <motion.div className="proto-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.section className="checkout-modal" initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}><button className="close-button" onClick={() => setCheckoutOpen(false)}><X size={19} /></button><div className="checkout-steps"><span className={checkoutStep >= 1 ? "done" : ""}>1</span><i /><span className={checkoutStep >= 2 ? "done" : ""}>2</span><i /><span className={checkoutStep >= 3 ? "done" : ""}>3</span><i /><span className={checkoutStep >= 4 ? "done" : ""}>4</span></div>{checkoutStep === 1 && <div className="checkout-content"><p>الخطوة 1 من 4</p><h2>طريقة استلام الطلب</h2><div className="checkout-option-grid"><button className={mode === "delivery" ? "active" : ""} onClick={() => setMode("delivery")}><Truck size={21} /> توصيل للعنوان</button><button className={mode === "pickup" ? "active" : ""} onClick={() => setMode("pickup")}><MapPin size={21} /> استلام من النقطة</button></div><label>تاريخ ووقت مفضل</label><div className="two-inputs"><input type="date" /><select><option>4:00 - 5:00 مساءً</option><option>6:00 - 7:00 مساءً</option><option>8:00 - 9:00 مساءً</option></select></div></div>}{checkoutStep === 2 && <div className="checkout-content"><p>الخطوة 2 من 4</p><h2>بيانات العميل</h2><div className="form-grid"><input placeholder="الاسم الكامل" /><input placeholder="رقم الجوال" /><input placeholder="البريد الإلكتروني (اختياري)" /><input className="wide" placeholder={mode === "delivery" ? "العنوان والمنطقة" : "ملاحظة للاستلام"} /></div></div>}{checkoutStep === 3 && <div className="checkout-content"><p>الخطوة 3 من 4</p><h2>اختار طريقة الدفع</h2><div className="checkout-option-grid payment-grid"><button className="active">الدفع عند الاستلام</button><button>بطاقة بنكية</button><button>Apple Pay</button></div><div className="checkout-review"><span>إجمالي الطلب</span><strong>{total} ج.م</strong></div></div>}{checkoutStep === 4 && <div className="confirmation"><PackageCheck size={42} /><p>تم تأكيد الطلب التجريبي</p><h2>{confirmedId}</h2><span>سنجهز طلبك خلال 40–60 دقيقة تقريبًا.</span><button onClick={() => { setCheckoutOpen(false); setTrackId(confirmedId); document.getElementById("tracker")?.scrollIntoView({ behavior: "smooth" }); }}>تتبع الطلب</button></div>}{checkoutStep < 4 && <footer><button className="back-step" onClick={() => setCheckoutStep((step) => Math.max(1, step - 1))} disabled={checkoutStep === 1}>رجوع</button><button className="next-step" onClick={() => checkoutStep === 3 ? confirmOrder() : setCheckoutStep((step) => step + 1)}>{checkoutStep === 3 ? "تأكيد طلب تجريبي" : "متابعة"}<ArrowLeft size={17} /></button></footer>}</motion.section></motion.div>}</AnimatePresence>
  </main>;
}
