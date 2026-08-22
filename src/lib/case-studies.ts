import type { Locale } from '../i18n/config';

/**
 * Full case studies for the three projects DESORA delivered directly.
 *
 * TRUST POLICY (see CLAUDE.md). Every number below is either
 *  - delivered scope that can be counted on the client's own live site
 *    (sections, projects published, languages shipped), or
 *  - the Fastway audience figures, which the agency owner supplied and
 *    approved for publication (21 000 -> 37 000 followers in 4 months) plus
 *    values derived arithmetically from them.
 * No traffic, lead, booking, or revenue outcome is claimed for Wolcons or
 * Centre Dentaire Messnana, because none was measured and handed to us.
 *
 * Structured data rather than a content collection: these entries carry no
 * prose body, only fields, so a collection would add a schema and nine
 * near-empty markdown files without buying anything.
 */

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  sector: string;
  summary: string;
  challenge: string;
  approach: string;
  metrics: CaseMetric[];
  deliverables: string[];
  serviceSlug: string;
}

export const caseStudies: Record<Locale, CaseStudy[]> = {
  fr: [
    {
      slug: 'fastway',
      client: 'Fastway',
      sector: 'Conseil en études à l\'étranger, Rabat',
      summary: 'En quatre mois de création de contenu pilotée par DESORA, l\'audience Instagram de Fastway est passée de 21 000 à 37 000 abonnés, soit +76%.',
      challenge: 'Partir étudier en Chine, en Espagne ou en France est une décision prise à deux, l\'étudiant et ses parents, sur plusieurs mois. Fastway avait déjà 21 000 abonnés et une offre complète, orientation, bourses, admission, accompagnement, mais cette offre ne se lisait nulle part dans le feed : chaque question repartait en message privé, une par une, et l\'audience ne grandissait plus d\'elle-même. Le blocage n\'était pas la crédibilité du cabinet, c\'était l\'absence d\'un système de contenu capable de répondre publiquement et de tourner toutes les semaines.',
      approach: 'DESORA a remis la ligne éditoriale sur les quatre piliers de l\'offre, orientation, bourses, admission, accompagnement, puis découpé chaque pilier destination par destination : Chine, Espagne, France. Le mix de formats a été construit autour du reel vertical, accroche en darija ou en arabe dès la première seconde et sous-titres lisibles sans le son, complété par des carrousels de procédure faits pour être enregistrés et renvoyés à ses parents. Les questions reçues en message privé sont devenues la matière première du calendrier : ce qu\'un abonné demandait en privé, le compte y répondait publiquement la semaine suivante. Les stories à la une ont été reconstruites en bibliothèque permanente, écoles supérieures, équipe, citations, pour qu\'un visiteur arrivé par un reel trouve immédiatement de quoi rester et suivre.',
      metrics: [
        {
          value: '37 000',
          label: 'abonnés Instagram, contre 21 000 au départ',
        },
        {
          value: '+76%',
          label: 'de croissance d\'audience en 4 mois',
        },
        {
          value: '+16 000',
          label: 'abonnés gagnés, près de 4 000 par mois',
        },
        {
          value: '3',
          label: 'destinations couvertes par la ligne éditoriale : Chine, Espagne, France',
        },
      ],
      deliverables: [
        'Ligne éditoriale construite sur les quatre piliers de l\'offre : orientation, bourses, admission, accompagnement',
        'Calendrier de publication mensuel, tenu semaine après semaine sur les quatre mois d\'accompagnement',
        'Formats récurrents en reels verticaux : accroche en darija et en arabe, sous-titres lisibles sans le son',
        'Contenus destination par destination pour la Chine, l\'Espagne et la France : coûts, dossiers, calendriers d\'admission',
        'Design de posts et de couvertures cohérent, reconnaissable dans un feed avant même de lire le nom du compte',
        'Bibliothèque de stories à la une : écoles supérieures, équipe, citations, pour que le profil réponde avant le message privé',
      ],
      serviceSlug: 'reseaux-sociaux',
    },
    {
      slug: 'wolcons',
      client: 'Wolcons',
      sector: 'Construction et aménagement tout corps d\'état, Casablanca',
      summary: 'Refonte du site Wolcons en une page : 9 sections, 13 réalisations chiffrées et un parcours de devis qui bascule sur WhatsApp, sans dépendance ni build.',
      challenge: 'Wolcons vend un contrat unique tout corps d\'état, mais son site présentait une liste de prestations sans méthode ni preuves. Sur ce marché, un maître d\'ouvrage ne compare pas des prestations, il compare une fiabilité : qui répond du budget, du planning et de la réception. Le blocage n\'était pas la notoriété, c\'était l\'absence d\'un support capable de porter cette démonstration et de transformer une visite en demande de devis.',
      approach: 'Nous avons reconstruit le site en une page unique, montée comme un argumentaire suivi : le vrai problème, la méthode en quatre étapes, les trois métiers, les preuves, les questions qui bloquent, le devis. Les couleurs ont été échantillonnées pixel par pixel sur le logo officiel au lieu d\'être approximées, associées à Outfit et Inter, avec angles nets, filets d\'un pixel et trames de plan pour tenir un registre architectural. Les 13 réalisations sont publiées avec lieu, surface, lots et budget, filtrables par mission, et les 8 marques fournisseurs défilent en bandeau de caution. Le formulaire de devis ouvre une conversation WhatsApp pré-remplie avec repli e-mail, canal le plus réactif au Maroc.',
      metrics: [
        {
          value: '9',
          label: 'sections livrées, du problème au devis',
        },
        {
          value: '13',
          label: 'réalisations chiffrées et filtrables',
        },
        {
          value: '6',
          label: 'questions traitées en FAQ',
        },
        {
          value: '0',
          label: 'dépendance externe, site 100 % statique',
        },
      ],
      deliverables: [
        'Site vitrine une page, 9 sections enchaînées en argumentaire : problème, méthode, métiers, réalisations, avis, partenaires, FAQ, devis',
        'Identité web dérivée du logo : couleurs échantillonnées pixel par pixel, Outfit et Inter, rayons de 2 px, filets d\'un pixel, trames de plan',
        'Portfolio de 13 réalisations avec lieu, surface, lots et budget, filtrable en 3 missions',
        'Parcours de conversion WhatsApp : formulaire de devis en 7 champs qui ouvre une conversation pré-remplie, repli e-mail, bouton flottant permanent',
        'Moteur d\'animation maison sur IntersectionObserver et une seule boucle rAF, entièrement neutralisé sous prefers-reduced-motion',
        'Socle technique sans dépendance ni build : images WebP dimensionnées, cibles tactiles de 44 px, focus clavier visible, title, description, canonical et Open Graph',
      ],
      serviceSlug: 'creation-site-web',
    },
    {
      slug: 'centre-dentaire-messnana',
      client: 'Centre Dentaire Messnana, Dr. Nafie Fadoua',
      sector: 'Cabinet dentaire, Tanger (Mesnana)',
      summary: 'Site trilingue FR, EN et AR livré pour un cabinet dentaire de Tanger : 26 actes filtrables, données structurées locales, rendez-vous par WhatsApp et téléphone.',
      challenge: 'Le cabinet existait en ligne à travers ses profils sociaux et sa fiche Google, sans page de référence qui lui appartienne. À Mesnana, les patients cherchent en arabe, en français et parfois en anglais, et un dentiste se choisit sur des détails concrets : quels actes sont pratiqués, quels horaires, comment obtenir un rendez-vous tout de suite. Il manquait un seul endroit qui réponde à ces questions dans la langue du patient et que les moteurs de recherche locaux puissent lire correctement.',
      approach: 'Nous avons construit le site à partir d\'une source de contenu unique déclinée en trois langues, dont une version arabe en RTL complet, pas une traduction posée sur une mise en page latine. Les 26 actes du cabinet ont été rédigés un par un, classés en 8 catégories filtrables, puis repris en données structurées avec l\'adresse, les coordonnées géographiques, les horaires, les langues parlées et les profils du cabinet. La prise de rendez-vous compose un message WhatsApp prérempli et double le numéro fixe du cabinet : rien à héberger côté serveur, rien à surveiller dans une boîte mail. Le comparateur avant/après est affiché comme simulation tant qu\'un cas patient réel avec accord écrit n\'est pas fourni, et aucune promesse de résultat n\'apparaît nulle part sur le site.',
      metrics: [
        {
          value: '26',
          label: 'actes détaillés, filtrables par 8 catégories',
        },
        {
          value: '3',
          label: 'langues livrées, dont l\'arabe en RTL complet',
        },
        {
          value: '8',
          label: 'questions fréquentes balisées en données structurées',
        },
        {
          value: '0',
          label: 'backend à maintenir, rendez-vous par WhatsApp et téléphone',
        },
      ],
      deliverables: [
        'Site trilingue FR, EN et AR, une page indexable par langue avec hreflang et x-default',
        '26 fiches d\'actes rédigées et classées en 8 catégories filtrables',
        '3 blocs de données structurées : cabinet dentaire, FAQ, site',
        'Prise de rendez-vous par WhatsApp prérempli et appel direct, sans serveur à maintenir',
        'Comparateur avant/après au doigt, au clavier et compatible RTL, signalé comme simulation',
        'Socle SEO et accessibilité : canonical, sitemap, robots, Open Graph, lien d\'évitement, focus visible, cibles tactiles ≥ 44 px, mouvement réduit respecté',
      ],
      serviceSlug: 'creation-site-web',
    },
  ],
  en: [
    {
      slug: 'fastway',
      client: 'Fastway',
      sector: 'Study abroad consultancy, Rabat',
      summary: 'Four months of DESORA-led content took Fastway\'s Instagram audience from 21,000 to 37,000 followers, a 76% gain.',
      challenge: 'Leaving to study in China, Spain or France is a decision made by two people, the student and the parents, over several months. Fastway already had 21,000 followers and a complete offer, guidance, scholarships, admissions, ongoing support, but none of it was readable in the feed: every question came back as a private message, one at a time, and the audience had stopped growing on its own. The bottleneck was never the firm\'s credibility, it was the absence of a content system able to answer publicly and keep turning every week.',
      approach: 'DESORA rebuilt the editorial line around the four pillars of the offer, guidance, scholarships, admissions and ongoing support, then split each pillar destination by destination: China, Spain, France. The format mix was built around the vertical reel, a hook in darija or Arabic inside the first second and captions that read with the sound off, backed by step-by-step carousels made to be saved and forwarded to a parent. Questions arriving in DMs became the raw material of the calendar: whatever a follower asked in private, the account answered publicly the following week. Story highlights were rebuilt as a permanent library, partner schools, team, quotes, so a visitor landing from a reel found enough to stay and follow.',
      metrics: [
        {
          value: '37,000',
          label: 'Instagram followers, up from 21,000 at the start',
        },
        {
          value: '+76%',
          label: 'audience growth in 4 months',
        },
        {
          value: '+16,000',
          label: 'followers gained, close to 4,000 a month',
        },
        {
          value: '3',
          label: 'destinations covered by the editorial line: China, Spain, France',
        },
      ],
      deliverables: [
        'Editorial line built on the four pillars of the offer: guidance, scholarships, admissions, ongoing support',
        'Monthly publishing calendar, held week after week across the four months of the engagement',
        'Recurring vertical reel formats: hook in darija and Arabic, captions readable with the sound off',
        'Destination-by-destination content for China, Spain and France: costs, application files, admission calendars',
        'Consistent post and cover design, recognisable in a feed before the account name is even read',
        'Story highlights library: partner schools, team, quotes, so the profile answers before the DM does',
      ],
      serviceSlug: 'reseaux-sociaux',
    },
    {
      slug: 'wolcons',
      client: 'Wolcons',
      sector: 'Construction and fit-out, all trades under one contract, Casablanca',
      summary: 'Wolcons rebuilt as a single page: 9 sections, 13 costed projects, and a quote flow that hands off to WhatsApp, with no dependencies and no build step.',
      challenge: 'Wolcons sells one contract covering every trade, but its site listed services with no method behind them and no proof. In this market a developer does not compare service lists, he compares reliability: who answers for the budget, the schedule, and the handover. The bottleneck was not name recognition, it was the absence of a site able to carry that demonstration and turn a visit into a quote request.',
      approach: 'We rebuilt the site as a single page structured like a continuous argument: the real problem, the method in four steps, the three trades, the proof, the questions that stall a decision, the quote. Colors were sampled pixel by pixel from the official logo instead of approximated, paired with Outfit and Inter, with sharp corners, one-pixel rules, and blueprint grids to hold an architectural register. The 13 projects are published with location, floor area, trade packages, and budget, filterable by mission, and the 8 supplier brands run in a credibility strip. The quote form opens a pre-filled WhatsApp conversation with an email fallback, the fastest-answering channel in Morocco.',
      metrics: [
        {
          value: '9',
          label: 'sections delivered, from problem to quote',
        },
        {
          value: '13',
          label: 'costed, filterable projects',
        },
        {
          value: '6',
          label: 'questions answered in the FAQ',
        },
        {
          value: '0',
          label: 'external dependencies, 100% static site',
        },
      ],
      deliverables: [
        'One-page site, 9 sections chained into a single argument: problem, method, trades, projects, reviews, partners, FAQ, quote',
        'Web identity derived from the logo: colors sampled pixel by pixel, Outfit and Inter, 2 px radii, one-pixel rules, blueprint grids',
        'Portfolio of 13 projects with location, floor area, trade packages, and budget, filterable across 3 missions',
        'WhatsApp conversion path: a 7-field quote form that opens a pre-filled conversation, email fallback, permanent floating button',
        'In-house animation engine built on IntersectionObserver and a single rAF loop, fully neutralized under prefers-reduced-motion',
        'Technical base with no dependencies and no build step: sized WebP images, 44 px tap targets, visible keyboard focus, title, description, canonical, and Open Graph',
      ],
      serviceSlug: 'creation-site-web',
    },
    {
      slug: 'centre-dentaire-messnana',
      client: 'Centre Dentaire Messnana, Dr. Nafie Fadoua',
      sector: 'Dental practice, Tangier (Mesnana)',
      summary: 'Trilingual site in French, English and Arabic delivered for a Tangier dental practice: 26 filterable treatments, local structured data, booking by WhatsApp and phone.',
      challenge: 'The practice existed online through its social profiles and its Google listing, with no reference page of its own. In Mesnana, patients search in Arabic, in French and sometimes in English, and a dentist gets chosen on concrete details: which treatments are performed, which hours, how to book an appointment right now. Nothing answered those questions in one place, in the patient\'s own language, in a form local search engines could read correctly.',
      approach: 'We built the site from a single content source published in three languages, including a fully RTL Arabic version rather than a translation dropped onto a Latin layout. The practice\'s 26 treatments were written one by one, sorted into 8 filterable categories, then carried into structured data alongside the address, the geographic coordinates, the opening hours, the languages spoken and the practice\'s profiles. Booking composes a prefilled WhatsApp message and pairs it with the practice\'s landline: nothing to host server-side, nothing to watch in an inbox. The before/after slider is flagged as a simulation until a real patient case with written consent is supplied, and no promise of results appears anywhere on the site.',
      metrics: [
        {
          value: '26',
          label: 'treatments detailed, filterable across 8 categories',
        },
        {
          value: '3',
          label: 'languages delivered, including fully RTL Arabic',
        },
        {
          value: '8',
          label: 'frequently asked questions marked up in structured data',
        },
        {
          value: '0',
          label: 'backend to maintain, booking by WhatsApp and phone',
        },
      ],
      deliverables: [
        'Trilingual site in French, English and Arabic, one indexable page per language with hreflang and x-default',
        '26 treatment entries written and sorted into 8 filterable categories',
        '3 structured data blocks: dental practice, FAQ, website',
        'Booking by prefilled WhatsApp and direct call, with no server to maintain',
        'Before/after slider on touch, on keyboard and RTL-compatible, flagged as a simulation',
        'SEO and accessibility foundation: canonical, sitemap, robots, Open Graph, skip link, visible focus, tap targets ≥ 44 px, reduced motion respected',
      ],
      serviceSlug: 'creation-site-web',
    },
  ],
  ar: [
    {
      slug: 'fastway',
      client: 'Fastway',
      sector: 'استشارات الدراسة بالخارج، الرباط',
      summary: 'في أربعة أشهر من إنشاء المحتوى بإشراف ديزورا، ارتفع جمهور Fastway على إنستغرام من 21 000 إلى 37 000 متابع، أي +76%.',
      challenge: 'قرار السفر للدراسة في الصين أو إسبانيا أو فرنسا يُتخذ بين طرفين، الطالب ووالداه، وعلى امتداد عدة أشهر. كان لدى Fastway 21 000 متابع وعرض كامل يشمل التوجيه والمنح والقبول والمواكبة، لكن هذا العرض لم يكن مقروءًا في الصفحة: كل سؤال يعود في رسالة خاصة، واحدًا تلو الآخر، والجمهور توقف عن النمو من تلقاء نفسه. العائق لم يكن مصداقية المكتب، بل غياب نظام محتوى يجيب علنًا ويدور كل أسبوع.',
      approach: 'أعادت ديزورا بناء الخط التحريري على الركائز الأربع للعرض: التوجيه، المنح، القبول، المواكبة، ثم قسّمت كل ركيزة حسب الوجهة: الصين، إسبانيا، فرنسا. بُني مزيج الصيغ حول الريل العمودي، بافتتاحية بالدارجة أو بالعربية من الثانية الأولى وترجمة نصية تُقرأ دون صوت، إلى جانب كاروسيلات تشرح إجراءات الملف، مصممة ليحفظها المتابع ويرسلها إلى والديه. صارت الأسئلة الواردة في الرسائل الخاصة هي المادة الأولى للتقويم: ما يسأل عنه متابع في الخاص، يجيب عنه الحساب علنًا في الأسبوع الموالي. وأُعيد بناء القصص المميزة كمكتبة دائمة تضم المدارس العليا والفريق واقتباسات، ليجد الزائر القادم من ريل ما يُبقيه على الحساب ويدفعه للمتابعة.',
      metrics: [
        {
          value: '37 000',
          label: 'متابع على إنستغرام، مقابل 21 000 في البداية',
        },
        {
          value: '+76%',
          label: 'نمو الجمهور في 4 أشهر',
        },
        {
          value: '+16 000',
          label: 'متابع جديد، قرابة 4 000 في الشهر',
        },
        {
          value: '3',
          label: 'وجهات يغطيها الخط التحريري: الصين، إسبانيا، فرنسا',
        },
      ],
      deliverables: [
        'خط تحريري مبني على الركائز الأربع للعرض: التوجيه، المنح، القبول، المواكبة',
        'تقويم نشر شهري، مُلتزَم به أسبوعًا بعد أسبوع طوال أشهر المواكبة الأربعة',
        'صيغ متكررة في ريلز عمودية: افتتاحية بالدارجة وبالعربية، وترجمة نصية تُقرأ دون صوت',
        'محتوى مخصص لكل وجهة، الصين وإسبانيا وفرنسا: التكاليف، الملفات، ومواعيد القبول',
        'تصميم منشورات وأغلفة متناسق، يُعرَف في القائمة قبل قراءة اسم الحساب',
        'مكتبة قصص مميزة: المدارس العليا، الفريق، اقتباسات، ليجيب الملف الشخصي قبل الرسالة الخاصة',
      ],
      serviceSlug: 'reseaux-sociaux',
    },
    {
      slug: 'wolcons',
      client: 'Wolcons',
      sector: 'البناء والتهيئة بجميع الأشغال، الدار البيضاء',
      summary: 'إعادة بناء موقع Wolcons في صفحة واحدة: 9 أقسام، 13 إنجازًا بأرقامه، ومسار طلب عرض سعر ينتهي على واتساب، دون أي مكتبة خارجية أو مرحلة بناء.',
      challenge: 'تبيع Wolcons عقدًا واحدًا يغطي جميع الأشغال، لكن موقعها كان يعرض لائحة خدمات بلا منهجية ولا أدلة. في هذا السوق، صاحب المشروع لا يقارن بين الخدمات، بل يقارن بين درجات الموثوقية: من يتحمّل مسؤولية الميزانية والآجال والتسلّم. لم يكن العائق في السمعة، بل في غياب سند قادر على تقديم هذا البرهان وتحويل الزيارة إلى طلب عرض سعر.',
      approach: 'أعدنا بناء الموقع في صفحة واحدة، مركّبة كحجّة متسلسلة: المشكل الحقيقي، المنهجية في أربع مراحل، المهن الثلاث، الأدلة، الأسئلة التي تعرقل القرار، ثم عرض السعر. أخذنا الألوان بكسلًا بكسل من الشعار الرسمي بدل تقديرها بالتقريب، وربطناها بخطي Outfit وInter، مع زوايا حادة وخطوط بسمك بكسل واحد وتشبيكات على هيئة مخططات هندسية تحفظ السجل المعماري. نُشرت الإنجازات الـ13 بالموقع والمساحة والحصص والميزانية، قابلة للتصفية حسب المهمة، بينما تمر 8 علامات مورّدة في شريط يعمل كضمانة. استمارة عرض السعر تفتح محادثة واتساب معبّأة مسبقًا مع بديل عبر البريد الإلكتروني، وهي القناة الأسرع تجاوبًا في المغرب.',
      metrics: [
        {
          value: '9',
          label: 'أقسام مُسلَّمة، من المشكل إلى عرض السعر',
        },
        {
          value: '13',
          label: 'إنجازًا بأرقامه، قابلة للتصفية',
        },
        {
          value: '6',
          label: 'أسئلة مُعالَجة في قسم الأسئلة الشائعة',
        },
        {
          value: '0',
          label: 'تبعية خارجية، موقع ثابت 100%',
        },
      ],
      deliverables: [
        'موقع تعريفي من صفحة واحدة، 9 أقسام متسلسلة كحجّة: المشكل، المنهجية، المهن، الإنجازات، الآراء، الشركاء، الأسئلة الشائعة، عرض السعر',
        'هوية رقمية مشتقة من الشعار: ألوان مأخوذة بكسلًا بكسل، خطا Outfit وInter، انحناءات بـ2 بكسل، خطوط بسمك بكسل واحد، وتشبيكات على هيئة مخططات',
        'معرض من 13 إنجازًا مع الموقع والمساحة والحصص والميزانية، قابل للتصفية حسب 3 مهام',
        'مسار تحويل عبر واتساب: استمارة عرض سعر من 7 حقول تفتح محادثة معبّأة مسبقًا، بديل عبر البريد الإلكتروني، وزر عائم دائم',
        'محرك حركات داخلي مبني على IntersectionObserver وحلقة rAF واحدة، معطَّل بالكامل تحت prefers-reduced-motion',
        'أساس تقني دون مكتبات خارجية ودون مرحلة بناء: صور WebP بأبعاد محددة، مساحات لمس بـ44 بكسل، إظهار واضح لمؤشر لوحة المفاتيح، ووسوم title وdescription وcanonical وOpen Graph',
      ],
      serviceSlug: 'creation-site-web',
    },
    {
      slug: 'centre-dentaire-messnana',
      client: 'Centre Dentaire Messnana، الدكتورة فدوى نافع',
      sector: 'عيادة أسنان، طنجة (مسنانة)',
      summary: 'موقع ثلاثي اللغات بالفرنسية والإنجليزية والعربية لعيادة أسنان بطنجة: 26 خدمة قابلة للتصفية، بيانات منظمة محلية، ومواعيد عبر واتساب والهاتف.',
      challenge: 'كانت العيادة حاضرة على الإنترنت عبر صفحاتها الاجتماعية وبطاقتها على غوغل، دون صفحة مرجعية تملكها بالكامل. في مسنانة، يبحث المرضى بالعربية وبالفرنسية وأحيانًا بالإنجليزية، ويُختار طبيب الأسنان بناءً على تفاصيل ملموسة: ما الخدمات المتوفرة، ما أوقات العمل، وكيف يُحجز موعد الآن. كان ينقص مكان واحد يجيب عن هذه الأسئلة بلغة المريض، ويقرأه محرك البحث المحلي قراءة صحيحة.',
      approach: 'بنينا الموقع انطلاقًا من مصدر محتوى واحد يُشتق منه ثلاث لغات، مع نسخة عربية بتخطيط كامل من اليمين إلى اليسار، لا ترجمة موضوعة فوق تصميم لاتيني. حُرِّرت خدمات العيادة الـ26 واحدة واحدة، ورُتّبت في 8 فئات قابلة للتصفية، ثم أُعيد تمريرها في بيانات منظمة تضم العنوان والإحداثيات الجغرافية وأوقات العمل واللغات المتحدَّث بها وحسابات العيادة. حجز الموعد يُنشئ رسالة واتساب معبأة مسبقًا، ويضاعفها برقم الهاتف الثابت للعيادة: لا شيء يُستضاف على الخادم، ولا شيء يُراقَب في صندوق بريد. أما مقارن قبل/بعد فيظهر بوصفه محاكاة ما دامت لم تُقدَّم حالة مريض حقيقية بموافقة مكتوبة، ولا يظهر أي وعد بنتيجة في أي موضع من الموقع.',
      metrics: [
        {
          value: '26',
          label: 'خدمة مفصّلة، قابلة للتصفية عبر 8 فئات',
        },
        {
          value: '3',
          label: 'لغات مسلَّمة، منها العربية بتخطيط كامل من اليمين إلى اليسار',
        },
        {
          value: '8',
          label: 'أسئلة شائعة موسومة في البيانات المنظمة',
        },
        {
          value: '0',
          label: 'واجهة خلفية تحتاج صيانة، المواعيد عبر واتساب والهاتف',
        },
      ],
      deliverables: [
        'موقع ثلاثي اللغات بالفرنسية والإنجليزية والعربية، صفحة قابلة للفهرسة لكل لغة مع hreflang وx-default',
        '26 بطاقة خدمة محرَّرة ومصنَّفة في 8 فئات قابلة للتصفية',
        '3 كتل بيانات منظمة: عيادة أسنان، أسئلة شائعة، موقع إلكتروني',
        'حجز المواعيد عبر رسالة واتساب معبأة مسبقًا واتصال هاتفي مباشر، دون خادم يحتاج صيانة',
        'مقارن قبل/بعد يعمل باللمس وبلوحة المفاتيح ومتوافق مع الاتجاه من اليمين إلى اليسار، مُعلَّم بوضوح كمحاكاة',
        'أساس لتحسين محركات البحث وإتاحة الوصول: canonical، خريطة الموقع، robots، Open Graph، رابط تخطي المحتوى، تركيز ظاهر، مساحات لمس بـ 44 بكسل على الأقل، واحترام تقليل الحركة',
      ],
      serviceSlug: 'creation-site-web',
    },
  ],
};

/** Ordered so the flagship (the one with a real measured outcome) leads. */
export function getCaseStudies(locale: Locale): CaseStudy[] {
  return caseStudies[locale] ?? caseStudies.fr;
}

export function getCaseStudy(locale: Locale, slug: string): CaseStudy | undefined {
  return getCaseStudies(locale).find((c) => c.slug === slug);
}

export const caseStudySlugs = caseStudies.fr.map((c) => c.slug);
