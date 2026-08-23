/**
 * Experimental design: one direct, low-friction menu where customers select
 * the order type once, adjust quantities beside every item, and review one calm total.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, ChevronLeft, Clock3, MapPin, Minus, PackageCheck, Plus, Search, ShoppingBag, Sparkles, Truck, X } from "lucide-react";
import "./Prototype.css";

type Product = { id: string; name: string; label: string; category: "ورق عنب" | "فتة" | "إضافة"; price: number; description: string; image: string; badge?: string };
type CartItem = Product & { key: string; type: string; qty: number };

const heroImage = "/manus-storage/delicious-grape-leaves-hero_9c69dcdc.jpg";
const brandMark = "/manus-storage/delicious-grape-leaves-mark_7ed4eb45.png";
const grapeImage = "/manus-storage/prototype-grape-leaves-card_39793993.jpg";
const fattaImage = "/manus-storage/prototype-fatta-card_d94c4dea.jpg";
const potatoesImage = "/manus-storage/prototype-potatoes-card_b451acbc.jpg";

const products: Product[] = [
  { id: "grape-20", name: "ورق عنب", label: "20 حبة", category: "ورق عنب", price: 150, description: "طلب خفيف", image: grapeImage },
  { id: "grape-30", name: "ورق عنب", label: "30 حبة", category: "ورق عنب", price: 195, description: "للقعدة الصغيرة", image: grapeImage, badge: "الأكثر طلبًا" },
  { id: "grape-50", name: "ورق عنب", label: "50 حبة", category: "ورق عنب", price: 335, description: "مناسب للّمة", image: grapeImage },
  { id: "grape-80", name: "ورق عنب", label: "80 حبة", category: "ورق عنب", price: 500, description: "للعزومات", image: grapeImage },
  { id: "grape-100", name: "ورق عنب", label: "100 حبة", category: "ورق عنب", price: 600, description: "للعزومات الكبيرة", image: grapeImage },
  { id: "fatta-small", name: "فتة ورق عنب", label: "صغيرة", category: "فتة", price: 150, description: "طبق فردي", image: fattaImage },
  { id: "fatta-large", name: "فتة ورق عنب", label: "كبيرة", category: "فتة", price: 300, description: "للمشاركة", image: fattaImage },
  { id: "potatoes", name: "بطاطس", label: "4 قطع", category: "إضافة", price: 15, description: "إضافة جانبية", image: potatoesImage },
];

export default function Prototype() {
  const [orderType, setOrderType] = useState("عادي");
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

  const productType = (product: Product) => product.category === "ورق عنب" ? orderType : "إضافة";
  const itemKey = (product: Product) => `${product.id}-${productType(product)}`;
  const getQuantity = (product: Product) => cart.find((item) => item.key === itemKey(product))?.qty ?? 0;
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const deliveryFee = mode === "delivery" && cart.length ? 25 : 0;
  const total = subtotal + deliveryFee;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const chooseOrderType = (nextType: string) => {
    setOrderType(nextType);
    setCart((current) => {
      const merged = new Map<string, CartItem>();
      current.forEach((item) => {
        const next = item.category === "ورق عنب" ? { ...item, type: nextType, key: `${item.id}-${nextType}` } : item;
        const existing = merged.get(next.key);
        merged.set(next.key, existing ? { ...next, qty: existing.qty + next.qty } : next);
      });
      return Array.from(merged.values());
    });
  };

  const changeQuantity = (product: Product, delta: number) => {
    const key = itemKey(product);
    setCart((current) => {
      const currentItem = current.find((item) => item.key === key);
      const nextQty = Math.max(0, Math.min(99, (currentItem?.qty ?? 0) + delta));
      if (!currentItem && nextQty > 0) return [...current, { ...product, key, type: productType(product), qty: nextQty }];
      if (currentItem && nextQty === 0) return current.filter((item) => item.key !== key);
      return current.map((item) => item.key === key ? { ...item, qty: nextQty } : item);
    });
  };

  const beginCheckout = () => { if (cart.length) { setCartOpen(false); setCheckoutStep(1); setCheckoutOpen(true); } };
  const confirmOrder = () => { setConfirmedId(`DG-${Math.floor(1000 + Math.random() * 9000)}`); setCart([]); setCheckoutStep(4); };

  return <main className="proto-app direct-order-app" dir="rtl">
    <header className="proto-nav"><a href="/" className="proto-brand"><img className="proto-brand-mark" src={brandMark} alt="رمز ورقة عنب" /> ورق العنب <em>اللذيذ</em></a><nav><a href="#catalog">المنيو</a><a href="#tracker">تتبع الطلب</a><a href="#about">حكاية اللفة</a></nav><button className="cart-trigger" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>السلة</span>{itemCount > 0 && <b>{itemCount}</b>}</button></header>

    <section className="proto-hero"><div className="hero-capsule">مطبخ القاهرة · تجهيز عند الطلب <Sparkles size={14} /></div><div className="proto-hero-copy"><p>طلبك في مكان واحد.</p><h1>اختارها.<br /><em>ونجهزها.</em></h1><span>حدد النوع مرة واحدة، ثم زِد أو قلّل العدد بجانب كل صنف.</span><button onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>ابدأ الطلب <ArrowLeft size={18} /></button></div><div className="proto-hero-art"><img src={heroImage} alt="ورق عنب محضر طازج" /><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><span>من مطبخنا<br />لباب بيتك</span></div></section>

    <section id="catalog" className="catalog-section direct-menu-section"><div className="direct-menu-heading"><div><p>01 / المنيو</p><h2>اطلب <em>بسهولة.</em></h2><span>اختر النوع أولًا، وبعدها عدّل الكمية مباشرة بجانب كل صنف.</span></div><button className="menu-summary-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17} /> راجع الطلب <b>{itemCount}</b></button></div>
      <div className="type-choice"><span>1</span><div><small>أولًا</small><strong>حدد نوع ورق العنب</strong></div><div>{["عادي", "حار", "حامض"].map((choice) => <button key={choice} className={orderType === choice ? "active" : ""} onClick={() => chooseOrderType(choice)}>{orderType === choice && <Check size={14} />}{choice}</button>)}</div></div>
      <div className="direct-list-heading"><span>2</span><strong>اختر الأصناف والعدد</strong><em>كلها في نفس القائمة</em></div>
      <div className="direct-product-list">{products.map((product) => { const qty = getQuantity(product); return <article key={product.id} className={`direct-product-row ${qty > 0 ? "selected" : ""}`}><img src={product.image} alt={product.name} /><div className="product-row-copy"><div><span>{product.category}</span>{product.badge && <b>{product.badge}</b>}</div><h3>{product.name} <em>{product.label}</em></h3><p>{product.description}{product.category === "ورق عنب" && <strong> · {orderType}</strong>}</p></div><div className="product-row-price"><strong>{product.price}</strong><small>ج.م</small></div><div className="direct-quantity"><button aria-label={`إنقاص ${product.name} ${product.label}`} onClick={() => changeQuantity(product, -1)} disabled={qty === 0}><Minus size={16} /></button><output aria-label={`عدد ${product.name} ${product.label}`}>{qty}</output><button aria-label={`زيادة ${product.name} ${product.label}`} onClick={() => changeQuantity(product, 1)}><Plus size={16} /></button></div></article>})}</div>
      <div className="menu-help"><Clock3 size={17} /><span>اختياراتك تنحفظ في السلة تلقائيًا. راجع الإجمالي في أي وقت.</span></div>
    </section>

    <section id="tracker" className="tracker-section"><div><p>02 / تتبع الطلب</p><h2>عايز تعرف<br /><em>طلبك وصل لفين؟</em></h2></div><div className="tracker-panel"><label htmlFor="track-order">رقم الطلب</label><div><input id="track-order" value={trackId} onChange={(e) => setTrackId(e.target.value)} placeholder="مثال: DG-2401" /><button onClick={() => setTracking(Boolean(trackId))}><Search size={18} /> تتبع</button></div>{tracking ? <div className="tracking-progress"><span className="active"><Check size={13} /> تم الاستلام</span><i /><span className="active"><Clock3 size={13} /> تحت التجهيز</span><i /><span><Truck size={13} /> في الطريق</span><i /><span><PackageCheck size={13} /> تم التسليم</span></div> : <p>أدخل رقم الطلب لتشوف حالة الطلب.</p>}</div></section>
    <section id="about" className="proto-note"><span>حكاية اللفة</span><h2>اختيارات واضحة، تجهيز على مهلك،<br />ولفة متظبطة توصلك دافية.</h2><a href="/">عودة للنسخة الحالية <ChevronLeft size={17} /></a></section>

    {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><header><div><ShoppingBag size={19} /><h2>ملخص طلبك</h2></div><button className="close-button" onClick={() => setCartOpen(false)}><X size={19} /></button></header>{cart.length ? <><div className="cart-order-type"><span>نوع ورق العنب</span><strong>{orderType}</strong></div><div className="cart-lines">{cart.map((item) => <article key={item.key}><div><strong>{item.name} <em>{item.label}</em></strong><span>{item.type}</span><small>{item.price * item.qty} ج.م</small></div><div className="mini-control"><button onClick={() => changeQuantity(item, -1)}><Minus size={14} /></button><output>{item.qty}</output><button onClick={() => changeQuantity(item, 1)}><Plus size={14} /></button></div></article>)}</div><div className="fulfillment-toggle"><button className={mode === "delivery" ? "active" : ""} onClick={() => setMode("delivery")}><Truck size={16} /> توصيل</button><button className={mode === "pickup" ? "active" : ""} onClick={() => setMode("pickup")}><MapPin size={16} /> استلام</button></div><div className="cart-total"><span>الإجمالي النهائي</span><strong>{total} <small>ج.م</small></strong><p>{mode === "delivery" ? "رسوم التوصيل التجريبية: 25 ج.م" : "استلام من نقطة تحدد لاحقًا"}</p></div><button className="checkout-button" onClick={beginCheckout}>إكمال الطلب <ArrowLeft size={17} /></button></> : <div className="empty-cart"><ShoppingBag size={30} /><h3>لسه ما اخترتش حاجة</h3><p>زِد العدد بجانب أي صنف علشان يظهر هنا.</p><button onClick={() => { setCartOpen(false); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}>اذهب للمنيو</button></div>}</aside></div>}

    {checkoutOpen && <div className="proto-overlay"><section className="checkout-modal"><button className="close-button" onClick={() => setCheckoutOpen(false)}><X size={19} /></button><div className="checkout-steps"><span className={checkoutStep >= 1 ? "done" : ""}>1</span><i /><span className={checkoutStep >= 2 ? "done" : ""}>2</span><i /><span className={checkoutStep >= 3 ? "done" : ""}>3</span><i /><span className={checkoutStep >= 4 ? "done" : ""}>4</span></div>{checkoutStep === 1 && <div className="checkout-content"><p>الخطوة 1 من 4</p><h2>استلام الطلب</h2><div className="checkout-option-grid"><button className={mode === "delivery" ? "active" : ""} onClick={() => setMode("delivery")}><Truck size={21} /> توصيل للعنوان</button><button className={mode === "pickup" ? "active" : ""} onClick={() => setMode("pickup")}><MapPin size={21} /> استلام من النقطة</button></div><label>تاريخ ووقت مفضل</label><div className="two-inputs"><input type="date" /><select><option>4:00 - 5:00 مساءً</option><option>6:00 - 7:00 مساءً</option><option>8:00 - 9:00 مساءً</option></select></div></div>}{checkoutStep === 2 && <div className="checkout-content"><p>الخطوة 2 من 4</p><h2>بيانات العميل</h2><div className="form-grid"><input placeholder="الاسم الكامل" /><input placeholder="رقم الجوال" /><input placeholder="البريد الإلكتروني (اختياري)" /><input className="wide" placeholder={mode === "delivery" ? "العنوان والمنطقة" : "ملاحظة للاستلام"} /></div></div>}{checkoutStep === 3 && <div className="checkout-content"><p>الخطوة 3 من 4</p><h2>طريقة الدفع</h2><div className="checkout-option-grid payment-grid"><button className="active">الدفع عند الاستلام</button><button>بطاقة بنكية</button><button>Apple Pay</button></div><div className="checkout-review"><span>إجمالي الطلب</span><strong>{total} ج.م</strong></div></div>}{checkoutStep === 4 && <div className="confirmation"><PackageCheck size={42} /><p>تم تأكيد طلبك</p><h2>{confirmedId}</h2><span>سنجهز الطلب خلال 40–60 دقيقة تقريبًا.</span><button onClick={() => { setCheckoutOpen(false); setTrackId(confirmedId); document.getElementById("tracker")?.scrollIntoView({ behavior: "smooth" }); }}>تتبع الطلب</button></div>}{checkoutStep < 4 && <footer><button className="back-step" onClick={() => setCheckoutStep((step) => Math.max(1, step - 1))} disabled={checkoutStep === 1}>رجوع</button><button className="next-step" onClick={() => checkoutStep === 3 ? confirmOrder() : setCheckoutStep((step) => step + 1)}>{checkoutStep === 3 ? "تأكيد الطلب" : "متابعة"}<ArrowLeft size={17} /></button></footer>}</section></div>}
  </main>;
}
