import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Clock, Truck, RefreshCcw, ShieldCheck, Package, HelpCircle, MapPin, Headphones } from 'lucide-react';
import styles from './CustomerCarePage.module.css';

const contactCards = [
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 98765 43210',
    hint: 'Mon–Sat, 9 AM – 9 PM IST',
  },
  {
    icon: Mail,
    title: 'Email Us',
    value: 'care@shopnest.com',
    hint: 'We reply within 24 hours',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '+91 98765 43210',
    hint: 'Chat with us instantly',
  },
  {
    icon: Clock,
    title: 'Support Hours',
    value: '9 AM – 9 PM IST',
    hint: 'Mon–Sat (Sun: 10 AM – 6 PM)',
  },
];

const policyCards = [
  {
    icon: RefreshCcw,
    title: '7-Day Easy Returns',
    description:
      'Changed your mind? No worries. You can raise a return request within 7 days of delivery for a full refund, no questions asked on eligible items.',
  },
  {
    icon: Truck,
    title: 'Free & Fast Shipping',
    description:
      'Free standard shipping on all orders above ₹999. Most orders are delivered within 3–5 business days across India.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Guarantee',
    description:
      'Every product is quality checked before dispatch. If you receive a damaged or defective item, we replace it free of cost.',
  },
  {
    icon: Package,
    title: 'Cash on Delivery',
    description:
      'Prefer to pay at your doorstep? We support Cash on Delivery (COD) on all orders with a nominal convenience fee.',
  },
];

const faqs = [
  {
    q: 'How do I track my order?',
    a: 'Once your order ships, you will receive an email and SMS with a tracking link. You can also track it anytime from the "My Orders" section of your account.',
  },
  {
    q: 'What is your return policy?',
    a: 'You have 7 days from the date of delivery to raise a return request. Items must be unused, unworn, and in their original packaging with all tags attached.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3–5 business days. Prepaid orders above ₹999 ship free. Delivery may take longer in remote locations.',
  },
  {
    q: 'How do I get a refund?',
    a: 'Refunds are processed within 3–5 business days after we receive and verify your returned item. The amount is credited back to your original payment method.',
  },
  {
    q: 'What if I receive a damaged product?',
    a: 'We are sorry for the trouble. Contact our support team within 48 hours of delivery with a photo of the damaged item, and we will arrange a free replacement or refund immediately.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Yes, you can cancel an order for free as long as it has not been shipped. Once shipped, you can refuse delivery or raise a return after it arrives.',
  },
];

function CustomerCarePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Headphones size={44} className={styles.heroIcon} />
        <h1 className={styles.title}>Customer Care</h1>
        <p className={styles.subtitle}>
          We are here to help. Reach out anytime — our support team is just a call or message away.
        </p>
      </section>

      <section className={styles.contacts}>
        {contactCards.map((c) => (
          <div className={styles.contactCard} key={c.title}>
            <c.icon size={26} className={styles.contactIcon} />
            <h3 className={styles.contactTitle}>{c.title}</h3>
            <p className={styles.contactValue}>{c.value}</p>
            <p className={styles.contactHint}>{c.hint}</p>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Policies</h2>
        <div className={styles.policyGrid}>
          {policyCards.map((p) => (
            <div className={styles.policyCard} key={p.title}>
              <p.icon size={28} className={styles.policyIcon} />
              <h3 className={styles.policyCardTitle}>{p.title}</h3>
              <p className={styles.policyDesc}>{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqs.map((f) => (
            <details className={styles.faq} key={f.q}>
              <summary className={styles.faqQ}>
                <HelpCircle size={18} className={styles.faqIcon} />
                {f.q}
              </summary>
              <p className={styles.faqA}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Visit Us</h2>
        <div className={styles.visitCard}>
          <MapPin size={24} className={styles.visitIcon} />
          <div>
            <p className={styles.visitText}>
              ShopNest Customer Care Center
              <br />
              4th Floor, Tech Park One, Indiranagar,
              <br />
              Bengaluru, Karnataka 560038
            </p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Still have questions?</h2>
        <p className={styles.ctaText}>
          Browse our products or get in touch with us directly and we will get back to you shortly.
        </p>
        <div className={styles.ctaBtns}>
          <Link to="/products" className={styles.primaryBtn}>Browse Products</Link>
          <a href="mailto:care@shopnest.com" className={styles.secondaryBtn}>Email Us</a>
        </div>
      </section>
    </div>
  );
}

export default CustomerCarePage;
