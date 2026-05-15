export type Lang = 'mk' | 'en';

export const LANGS: readonly Lang[] = ['mk', 'en'] as const;

const mk: Record<string, string> = {
  // Header
  'header.tagline': 'Систем за сообраќајна безбедност',
  'header.official': 'Официјален портал',
  'header.secureAddress': 'Безбедна адреса',
  'header.home': 'Почетна',

  // Hero
  'home.eyebrow': 'Проверка на сообраќаен прекршок',
  'home.title': 'Внесете го безбедносниот код од вашата SMS-порака',
  'home.subtitle':
    'Погледнете ги доказите за прекршокот целосно транспарентно и платете ја казната безбедно преку блокчејн — без линкови и без можност за измама.',
  'home.manualAccess': 'Пристапивте на оваа страница рачно. Тоа е безбедниот начин.',
  'home.trust.noLinks': 'Без линкови',
  'home.trust.evidence': 'Транспарентни докази',
  'home.trust.onchain': 'Плаќање на блокчејн',

  // Code input
  'code.label': 'Безбедносен код',
  'code.placeholder': 'SC-XXXXXXXXXXXX',
  'code.help': 'Внесете го кодот точно како што е наведен во вашата SMS-порака.',
  'code.check': 'Провери прекршок',
  'code.checking': 'Проверувам…',
  'code.error.empty': 'Внесете безбедносен код.',
  'code.error.format': 'Неправилен формат. Кодот изгледа вака: SC-8F3A2B91C7D4',
  'code.error.notFound':
    'Не е пронајден прекршок со овој код. Проверете го кодот од вашата SMS-порака.',
  'code.demo.title': 'Демо кодови за тестирање',
  'code.demo.hint': 'Кликнете на код за да го пополните полето.',

  // Phishing notice
  'phishing.badge': 'Безбедносно предупредување',
  'phishing.title': 'Заштитете се од фишинг измами',
  'phishing.lead': 'Измамници испраќаат лажни SMS-пораки во име на Safe City. Запаметете:',
  'phishing.p1': 'Никогаш не испраќаме линкови во SMS — испраќаме само безбедносен код.',
  'phishing.p2': 'Внесувајте кодови само на оваа официјална страница, до која пристапувате рачно.',
  'phishing.p3':
    'Никогаш не бараме број на платежна картичка, PIN или фраза за обнова на паричник (seed phrase).',
  'phishing.p4': 'Проверете дека адресата во прелистувачот е точна пред да внесете какви било податоци.',

  // How it works
  'how.title': 'Како функционира',
  'how.step': 'Чекор',
  'how.s1.title': 'Добивате SMS со код',
  'how.s1.body': 'Safe City испраќа само безбеден код — никогаш линк за кликање.',
  'how.s2.title': 'Рачно ја отворате оваа страница',
  'how.s2.body': 'Самите ја внесувате официјалната адреса и потоа го внесувате кодот.',
  'how.s3.title': 'Гледате докази и плаќате',
  'how.s3.body': 'Транспарентно ги гледате доказите и ја плаќате казната на блокчејн.',

  // SMS examples
  'sms.title': 'Препознајте легитимна порака',
  'sms.lead': 'Споредете ги двете пораки. Едната е безбедна, другата е обид за измама.',
  'sms.legit.tag': 'Легитимна порака',
  'sms.phish.tag': 'Обид за измама',
  'sms.legit.body':
    'Safe City MK: Детектиран е сообраќаен прекршок за вашето возило на 15.05.2026 во 18:42 часот.\n\nЛокација:\nПартизанска, Скопје\n\nОтворете ја официјалната Safe City веб-страница и внесете го безбедносниот код подолу за да ја погледнете казната и доказите.\n\nБезбедносен код:\nSC-8F3A2B91C7D4\n\nНе отворајте линкови од непознати испраќачи.',
  'sms.phish.body':
    'Safe City: ИТНО! Имате неплатена казна. Платете во рок од 24 часа за да избегнете судска постапка:\nhttp://safecity-mk.pay-online.info/casa\n\nКликнете на линкот веднаш.',
  'sms.legit.why': 'Содржи само код. Без линкови. Ве упатува самите да ја отворите страницата.',
  'sms.phish.why': 'Содржи сомнителен линк и итен, заканувачки тон. Никогаш не кликајте на ваков линк.',

  // Violation view
  'view.back': 'Назад на проверка',
  'view.title': 'Сообраќаен прекршок',
  'view.ref': 'Реф. бр.',
  'view.detailsTitle': 'Детали за прекршокот',
  'view.field.type': 'Вид на прекршок',
  'view.field.datetime': 'Датум и време',
  'view.field.location': 'Локација',
  'view.field.vehicle': 'Возило',
  'view.field.plate': 'Регистарска таблица',
  'view.field.camera': 'Сообраќајна камера',
  'view.field.speed': 'Измерена / дозволена брзина',
  'view.field.issued': 'Издадено',
  'view.field.due': 'Рок за плаќање',
  'view.amountDue': 'Износ за плаќање',

  // Status
  'status.unpaid': 'Неплатено',
  'status.paid': 'Платено',

  // Violation kinds
  'kind.speeding': 'Пречекорување на брзина',
  'kind.red_light': 'Поминување на црвено светло',
  'kind.bus_lane': 'Возење во лента за автобуси',
  'kind.no_parking': 'Непрописно паркирање',
  'kind.speeding.desc': 'Возилото е измерено како вози побрзо од дозволеното на овој пат.',
  'kind.red_light.desc':
    'Возилото поминало низ раскрсницата додека семафорот покажувал црвено светло.',
  'kind.bus_lane.desc': 'Возилото возело во лента наменета само за јавен превоз.',
  'kind.no_parking.desc': 'Возилото било паркирано на место каде што паркирањето е забрането.',

  // Car colors
  'color.silver': 'Сиво',
  'color.black': 'Црно',
  'color.white': 'Бело',
  'color.red': 'Црвено',
  'color.blue': 'Сино',

  // Evidence
  'evidence.title': 'Фото-докази',
  'evidence.subtitle': 'Снимките се направени од официјална сообраќајна камера на Safe City.',
  'evidence.tab.scene': 'Снимка од прекршокот',
  'evidence.tab.plate': 'Препознавање на таблица',
  'evidence.tab.map': 'Локација',
  'evidence.captured': 'Снимено',
  'evidence.camera': 'Камера',
  'evidence.zoom': 'Зголеми',
  'evidence.close': 'Затвори',
  'evidence.recording': 'СНИМКА',
  'evidence.targetLocked': 'ОБЈЕКТ ЗАКЛУЧЕН',
  'evidence.plateReading': 'ПРЕПОЗНАВАЊЕ НА ТАБЛИЧКА',
  'evidence.confidence': 'Сигурност',
  'evidence.speedReadout': 'БРЗИНА',
  'evidence.limit': 'ОГРАНИЧУВАЊЕ',

  // Authenticity
  'auth.title': 'Автентичност и транспарентност',
  'auth.lead': 'Овој запис е заштитен криптографски. Еве како да бидете сигурни дека е вистински:',
  'auth.fingerprint': 'Дигитален отпечаток на записот',
  'auth.fingerprint.note':
    'Уникатен криптографски отпечаток пресметан од податоците на овој прекршок. Лажна страница не може да репродуцира валиден отпечаток.',
  'auth.computing': 'Се пресметува…',
  'auth.network': 'Блокчејн мрежа',
  'auth.treasury': 'Сметка за наплата',
  'auth.chainNote':
    'Казната се плаќа преку Solana блокчејн. Секоја уплата е јавна, непроменлива и проверлива од секого.',
  'auth.paidOnChain': 'Платена и потврдена на блокчејн',

  // Payment
  'pay.title': 'Плаќање на казната',
  'pay.breakdown': 'Пресметка',
  'pay.base': 'Основна казна',
  'pay.discount': 'Попуст за навремено плаќање',
  'pay.total': 'Износ за плаќање',
  'pay.sol': 'За плаќање во SOL',
  'pay.rateNote': 'Демо курс: 1 SOL = 100.000 ден. (Solana devnet)',
  'pay.connect.title': 'Поврзете паричник за да платите',
  'pay.connect.body': 'Поврзете Solana паричник (на пр. Phantom) поставен на Devnet.',
  'pay.wallet': 'Поврзан паричник',
  'pay.payNow': 'Плати {amount} SOL',
  'pay.preparing': 'Се подготвува трансакцијата…',
  'pay.confirming': 'Се потврдува на блокчејн…',
  'pay.devnetNote': 'Уверете се дека вашиот паричник е поставен на Solana Devnet.',
  'pay.faucet': 'Земи бесплатни devnet SOL',
  'pay.err.rejected': 'Плаќањето беше откажано во паричникот.',
  'pay.err.insufficient':
    'Немате доволно SOL во паричникот. Земете devnet SOL од факетот и обидете се повторно.',
  'pay.err.generic': 'Плаќањето не успеа. Обидете се повторно.',
  'pay.retry': 'Обиди се повторно',
  'pay.success.title': 'Казната е платена',
  'pay.success.body':
    'Вашата уплата е потврдена и трајно запишана на Solana блокчејн.',
  'pay.receipt': 'Потврда за плаќање',
  'pay.receipt.amount': 'Уплатен износ',
  'pay.receipt.date': 'Датум на уплата',
  'pay.receipt.signature': 'Потпис на трансакцијата',
  'pay.receipt.network': 'Мрежа',
  'pay.receipt.memo': 'Запис во трансакцијата (memo)',
  'pay.receipt.note':
    'Овој потпис е вашата непроменлива потврда. Секој може да ја провери на Solana Explorer.',
  'pay.alreadyPaid': 'Оваа казна е веќе платена.',

  // Footer
  'footer.about.title': 'За Safe City MK',
  'footer.about.body':
    'Демонстративен портал за проверка и плаќање на сообраќајни прекршоци, со транспарентност обезбедена преку Solana блокчејн.',
  'footer.security.title': 'Безбедност',
  'footer.security.body':
    'Никогаш не отвораме линкови во SMS. Внесувајте кодови само на оваа официјална страница.',
  'footer.poweredBy': 'Напојувано од',
  'footer.disclaimer':
    'Прототип развиен за Blockchain Hackathon 2026. Ова е демонстрација и не претставува официјална владина услуга.',

  // Common
  'common.copy': 'Копирај',
  'common.copied': 'Копирано',
  'common.explorer': 'Погледни на Solana Explorer',
  'common.loading': 'Се вчитува…',
};

const en: Record<string, string> = {
  // Header
  'header.tagline': 'Traffic safety system',
  'header.official': 'Official portal',
  'header.secureAddress': 'Secure address',
  'header.home': 'Home',

  // Hero
  'home.eyebrow': 'Traffic violation check',
  'home.title': 'Enter the security code from your SMS message',
  'home.subtitle':
    'View the evidence for your violation with full transparency and pay the fine securely on the blockchain — no links, and no room for fraud.',
  'home.manualAccess': 'You reached this page manually. That is the safe way.',
  'home.trust.noLinks': 'No links',
  'home.trust.evidence': 'Transparent evidence',
  'home.trust.onchain': 'On-chain payment',

  // Code input
  'code.label': 'Security code',
  'code.placeholder': 'SC-XXXXXXXXXXXX',
  'code.help': 'Enter the code exactly as shown in your SMS message.',
  'code.check': 'Check violation',
  'code.checking': 'Checking…',
  'code.error.empty': 'Enter a security code.',
  'code.error.format': 'Invalid format. The code looks like this: SC-8F3A2B91C7D4',
  'code.error.notFound':
    'No violation found for this code. Check the code from your SMS message.',
  'code.demo.title': 'Demo codes for testing',
  'code.demo.hint': 'Click a code to fill in the field.',

  // Phishing notice
  'phishing.badge': 'Security warning',
  'phishing.title': 'Protect yourself from phishing scams',
  'phishing.lead': 'Scammers send fake SMS messages in the name of Safe City. Remember:',
  'phishing.p1': 'We never send links in SMS — we only send a security code.',
  'phishing.p2': 'Only enter codes on this official site, which you open manually.',
  'phishing.p3':
    'We never ask for payment card numbers, PINs, or wallet seed phrases.',
  'phishing.p4': 'Check that the address in your browser is correct before entering any data.',

  // How it works
  'how.title': 'How it works',
  'how.step': 'Step',
  'how.s1.title': 'You receive an SMS with a code',
  'how.s1.body': 'Safe City sends only a secure code — never a clickable link.',
  'how.s2.title': 'You open this site manually',
  'how.s2.body': 'You type the official address yourself and then enter the code.',
  'how.s3.title': 'You view evidence and pay',
  'how.s3.body': 'You transparently review the evidence and pay the fine on-chain.',

  // SMS examples
  'sms.title': 'Recognize a legitimate message',
  'sms.lead': 'Compare the two messages. One is safe, the other is a scam attempt.',
  'sms.legit.tag': 'Legitimate message',
  'sms.phish.tag': 'Phishing attempt',
  'sms.legit.body':
    'Safe City MK: A traffic violation has been detected for your vehicle on 15.05.2026 at 18:42.\n\nLocation:\nPartizanska, Skopje\n\nOpen the official Safe City website and enter the security code below to view the fine and the evidence.\n\nSecurity code:\nSC-8F3A2B91C7D4\n\nDo not open links from unknown senders.',
  'sms.phish.body':
    'Safe City: URGENT! You have an unpaid fine. Pay within 24 hours to avoid court proceedings:\nhttp://safecity-mk.pay-online.info/casa\n\nClick the link immediately.',
  'sms.legit.why': 'Contains only a code. No links. It tells you to open the site yourself.',
  'sms.phish.why': 'Contains a suspicious link and an urgent, threatening tone. Never tap such a link.',

  // Violation view
  'view.back': 'Back to check',
  'view.title': 'Traffic violation',
  'view.ref': 'Ref. no.',
  'view.detailsTitle': 'Violation details',
  'view.field.type': 'Violation type',
  'view.field.datetime': 'Date and time',
  'view.field.location': 'Location',
  'view.field.vehicle': 'Vehicle',
  'view.field.plate': 'Licence plate',
  'view.field.camera': 'Traffic camera',
  'view.field.speed': 'Recorded / speed limit',
  'view.field.issued': 'Issued',
  'view.field.due': 'Payment due',
  'view.amountDue': 'Amount due',

  // Status
  'status.unpaid': 'Unpaid',
  'status.paid': 'Paid',

  // Violation kinds
  'kind.speeding': 'Speeding',
  'kind.red_light': 'Running a red light',
  'kind.bus_lane': 'Driving in a bus lane',
  'kind.no_parking': 'Illegal parking',
  'kind.speeding.desc': 'The vehicle was measured driving faster than permitted on this road.',
  'kind.red_light.desc':
    'The vehicle passed through the intersection while the traffic light was red.',
  'kind.bus_lane.desc': 'The vehicle drove in a lane reserved for public transport.',
  'kind.no_parking.desc': 'The vehicle was parked where parking is prohibited.',

  // Car colors
  'color.silver': 'Silver',
  'color.black': 'Black',
  'color.white': 'White',
  'color.red': 'Red',
  'color.blue': 'Blue',

  // Evidence
  'evidence.title': 'Photo evidence',
  'evidence.subtitle': 'Images captured by an official Safe City traffic camera.',
  'evidence.tab.scene': 'Violation capture',
  'evidence.tab.plate': 'Plate recognition',
  'evidence.tab.map': 'Location',
  'evidence.captured': 'Captured',
  'evidence.camera': 'Camera',
  'evidence.zoom': 'Enlarge',
  'evidence.close': 'Close',
  'evidence.recording': 'REC',
  'evidence.targetLocked': 'TARGET LOCKED',
  'evidence.plateReading': 'PLATE RECOGNITION',
  'evidence.confidence': 'Confidence',
  'evidence.speedReadout': 'SPEED',
  'evidence.limit': 'LIMIT',

  // Authenticity
  'auth.title': 'Authenticity and transparency',
  'auth.lead': "This record is cryptographically protected. Here's how to be sure it is genuine:",
  'auth.fingerprint': 'Record fingerprint',
  'auth.fingerprint.note':
    'A unique cryptographic fingerprint computed from this violation’s data. A fraudulent site cannot reproduce a valid fingerprint.',
  'auth.computing': 'Computing…',
  'auth.network': 'Blockchain network',
  'auth.treasury': 'Collection account',
  'auth.chainNote':
    'The fine is paid via the Solana blockchain. Every payment is public, immutable, and verifiable by anyone.',
  'auth.paidOnChain': 'Paid and confirmed on-chain',

  // Payment
  'pay.title': 'Pay the fine',
  'pay.breakdown': 'Breakdown',
  'pay.base': 'Base fine',
  'pay.discount': 'Early-payment discount',
  'pay.total': 'Amount due',
  'pay.sol': 'Payable in SOL',
  'pay.rateNote': 'Demo rate: 1 SOL = 100,000 MKD (Solana devnet)',
  'pay.connect.title': 'Connect a wallet to pay',
  'pay.connect.body': 'Connect a Solana wallet (e.g. Phantom) set to Devnet.',
  'pay.wallet': 'Connected wallet',
  'pay.payNow': 'Pay {amount} SOL',
  'pay.preparing': 'Preparing transaction…',
  'pay.confirming': 'Confirming on-chain…',
  'pay.devnetNote': 'Make sure your wallet is set to Solana Devnet.',
  'pay.faucet': 'Get free devnet SOL',
  'pay.err.rejected': 'The payment was cancelled in the wallet.',
  'pay.err.insufficient':
    'Not enough SOL in your wallet. Get devnet SOL from the faucet and try again.',
  'pay.err.generic': 'The payment failed. Please try again.',
  'pay.retry': 'Try again',
  'pay.success.title': 'Fine paid',
  'pay.success.body':
    'Your payment is confirmed and permanently recorded on the Solana blockchain.',
  'pay.receipt': 'Payment receipt',
  'pay.receipt.amount': 'Amount paid',
  'pay.receipt.date': 'Payment date',
  'pay.receipt.signature': 'Transaction signature',
  'pay.receipt.network': 'Network',
  'pay.receipt.memo': 'On-chain memo',
  'pay.receipt.note':
    'This signature is your immutable receipt. Anyone can verify it on Solana Explorer.',
  'pay.alreadyPaid': 'This fine has already been paid.',

  // Footer
  'footer.about.title': 'About Safe City MK',
  'footer.about.body':
    'A demonstration portal for checking and paying traffic violations, with transparency provided by the Solana blockchain.',
  'footer.security.title': 'Security',
  'footer.security.body':
    'We never send links in SMS. Only enter codes on this official site.',
  'footer.poweredBy': 'Powered by',
  'footer.disclaimer':
    'Prototype built for Blockchain Hackathon 2026. This is a demonstration and not an official government service.',

  // Common
  'common.copy': 'Copy',
  'common.copied': 'Copied',
  'common.explorer': 'View on Solana Explorer',
  'common.loading': 'Loading…',
};

export const strings: Record<Lang, Record<string, string>> = { mk, en };
