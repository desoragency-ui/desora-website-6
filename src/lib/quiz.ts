import type { Locale } from '../i18n/config';

/**
 * The project brief quiz.
 *
 * One trilingual source of truth for every question, option and helper line, so
 * FR, EN and AR cannot drift apart and a new question is added in one place.
 *
 * Shape of the thing: thirteen short steps, most of them a single tap. The
 * target is four to five minutes on a phone, which is the real constraint. Two
 * consequences follow from that and explain most of the decisions below:
 *  - open text boxes are rationed to the four answers that genuinely cannot be
 *    multiple choice (what they sell, their best seller, their site, anything
 *    we missed),
 *  - budget sits at step 11 rather than step 2. Opening on money reads as an
 *    interrogation; by the time someone has described their business and picked
 *    a look, they are invested enough to answer it.
 *
 * Uploads are deliberately optional everywhere. On a Moroccan phone over 4G a
 * required 8MB logo upload is where the form gets abandoned, so every file
 * question carries a "send it on WhatsApp later" escape.
 */

export type QuestionType =
  | 'text'
  | 'textarea'
  | 'tel'
  | 'single'
  | 'multi'
  | 'yesno'
  | 'file';

/** A visual sample rendered in CSS rather than a screenshot: no assets to ship,
 *  no photography to licence, and it restyles itself with the brand tokens. */
export type PreviewKind =
  | 'lux'
  | 'bold'
  | 'min'
  | 'swatch-dark'
  | 'swatch-light'
  | 'swatch-warm'
  | 'swatch-bold'
  | 'ab-photo'
  | 'ab-type';

export interface QuizOption {
  value: string;
  /** Basename of a reference screenshot in src/assets/quiz. A real design a
   *  client can point at beats a word like "premium", which means something
   *  different to every person who reads it. */
  image?: string;
  label: Record<Locale, string>;
  hint?: Record<Locale, string>;
  preview?: PreviewKind;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: Record<Locale, string>;
  help?: Record<Locale, string>;
  placeholder?: Record<Locale, string>;
  options?: QuizOption[];
  required?: boolean;
  /** Render only when another answer matches. Keeps the path short for the
   *  people the follow-up does not apply to. */
  showIf?: { id: string; equals: string };
  accept?: string;
  multiple?: boolean;
  /** File questions: offer "I'll send it on WhatsApp" instead of uploading. */
  deferrable?: boolean;
}

export interface QuizStep {
  id: string;
  /** Section eyebrow, not a headline: the question itself is the headline. */
  title: Record<Locale, string>;
  questions: Question[];
}

const YES: Record<Locale, string> = { fr: 'Oui', en: 'Yes', ar: 'نعم' };
const NO: Record<Locale, string> = { fr: 'Non', en: 'No', ar: 'لا' };

export const quizSteps: QuizStep[] = [
  // 1 ---------------------------------------------------------------------
  {
    id: 'business',
    title: { fr: 'Votre activité', en: 'Your business', ar: 'نشاطك' },
    questions: [
      {
        id: 'business_name',
        type: 'text',
        required: true,
        label: {
          fr: 'Quel est le nom de votre entreprise ?',
          en: 'What is your business called?',
          ar: 'ما اسم شركتك؟',
        },
      },
      {
        id: 'what_you_sell',
        type: 'textarea',
        required: true,
        label: {
          fr: 'Que vendez-vous, en une phrase ?',
          en: 'What do you sell, in one sentence?',
          ar: 'ماذا تبيع، في جملة واحدة؟',
        },
        placeholder: {
          fr: 'Nous installons des panneaux solaires pour les villas à Marrakech',
          en: 'We install solar panels for villas in Marrakech',
          ar: 'نقوم بتركيب الألواح الشمسية للفيلات في مراكش',
        },
      },
    ],
  },

  // 2 ---------------------------------------------------------------------
  {
    id: 'type',
    title: { fr: 'Votre secteur', en: 'Your sector', ar: 'قطاعك' },
    questions: [
      {
        id: 'business_type',
        type: 'single',
        required: true,
        label: {
          fr: 'Qu’est-ce qui vous décrit le mieux ?',
          en: 'Which describes you best?',
          ar: 'ما الذي يصفك بشكل أفضل؟',
        },
        options: [
          { value: 'ecommerce', label: { fr: 'Boutique en ligne', en: 'Online shop', ar: 'متجر إلكتروني' } },
          { value: 'services_inbound', label: { fr: 'Services, les clients viennent à vous', en: 'Services, clients come to you', ar: 'خدمات، الزبناء يأتون إليك' } },
          { value: 'services_outbound', label: { fr: 'Services, vous vous déplacez', en: 'Services, you go to them', ar: 'خدمات، أنت تتنقل إليهم' } },
          { value: 'restaurant', label: { fr: 'Restaurant ou café', en: 'Restaurant or café', ar: 'مطعم أو مقهى' } },
          { value: 'clinic', label: { fr: 'Cabinet ou clinique', en: 'Clinic or practice', ar: 'عيادة أو مركز طبي' } },
          { value: 'realestate', label: { fr: 'Immobilier', en: 'Real estate', ar: 'عقارات' } },
          { value: 'other', label: { fr: 'Autre', en: 'Other', ar: 'أخرى' } },
        ],
      },
    ],
  },

  // 3 ---------------------------------------------------------------------
  {
    id: 'logo',
    title: { fr: 'Votre identité', en: 'Your identity', ar: 'هويتك' },
    questions: [
      {
        id: 'has_logo',
        type: 'yesno',
        required: true,
        label: {
          fr: 'Avez-vous un logo ?',
          en: 'Do you have a logo?',
          ar: 'هل لديك شعار؟',
        },
        options: [
          { value: 'yes', label: YES },
          { value: 'no', label: NO, hint: { fr: 'Nous pouvons en créer un', en: 'We can create one', ar: 'يمكننا تصميم واحد' } },
        ],
      },
      {
        id: 'logo_file',
        type: 'file',
        showIf: { id: 'has_logo', equals: 'yes' },
        deferrable: true,
        accept: '.png,.jpg,.jpeg,.svg,.pdf,.ai,.eps',
        label: {
          fr: 'Déposez votre logo ici',
          en: 'Drop your logo here',
          ar: 'أرفق شعارك هنا',
        },
        help: {
          fr: 'Le fichier d’origine si vous l’avez, sinon une image suffit.',
          en: 'The original file if you have it, otherwise an image is fine.',
          ar: 'الملف الأصلي إن توفّر، وإلا فصورة تكفي.',
        },
      },
    ],
  },

  // 4 ---------------------------------------------------------------------
  {
    id: 'colors',
    title: { fr: 'Vos couleurs', en: 'Your colours', ar: 'ألوانك' },
    questions: [
      {
        id: 'has_colors',
        type: 'single',
        required: true,
        label: {
          fr: 'Avez-vous des couleurs de marque ?',
          en: 'Do you have brand colours?',
          ar: 'هل لديك ألوان خاصة بعلامتك؟',
        },
        options: [
          { value: 'exact', label: { fr: 'Oui, j’ai les codes exacts', en: 'Yes, I have the exact codes', ar: 'نعم، لدي الرموز الدقيقة' } },
          { value: 'roughly', label: { fr: 'Oui, à peu près', en: 'Yes, roughly', ar: 'نعم، بشكل تقريبي' } },
          { value: 'choose', label: { fr: 'Non, choisissez pour moi', en: 'No, choose for me', ar: 'لا، اختاروا نيابة عني' } },
        ],
      },
      {
        id: 'color_codes',
        type: 'text',
        showIf: { id: 'has_colors', equals: 'exact' },
        label: { fr: 'Lesquelles ?', en: 'Which ones?', ar: 'ما هي؟' },
        placeholder: { fr: '#710014, #B38F6F', en: '#710014, #B38F6F', ar: '#710014, #B38F6F' },
      },
    ],
  },

  // 5 ---------------------------------------------------------------------
  {
    id: 'feel',
    title: { fr: 'Le style', en: 'The style', ar: 'الأسلوب' },
    questions: [
      {
        id: 'feel',
        type: 'single',
        required: true,
        label: {
          fr: 'Quelle impression doit donner votre site ?',
          en: 'How should your website feel?',
          ar: 'ما الانطباع الذي يجب أن يتركه موقعك؟',
        },
        help: {
          fr: 'Fiez-vous à votre première réaction.',
          en: 'Go with your first reaction.',
          ar: 'اعتمد على انطباعك الأول.',
        },
        options: [
          { value: 'premium', image: 'feel-premium', label: { fr: 'Premium et luxueux', en: 'Premium & luxury', ar: 'راقٍ وفاخر' } },
          { value: 'modern', image: 'feel-modern', label: { fr: 'Moderne et affirmé', en: 'Modern & bold', ar: 'عصري وجريء' } },
          { value: 'minimal', image: 'feel-minimal', label: { fr: 'Épuré et minimal', en: 'Clean & minimal', ar: 'بسيط وأنيق' } },
        ],
      },
    ],
  },

  // 6 ---------------------------------------------------------------------
  {
    id: 'mood',
    title: { fr: 'L’ambiance', en: 'The mood', ar: 'الأجواء' },
    questions: [
      {
        id: 'mood',
        type: 'single',
        required: true,
        label: {
          fr: 'Quelle ambiance de couleurs préférez-vous ?',
          en: 'Which colour mood do you prefer?',
          ar: 'أي أجواء لونية تفضّل؟',
        },
        options: [
          { value: 'dark', preview: 'swatch-dark', label: { fr: 'Sombre et élégant', en: 'Dark & elegant', ar: 'داكن وأنيق' } },
          { value: 'light', preview: 'swatch-light', label: { fr: 'Clair et aéré', en: 'Light & airy', ar: 'فاتح ومنساب' } },
          { value: 'warm', preview: 'swatch-warm', label: { fr: 'Chaleureux et naturel', en: 'Warm & earthy', ar: 'دافئ وطبيعي' } },
          { value: 'bold', preview: 'swatch-bold', label: { fr: 'Coloré et affirmé', en: 'Bold & colourful', ar: 'ملوّن وجريء' } },
        ],
      },
    ],
  },

  // 7 ---------------------------------------------------------------------
  {
    id: 'ab',
    title: { fr: 'Votre préférence', en: 'Your preference', ar: 'تفضيلك' },
    questions: [
      {
        id: 'photo_or_type',
        type: 'single',
        required: true,
        label: {
          fr: 'Que préférez-vous ?',
          en: 'Which do you prefer?',
          ar: 'أيّهما تفضّل؟',
        },
        options: [
          { value: 'photo', preview: 'ab-photo', label: { fr: 'De grandes photos', en: 'Big photography', ar: 'صور كبيرة' } },
          { value: 'type', preview: 'ab-type', label: { fr: 'De grands titres', en: 'Big typography', ar: 'عناوين كبيرة' } },
        ],
      },
    ],
  },

  // 8 ---------------------------------------------------------------------
  {
    id: 'offer',
    title: { fr: 'Votre offre', en: 'Your offer', ar: 'عرضك' },
    questions: [
      {
        id: 'best_seller',
        type: 'textarea',
        required: true,
        label: {
          fr: 'Qu’est-ce qui vous rapporte le plus ?',
          en: 'What is the most profitable thing you sell?',
          ar: 'ما هو المنتج أو الخدمة الأكثر ربحية لديك؟',
        },
        help: {
          fr: 'C’est ce qui occupera le haut de votre page d’accueil.',
          en: 'This is what will lead your homepage.',
          ar: 'هذا ما سيتصدّر صفحتك الرئيسية.',
        },
      },
      {
        id: 'find_you',
        type: 'multi',
        required: true,
        label: {
          fr: 'Comment vos clients vous trouvent-ils aujourd’hui ?',
          en: 'How do customers find you today?',
          ar: 'كيف يجدك زبناؤك حاليًا؟',
        },
        help: {
          fr: 'Plusieurs réponses possibles.',
          en: 'Select all that apply.',
          ar: 'يمكن اختيار أكثر من إجابة.',
        },
        options: [
          { value: 'instagram', label: { fr: 'Instagram', en: 'Instagram', ar: 'إنستغرام' } },
          { value: 'facebook', label: { fr: 'Facebook', en: 'Facebook', ar: 'فيسبوك' } },
          { value: 'whatsapp', label: { fr: 'WhatsApp', en: 'WhatsApp', ar: 'واتساب' } },
          { value: 'google', label: { fr: 'Recherche Google', en: 'Google search', ar: 'بحث غوغل' } },
          { value: 'tiktok', label: { fr: 'TikTok', en: 'TikTok', ar: 'تيك توك' } },
          { value: 'word_of_mouth', label: { fr: 'Bouche à oreille', en: 'Word of mouth', ar: 'التوصية الشفهية' } },
          { value: 'walkin', label: { fr: 'Passage en boutique', en: 'Walk-in', ar: 'الزيارة المباشرة' } },
        ],
      },
    ],
  },

  // 9 ---------------------------------------------------------------------
  {
    id: 'contact',
    title: { fr: 'Être contacté', en: 'Getting contacted', ar: 'وسائل التواصل' },
    questions: [
      {
        id: 'contact_methods',
        type: 'multi',
        required: true,
        label: {
          fr: 'Comment vos clients doivent-ils vous contacter ?',
          en: 'How should customers contact you?',
          ar: 'كيف يجب أن يتواصل معك الزبناء؟',
        },
        help: {
          fr: 'Plusieurs réponses possibles.',
          en: 'Select all that apply.',
          ar: 'يمكن اختيار أكثر من إجابة.',
        },
        options: [
          { value: 'whatsapp', label: { fr: 'WhatsApp', en: 'WhatsApp', ar: 'واتساب' } },
          { value: 'phone', label: { fr: 'Appel téléphonique', en: 'Phone call', ar: 'مكالمة هاتفية' } },
          { value: 'form', label: { fr: 'Formulaire de contact', en: 'Contact form', ar: 'استمارة تواصل' } },
          { value: 'email', label: { fr: 'E-mail', en: 'Email', ar: 'البريد الإلكتروني' } },
          { value: 'instagram_dm', label: { fr: 'Message Instagram', en: 'Instagram DM', ar: 'رسالة إنستغرام' } },
          { value: 'booking', label: { fr: 'Prise de rendez-vous en ligne', en: 'Online booking', ar: 'حجز موعد عبر الإنترنت' } },
        ],
      },
      {
        id: 'form_fields',
        type: 'multi',
        showIf: { id: 'contact_methods', equals: 'form' },
        label: {
          fr: 'Que doit demander le formulaire ?',
          en: 'What should the form ask for?',
          ar: 'ما الذي يجب أن تطلبه الاستمارة؟',
        },
        help: {
          fr: 'Chaque champ en plus fait perdre des demandes. Gardez l’essentiel.',
          en: 'Every extra field costs you enquiries. Keep only what you use.',
          ar: 'كل حقل إضافي يُفقدك طلبات. اكتفِ بما تحتاجه فعلاً.',
        },
        options: [
          { value: 'first_name', label: { fr: 'Prénom', en: 'First name', ar: 'الاسم الشخصي' } },
          { value: 'last_name', label: { fr: 'Nom', en: 'Last name', ar: 'الاسم العائلي' } },
          { value: 'phone', label: { fr: 'Téléphone', en: 'Phone', ar: 'الهاتف' } },
          { value: 'email', label: { fr: 'E-mail', en: 'Email', ar: 'البريد الإلكتروني' } },
          { value: 'city', label: { fr: 'Ville', en: 'City', ar: 'المدينة' } },
          { value: 'service', label: { fr: 'Service souhaité', en: 'Service wanted', ar: 'الخدمة المطلوبة' } },
          { value: 'budget', label: { fr: 'Budget', en: 'Budget', ar: 'الميزانية' } },
          { value: 'date', label: { fr: 'Date souhaitée', en: 'Preferred date', ar: 'التاريخ المفضل' } },
          { value: 'message', label: { fr: 'Message libre', en: 'Message', ar: 'رسالة حرة' } },
        ],
      },
    ],
  },

  // 10 --------------------------------------------------------------------
  {
    id: 'pages',
    title: { fr: 'Le contenu', en: 'The content', ar: 'المحتوى' },
    questions: [
      {
        id: 'pages',
        type: 'multi',
        required: true,
        label: {
          fr: 'De quelles pages avez-vous besoin ?',
          en: 'Which pages do you need?',
          ar: 'ما الصفحات التي تحتاجها؟',
        },
        options: [
          { value: 'home', label: { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' } },
          { value: 'about', label: { fr: 'À propos', en: 'About', ar: 'من نحن' } },
          { value: 'services', label: { fr: 'Services', en: 'Services', ar: 'الخدمات' } },
          { value: 'catalog', label: { fr: 'Catalogue produits', en: 'Product catalogue', ar: 'كتالوج المنتجات' } },
          { value: 'gallery', label: { fr: 'Galerie ou réalisations', en: 'Gallery or portfolio', ar: 'معرض الأعمال' } },
          { value: 'pricing', label: { fr: 'Tarifs', en: 'Pricing', ar: 'الأسعار' } },
          { value: 'contact', label: { fr: 'Contact', en: 'Contact', ar: 'اتصل بنا' } },
          { value: 'faq', label: { fr: 'Questions fréquentes', en: 'FAQ', ar: 'الأسئلة الشائعة' } },
          { value: 'blog', label: { fr: 'Blog', en: 'Blog', ar: 'مدونة' } },
        ],
      },
      {
        id: 'photos',
        type: 'file',
        multiple: true,
        deferrable: true,
        accept: 'image/*',
        label: {
          fr: 'Avez-vous des photos de votre travail ?',
          en: 'Do you have photos of your work?',
          ar: 'هل لديك صور لأعمالك؟',
        },
        help: {
          fr: 'Facultatif. Vous pouvez aussi nous les envoyer sur WhatsApp.',
          en: 'Optional. You can also send them on WhatsApp.',
          ar: 'اختياري. يمكنك أيضًا إرسالها عبر واتساب.',
        },
      },
    ],
  },

  // 11 --------------------------------------------------------------------
  {
    id: 'languages',
    title: { fr: 'Les langues', en: 'Languages', ar: 'اللغات' },
    questions: [
      {
        id: 'languages',
        type: 'multi',
        required: true,
        label: {
          fr: 'En quelles langues votre site doit-il exister ?',
          en: 'Which languages should your site be in?',
          ar: 'بأي لغات يجب أن يكون موقعك؟',
        },
        options: [
          { value: 'fr', label: { fr: 'Français', en: 'French', ar: 'الفرنسية' } },
          { value: 'ar', label: { fr: 'Arabe', en: 'Arabic', ar: 'العربية' } },
          { value: 'en', label: { fr: 'Anglais', en: 'English', ar: 'الإنجليزية' } },
        ],
      },
      {
        id: 'default_language',
        type: 'single',
        label: {
          fr: 'Laquelle doit s’ouvrir en premier ?',
          en: 'Which one should open first?',
          ar: 'أي واحدة يجب أن تُفتح أولاً؟',
        },
        options: [
          { value: 'fr', label: { fr: 'Français', en: 'French', ar: 'الفرنسية' } },
          { value: 'ar', label: { fr: 'Arabe', en: 'Arabic', ar: 'العربية' } },
          { value: 'en', label: { fr: 'Anglais', en: 'English', ar: 'الإنجليزية' } },
          { value: 'auto', label: { fr: 'Selon la langue du visiteur', en: 'Match the visitor’s language', ar: 'حسب لغة الزائر' } },
        ],
      },
    ],
  },

  // 12 --------------------------------------------------------------------
  {
    id: 'existing',
    title: { fr: 'L’existant', en: 'What exists', ar: 'الوضع الحالي' },
    questions: [
      {
        id: 'had_site',
        type: 'yesno',
        required: true,
        label: {
          fr: 'Avez-vous déjà eu un site web ?',
          en: 'Have you had a website before?',
          ar: 'هل سبق أن كان لديك موقع إلكتروني؟',
        },
        options: [
          { value: 'yes', label: YES },
          { value: 'no', label: NO },
        ],
      },
      {
        id: 'old_site_url',
        type: 'text',
        showIf: { id: 'had_site', equals: 'yes' },
        label: { fr: 'Son adresse ?', en: 'Its address?', ar: 'ما عنوانه؟' },
        placeholder: { fr: 'www.exemple.ma', en: 'www.example.ma', ar: 'www.example.ma' },
      },
      {
        id: 'old_site_dislike',
        type: 'textarea',
        showIf: { id: 'had_site', equals: 'yes' },
        label: {
          fr: 'Qu’est-ce qui ne vous plaisait pas ?',
          en: 'What did you not like about it?',
          ar: 'ما الذي لم يعجبك فيه؟',
        },
      },
      {
        id: 'domain',
        type: 'single',
        required: true,
        label: {
          fr: 'Possédez-vous un nom de domaine ?',
          en: 'Do you own a domain name?',
          ar: 'هل تملك اسم نطاق؟',
        },
        options: [
          { value: 'yes_access', label: { fr: 'Oui, et j’ai les accès', en: 'Yes, and I have the login', ar: 'نعم، ولدي بيانات الدخول' } },
          { value: 'yes_no_access', label: { fr: 'Oui, mais quelqu’un d’autre le gère', en: 'Yes, but someone else manages it', ar: 'نعم، لكن يديره شخص آخر' } },
          { value: 'no', label: { fr: 'Non, j’en ai besoin', en: 'No, I need one', ar: 'لا، أحتاج إلى واحد' } },
        ],
      },
    ],
  },

  // 13 --------------------------------------------------------------------
  {
    id: 'practical',
    title: { fr: 'Le cadre', en: 'The practicals', ar: 'الإطار العملي' },
    questions: [
      {
        id: 'budget',
        type: 'single',
        required: true,
        label: {
          fr: 'Quel budget avez-vous en tête ?',
          en: 'What budget do you have in mind?',
          ar: 'ما الميزانية التي تفكر فيها؟',
        },
        options: [
          { value: '3000', label: { fr: '3 000 DH et plus', en: 'From 3,000 DH', ar: 'ابتداءً من 3.000 درهم' } },
          { value: '6000', label: { fr: '6 000 DH et plus', en: 'From 6,000 DH', ar: 'ابتداءً من 6.000 درهم' } },
          { value: '10000', label: { fr: '10 000 DH et plus', en: 'From 10,000 DH', ar: 'ابتداءً من 10.000 درهم' } },
          { value: 'unsure', label: { fr: 'Je ne sais pas encore', en: 'Not sure yet', ar: 'لست متأكدًا بعد' } },
        ],
      },
      {
        id: 'timeline',
        type: 'single',
        required: true,
        label: {
          fr: 'Pour quand ?',
          en: 'When do you need it live?',
          ar: 'متى تريده جاهزًا؟',
        },
        options: [
          { value: 'week', label: { fr: 'Cette semaine', en: 'This week', ar: 'هذا الأسبوع' } },
          { value: '2_3_weeks', label: { fr: 'Deux à trois semaines', en: '2 to 3 weeks', ar: 'أسبوعان إلى ثلاثة' } },
          { value: 'month', label: { fr: 'Un mois', en: 'A month', ar: 'شهر واحد' } },
          { value: 'no_rush', label: { fr: 'Rien ne presse', en: 'No rush', ar: 'لا استعجال' } },
        ],
      },
    ],
  },

  // 14 --------------------------------------------------------------------
  {
    id: 'close',
    title: { fr: 'Pour finir', en: 'Last thing', ar: 'أخيرًا' },
    questions: [
      {
        id: 'anything_else',
        type: 'textarea',
        label: {
          fr: 'Autre chose que vous aimeriez sur votre site ?',
          en: 'Anything else you want on your website?',
          ar: 'أي شيء آخر تودّ إضافته إلى موقعك؟',
        },
        help: { fr: 'Facultatif.', en: 'Optional.', ar: 'اختياري.' },
      },
      {
        id: 'phone',
        type: 'tel',
        required: true,
        label: {
          fr: 'Votre numéro WhatsApp',
          en: 'Your WhatsApp number',
          ar: 'رقم واتساب الخاص بك',
        },
        placeholder: { fr: '06 12 34 56 78', en: '06 12 34 56 78', ar: '06 12 34 56 78' },
        help: {
          fr: 'Pour vous envoyer la maquette dès qu’elle est prête.',
          en: 'So we can send you the mockup as soon as it is ready.',
          ar: 'لنرسل لك النموذج بمجرد أن يصبح جاهزًا.',
        },
      },
    ],
  },
];

/** Column order in the spreadsheet. Answers are written by this list, so a new
 *  question appears as a new column without disturbing the existing ones. */
export const sheetColumns: { id: string; header: Record<Locale, string> }[] = [
  { id: 'submitted_at', header: { fr: 'Date', en: 'Date', ar: 'التاريخ' } },
  { id: 'quiz_language', header: { fr: 'Langue du questionnaire', en: 'Quiz language', ar: 'لغة الاستبيان' } },
  ...quizSteps.flatMap((s) =>
    s.questions.map((q) => ({ id: q.id, header: q.label }))
  ),
  { id: 'files', header: { fr: 'Fichiers', en: 'Files', ar: 'الملفات' } },
];

export const quizUi = {
  eyebrow: { fr: 'Brief projet', en: 'Project brief', ar: 'موجز المشروع' },
  title: {
    fr: 'Parlez-nous de votre projet',
    en: 'Tell us about your project',
    ar: 'حدّثنا عن مشروعك',
  },
  intro: {
    fr: 'Quatre minutes, quelques questions simples. À la fin, nous aurons tout ce qu’il faut pour vous préparer une maquette sur mesure.',
    en: 'Four minutes, a few simple questions. At the end we will have everything we need to prepare a mockup made for you.',
    ar: 'أربع دقائق وبعض الأسئلة البسيطة. في النهاية سيكون لدينا كل ما يلزم لإعداد نموذج مصمّم خصيصًا لك.',
  },
  start: { fr: 'Commencer', en: 'Start', ar: 'ابدأ' },
  next: { fr: 'Suivant', en: 'Next', ar: 'التالي' },
  back: { fr: 'Retour', en: 'Back', ar: 'رجوع' },
  submit: { fr: 'Envoyer', en: 'Send', ar: 'إرسال' },
  sending: { fr: 'Envoi en cours', en: 'Sending', ar: 'جارٍ الإرسال' },
  step: { fr: 'Étape', en: 'Step', ar: 'الخطوة' },
  of: { fr: 'sur', en: 'of', ar: 'من' },
  required: { fr: 'Cette réponse est nécessaire pour continuer.', en: 'This answer is needed to continue.', ar: 'هذه الإجابة ضرورية للمتابعة.' },
  chooseFile: { fr: 'Choisir un fichier', en: 'Choose a file', ar: 'اختر ملفًا' },
  dropHere: { fr: 'ou glissez-le ici', en: 'or drop it here', ar: 'أو أفلته هنا' },
  deferLabel: { fr: 'Je l’enverrai sur WhatsApp', en: 'I will send it on WhatsApp', ar: 'سأرسله عبر واتساب' },
  remove: { fr: 'Retirer', en: 'Remove', ar: 'إزالة' },
  tooLarge: { fr: 'Fichier trop lourd, 8 Mo maximum.', en: 'File too large, 8MB maximum.', ar: 'الملف كبير جدًا، الحد الأقصى 8 ميغابايت.' },
  doneTitle: { fr: 'C’est envoyé, merci', en: 'Sent, thank you', ar: 'تم الإرسال، شكرًا لك' },
  doneBody: {
    fr: 'Nous revenons vers vous sur WhatsApp sous 24 heures avec une première maquette.',
    en: 'We will come back to you on WhatsApp within 24 hours with a first mockup.',
    ar: 'سنعود إليك عبر واتساب خلال 24 ساعة مع نموذج أولي.',
  },
  doneCta: { fr: 'Retour à l’accueil', en: 'Back to home', ar: 'العودة إلى الرئيسية' },
  errorTitle: { fr: 'L’envoi n’a pas abouti', en: 'That did not send', ar: 'لم يتم الإرسال' },
  errorBody: {
    fr: 'Réessayez, ou écrivez-nous directement sur WhatsApp, vos réponses ne seront pas perdues.',
    en: 'Try again, or write to us directly on WhatsApp. Your answers are not lost.',
    ar: 'حاول مرة أخرى، أو راسلنا مباشرة عبر واتساب. إجاباتك لم تُفقد.',
  },
  retry: { fr: 'Réessayer', en: 'Try again', ar: 'أعد المحاولة' },
} as const;
