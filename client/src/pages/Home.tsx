import { useMemo, useState } from "react";
import {
  Clock,
  CreditCard,
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
  Store,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import "./home-redesign.css";

const WHATSAPP_NUMBER = "201141672769";
const TIKTOK_URL = "https://www.tiktok.com/@delicious_grape_leaves";

const brandLogo = "/brand/cairo/logo.jpeg";
const foodPhotos = [
  "/brand/cairo/food-01.jpeg",
  "/brand/cairo/food-02.jpeg",
  "/brand/cairo/food-03.jpeg",
  "/brand/cairo/food-04.jpeg",
  "/brand/cairo/food-05.jpeg",
  "/brand/cairo/food-06.jpeg",
  "/brand/cairo/food-07.jpeg",
  "/brand/cairo/food-08.jpeg",
];

type MenuItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: "ورق عنب" | "فتة" | "إضافة";
  tag?: string;
};

const fallbackMenuItems: MenuItem[] = [
  { id: "20", title: "20 حبة", description: "لشخصين أو مزاجك لوحدك", price: 150, category: "ورق عنب" },
  { id: "50", title: "50 حبة / كيلو", description: "يعادل تقريبًا كيلو ورق عنب", price: 335, category: "ورق عنب", tag: "الأكثر طلبًا" },
  { id: "80", title: "80 حبة", description: "للمة الحلوة", price: 500, category: "ورق عنب" },
  { id: "100", title: "100 حبة", description: "للعزومات", price: 600, category: "ورق عنب" },
  { id: "fatta-small", title: "فتة صغيرة", description: "طبق فردي متكامل", price: 150, category: "فتة" },
  { id: "fatta-large", title: "فتة كبيرة", description: "للمشاركة واللمة", price: 300, category: "فتة" },
  { id: "potatoes", title: "4 قطع بطاطس", description: "إضافة على طلبك", price: 15, category: "إضافة" },
];

const customerReviews = [
  "لذيذذذ مره فتحته على طول يعطيك الف عافيه\nو عجب خالتي مررره تسلم يددددك\nماراح يكون اخر تعامل باذن الله\nبعطيها رقمك و نعتمد مانجيب الا منك",
  "تسلم يدك حبيبتي يجننن الورق عنب صدق كنت\nادور ورق عنب نفس حق السعوديه و لقيتك\nبالصدفه\nشكراً الله يرزقك يارب ❤️❤️",
  "يعطيك العاااافية ❤️❤️❤️\nالذ ورق عنب جربته بمصر ❤️❤️",
  "الورق العنب كان خيااااالي تبارك الرحمن ولذيذ\nوفيه بنات اخذو مني حسابك عجبهم 😍❤️",
  "ايش ورق العنب هذاااااااا؟؟؟؟؟؟؟ كل مره اطعم من\nالي قبلها!! لذيذذذ مررره تسلم اناملك ❤️❤️\n❤️❤️❤️",
  "لذيييييذ لذذذذذذ ما شاء الله 😭 ولا غلطه ما\nشاء الله والكميه تفتح النفس تسلم الايادي\nوبإذن الله نطلب مره ثانيه يجنن 💓💓💓\n💓",
  "رووووووووعه\nقسم بالله\nبله\nعادي طعمت بس من العادي فضيع\nقالت لزم اقولك\nبجد دا ورق عنب والله ييييييييجننننن يسلم يدك 🔥",
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const managedProducts = trpc.publicSite.products.useQuery();
  const managedSettings = trpc.publicSite.settings.useQuery();

  const [orderType, setOrderType] = useState("عادي");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const settings = useMemo<Record<string, string>>(
    () => Object.fromEntries((managedSettings.data ?? []).map((item) => [item.key, item.value])),
    [managedSettings.data],
  );

  const copy = (key: string, fallback: string) => settings[key] || fallback;

  const displayMenuItems = useMemo<MenuItem[]>(
    () =>
      managedProducts.data?.length
        ? managedProducts.data.map((item) => ({
            id: String(item.id),
            title: item.nameAr,
            description: item.descriptionAr || "طلب طازج عند الطلب",
            price: item.price,
            category:
              item.category === "فتة"
                ? "فتة"
                : ["إضافة", "إضافات"].includes(item.category)
                  ? "إضافة"
                  : "ورق عنب",
            tag:
              item.options &&
              typeof item.options === "object" &&
              "tag" in item.options &&
              typeof item.options.tag === "string"
                ? item.options.tag
                : undefined,
          }))
        : fallbackMenuItems,
    [managedProducts.data],
  );

  const visibleMenuItems = useMemo(
    () => displayMenuItems.filter((item) => !/^\s*30\s*حبة/.test(item.title)),
    [displayMenuItems],
  );

  const whatsappNumber = settings["contact.whatsapp"] || WHATSAPP_NUMBER;
  const tiktokUrl = settings["contact.tiktok"] || TIKTOK_URL;
  const orderTypes = [copy("order.typeNormal", "عادي"), copy("order.typeSpicy", "حار")];

  const cartItems = useMemo(
    () =>
      visibleMenuItems.flatMap((item) => {
        const types = item.category === "ورق عنب" ? orderTypes : ["بدون نوع"];
        return types
          .map((itemType) => {
            const cartKey = item.category === "ورق عنب" ? `${item.id}::${itemType}` : item.id;
            const quantity = quantities[cartKey] ?? 0;
            return {
              ...item,
              itemType: item.category === "ورق عنب" ? itemType : null,
              cartKey,
              quantity,
              subtotal: item.price * quantity,
            };
          })
          .filter((item) => item.quantity > 0);
      }),
    [visibleMenuItems, orderTypes, quantities],
  );

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const changeQuantity = (cartKey: string, amount: number) =>
    setQuantities((current) => ({
      ...current,
      [cartKey]: Math.max(0, Math.min(99, (current[cartKey] ?? 0) + amount)),
    }));

  const orderMessage =
    `${copy("order.messageIntro", "أهلًا، أريد طلب من ورق العنب اللذيذ:")}\n` +
    cartItems
      .map(
        (item) =>
          `• ${item.category} — ${item.title}${item.itemType ? ` (${item.itemType})` : ""} × ${item.quantity} = ${item.subtotal} ج.م`,
      )
      .join("\n") +
    `\n• ${copy("order.totalLabel", "الإجمالي النهائي")}: ${total} ج.م\n\n${copy("order.customerNameLabel", "الاسم")}:\n${copy("order.customerPhoneLabel", "رقم التواصل")}:\n${copy("order.locationLabel", "اللوكيشن (رابط Google Maps أو مشاركة الموقع)")}:\n${copy("order.buildingLabel", "رقم العمارة")}:\n${copy("order.floorLabel", "الدور")}:\n${copy("order.apartmentLabel", "الشقة")}:\n\n${copy("delivery.points", "نقاط التوصيل المتاحة: فيصل وأكتوبر")}\n\n${copy("order.confirmationNotice", "لتأكيد الطلب لازم المعلومات كاملة.")}`;

  const sendOrder = () => {
    if (!cartItems.length) {
      toast.error("زِد العدد بجانب صنف واحد على الأقل قبل إرسال الطلب.");
      return;
    }
    if (!whatsappNumber) {
      toast.info("سيضاف رقم واتساب الطلبات من لوحة الإدارة قبل الإطلاق.");
      return;
    }
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const openInquiry = () => {
    if (!whatsappNumber) {
      toast.info("سيضاف رقم واتساب التواصل من لوحة الإدارة قبل الإطلاق.");
      return;
    }
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("أهلًا، أريد الاستفسار عن ورق العنب اللذيذ.")}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <main className="cairo-v2" dir="rtl">
      <header className="cairo-v2__header">
        <button
          className="cairo-v2__menu-button"
          aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={23} /> : <Menu size={24} />}
        </button>

        <button className="cairo-v2__logo-button" onClick={() => scrollToSection("top")} aria-label="الرئيسية">
          <img src={brandLogo} alt="ورق العنب اللذيذ — القاهرة" />
          <span className="cairo-v2__tagline">من جدة للقاهرة</span>
        </button>

        <button className="cairo-v2__cart-button" onClick={() => scrollToSection("order")} aria-label="الانتقال إلى الطلب">
          <ShoppingBag size={22} />
          {itemCount > 0 && <span>{itemCount}</span>}
        </button>
      </header>

      {isMenuOpen && (
        <nav className="cairo-v2__mobile-nav" aria-label="أقسام الموقع">
          {[
            [copy("nav.menu", "المنيو"), "order"],
            [copy("nav.delivery", "التوصيل"), "delivery"],
            [copy("nav.reviews", "آراء العملاء"), "reviews"],
            [copy("nav.contact", "تواصل"), "contact"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => {
                setIsMenuOpen(false);
                scrollToSection(id);
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      )}

      <section id="top" className="cairo-v2__hero">
        <div className="cairo-v2__hero-copy">
          <span className="cairo-v2__eyebrow">
            <Leaf size={16} />
            {copy("home.eyebrow", "ورق عنب منزلي في القاهرة")}
          </span>
          <h1>
            {copy("home.title.primary", "لفّة متظبطة.")}
            <strong>{copy("home.title.accent", "قعدة مبسوطة.")}</strong>
          </h1>
          <p>{copy("home.description", "اختار نوع ورق العنب، ثم زِد العدد جنب كل صنف.")}</p>
        </div>

        <figure className="cairo-v2__hero-photo">
          <div className="cairo-v2__hero-arch" aria-hidden="true" />
          <img src={foodPhotos[1]} alt={copy("home.heroAlt", "صينية ورق عنب محضرة طازجة بالليمون")} />
        </figure>

        <button className="cairo-v2__hero-cta" onClick={() => scrollToSection("order")}>
          <ShoppingBag size={20} />
          {copy("order.cta", "اطلب من المنيو")}
        </button>

        <div className="cairo-v2__hero-points">
          <span><Truck size={21} />{copy("delivery.areas", "توصيل لجميع أنحاء القاهرة")}</span>
          <span><Store size={21} />{copy("delivery.pickup", "استلام من الثلاثيني — فيصل")}</span>
          <span><Leaf size={21} />{copy("home.note", "طازج عند الطلب")}</span>
        </div>
      </section>

      <section id="order" className="cairo-v2__order" aria-labelledby="order-title">
        <div className="cairo-v2__section-heading">
          <span>{copy("order.sectionLabel", "المنيو")}</span>
          <h2 id="order-title">
            {copy("order.title", "اطلبها")} <em>{copy("order.accent", "بسهولة.")}</em>
          </h2>
          <p>{copy("order.description", "اختر النوع أولًا، ثم أضف الصنف والعدد. يمكنك تبديل النوع وإضافة الصنف نفسه مجددًا.")}</p>
        </div>

        <div className="cairo-v2__type-switch" role="radiogroup" aria-label="نوع ورق العنب">
          {orderTypes.map((type) => (
            <button
              key={type}
              role="radio"
              aria-checked={orderType === type}
              className={orderType === type ? "is-active" : ""}
              onClick={() => setOrderType(type)}
            >
              <Leaf size={17} />
              {type}
            </button>
          ))}
        </div>

        <div className="cairo-v2__order-layout">
          <div className="cairo-v2__menu-list">
            {visibleMenuItems.map((item) => {
              const cartKey = item.category === "ورق عنب" ? `${item.id}::${orderType}` : item.id;
              const qty = quantities[cartKey] ?? 0;

              return (
                <article key={item.id} className={`cairo-v2__product ${qty > 0 ? "is-selected" : ""}`}>
                  <div className="cairo-v2__product-copy">
                    <div className="cairo-v2__product-meta">
                      <small>{item.category}</small>
                      {item.tag && <b>{item.tag}</b>}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    {item.category === "ورق عنب" && (
                      <span>{copy("order.selectedType", "النوع المضاف الآن")} : {orderType}</span>
                    )}
                  </div>

                  <div className="cairo-v2__product-buy">
                    <strong>{item.price} <small>ج.م</small></strong>
                    <div className="cairo-v2__qty">
                      <button aria-label={`إنقاص ${item.title}`} onClick={() => changeQuantity(cartKey, -1)} disabled={qty === 0}>
                        <Minus size={16} />
                      </button>
                      <output aria-label={`عدد ${item.title}`}>{qty}</output>
                      <button aria-label={`زيادة ${item.title}`} onClick={() => changeQuantity(cartKey, 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="cairo-v2__summary" aria-label="ملخص وإجمالي الطلب">
            <div className="cairo-v2__summary-title">
              <ShoppingBag size={19} />
              <span>{copy("order.summaryTitle", "ملخص طلبك")}</span>
            </div>

            {cartItems.length ? (
              <div className="cairo-v2__summary-items">
                {cartItems.map((item) => (
                  <div key={item.cartKey}>
                    <span>
                      {item.title}
                      {item.itemType ? <small> · {item.itemType}</small> : null}
                      <small> × {item.quantity}</small>
                    </span>
                    <strong>{item.subtotal} ج.م</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="cairo-v2__empty">{copy("order.emptyCart", "اختر النوع ثم زِد العدد بجانب الصنف المطلوب.")}</p>
            )}

            <div className="cairo-v2__total">
              <span>{copy("order.totalLabel", "الإجمالي النهائي")}</span>
              <strong>{total} <small>ج.م</small></strong>
            </div>

            <button className="cairo-v2__submit" onClick={sendOrder}>
              <Send size={18} />
              {copy("order.submit", "إرسال الطلب")}
            </button>
            <p>{copy("order.note", "سيظهر النوع والكميات في رسالة واتساب.")}</p>
          </aside>
        </div>
      </section>

      <section className="cairo-v2__gallery" aria-label="صور ورق العنب">
        <div className="cairo-v2__gallery-track">
          {foodPhotos.map((photo, index) => (
            <figure key={photo} className={`cairo-v2__gallery-item cairo-v2__gallery-item--${(index % 3) + 1}`}>
              <img src={photo} alt="" loading={index > 2 ? "lazy" : "eager"} />
            </figure>
          ))}
        </div>
      </section>

      <section id="delivery" className="cairo-v2__delivery" aria-labelledby="delivery-title">
        <div className="cairo-v2__section-heading cairo-v2__section-heading--light">
          <span>{copy("delivery.label", "التوصيل")}</span>
          <h2 id="delivery-title">
            {copy("delivery.title", "من مطبخنا")} <em>{copy("delivery.accent", "لبيتك.")}</em>
          </h2>
        </div>

        <div className="cairo-v2__delivery-list">
          <article><Truck /><div><strong>{copy("delivery.areas", "توصيل لجميع أنحاء القاهرة")}</strong></div></article>
          <article><MapPin /><div><strong>{copy("delivery.points", "نقاط التوصيل المتاحة: فيصل وأكتوبر")}</strong></div></article>
          <article><Store /><div><strong>{copy("delivery.pickup", "استلام من الثلاثيني — فيصل")}</strong></div></article>
          <article><Clock /><div><strong>{copy("delivery.prepTime", "يفضل الحجز قبل يوم حتى الساعة 12، أو حسب الكمية المتوفرة")}</strong></div></article>
          <article><Clock /><div><strong>{copy("delivery.eta", "وقت التوصيل يختلف حسب المنطقة")}</strong></div></article>
          <article><CreditCard /><div><strong>{copy("payment.methods", "الدفع: كاش، فودافون كاش، أو إنستاباي")}</strong></div></article>
        </div>

      </section>

      <section id="reviews" className="cairo-v2__reviews" aria-labelledby="reviews-title">
        <div className="cairo-v2__section-heading">
          <span>{copy("reviews.label", "آراء العملاء")}</span>
          <h2 id="reviews-title">
            {copy("reviews.title", "تجارب")} <em>{copy("reviews.accent", "من عملائنا.")}</em>
          </h2>
        </div>

        <div className="cairo-v2__reviews-grid">
          {customerReviews.map((review, index) => (
            <article key={index} className="cairo-v2__review-card">
              <MessageCircle size={22} />
              <p>{review}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="cairo-v2__contact" aria-labelledby="contact-title">
        <div className="cairo-v2__section-heading cairo-v2__section-heading--light">
          <span>{copy("contact.label", "تواصل")}</span>
          <h2 id="contact-title">
            {copy("contact.title", "تابعنا وخليك")} <em>{copy("contact.accent", "قريب من الجديد.")}</em>
          </h2>
        </div>

        <div className="cairo-v2__socials">
          <a href={copy("contact.instagram", "https://www.instagram.com/delicious_grape_leaves94/")} target="_blank" rel="noreferrer">
            <Instagram />
            <span>{copy("contact.instagramLabel", "Instagram")}</span>
            <small>{copy("contact.instagramHandle", "@delicious_grape_leaves94")}</small>
          </a>
          <button onClick={() => window.open(tiktokUrl, "_blank", "noopener,noreferrer")}>
            <Music2 />
            <span>{copy("contact.tiktokLabel", "TikTok")}</span>
            <small>{copy("contact.tiktokHint", "@delicious_grape_leaves")}</small>
          </button>
          <button onClick={openInquiry}>
            <MessageCircle />
            <span>{copy("contact.whatsappLabel", "WhatsApp")}</span>
            <small>{copy("contact.whatsappHint", "للاستفسارات والتواصل مباشرة")}</small>
          </button>
        </div>
      </section>

      <footer className="cairo-v2__footer">
        <img src={brandLogo} alt="ورق العنب اللذيذ — القاهرة" />
        <p>{copy("footer.description", "من مطبخنا لبيتك في القاهرة.")}</p>
        <button onClick={openInquiry}>{copy("footer.order", "واتساب الطلبات")}</button>
      </footer>

      {itemCount > 0 && (
        <button className="cairo-v2__mobile-cart" onClick={() => scrollToSection("order")}>
          <span><ShoppingBag size={18} /> {itemCount}</span>
          <strong>{total} ج.م</strong>
        </button>
      )}
    </main>
  );
}
