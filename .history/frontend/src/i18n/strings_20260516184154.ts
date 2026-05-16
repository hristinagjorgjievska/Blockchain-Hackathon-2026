export type Lang = 'mk' | 'en' | 'sr';

export const LANGS: readonly Lang[] = ['mk', 'en', 'sr'] as const;
export const LANG_LABELS: Record<Lang, string> = { mk: 'МК', en: 'EN', sr: 'СР' };

const mk: Record<string, string> = {
  // Header
  'header.tagline': 'Систем за сообраќајна безбедност',
  'header.official': 'Официјален портал',
  'header.secureAddress': 'Безбедна адреса',
  'header.home': 'Почетна',
  'header.login': 'Најави се',

  // Hero
  'home.eyebrow': 'Проверка на сообраќаен прекршок',
  'home.title': 'Внесете го безбедносниот код од вашата SMS-порака',
  'home.subtitle':
    'Погледнете ги доказите за прекршокот целосно транспарентно и платете ја казната безбедно преку блокчејн — без линкови и без можност за измама.',
  'home.manualAccess': 'Пристапивте на оваа страница рачно. Тоа е безбедниот начин.',
  'home.trust.noLinks': 'Без линкови',
  'home.trust.evidence': 'Транспарентни докази',
  'home.trust.onchain': 'Плаќање на блокчејн',
  'home.loginRequired.title': 'Потребна е најава',
  'home.loginRequired.body': 'Внесете го вашиот безбедносен код за да го видите прекршокот. За да го заштитиме вашиот приватност, потребно е прво да се најавите.',
  'home.loginRequired.cta': 'Најави се за да продолжите',

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
  'phishing.lead': 'Измамници испраќаат лажни SMS-пораки во име на SafeChain. Запаметете:',
  'phishing.p1': 'Никогаш не испраќаме линкови во SMS — испраќаме само безбедносен код.',
  'phishing.p2': 'Внесувајте кодови само на оваа официјална страница, до која пристапувате рачно.',
  'phishing.p3':
    'Никогаш не бараме број на платежна картичка, PIN или фраза за обнова на паричник (seed phrase).',
  'phishing.p4': 'Проверете дека адресата во прелистувачот е точна пред да внесете какви било податоци.',

  // How it works
  'how.title': 'Како функционира',
  'how.step': 'Чекор',
  'how.s1.title': 'Добивате SMS со код',
  'how.s1.body': 'SafeChain испраќа само безбеден код — никогаш линк за кликање.',
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
    'SafeChain MK: Детектиран е сообраќаен прекршок за вашето возило на 15.05.2026 во 18:42 часот.\n\nЛокација:\nПартизанска, Скопје\n\nОтворете ја официјалната SafeChain веб-страница и внесете го безбедносниот код подолу за да ја погледнете казната и доказите.\n\nБезбедносен код:\nSC-8F3A2B91C7D4\n\nНе отворајте линкови од непознати испраќачи.',
  'sms.phish.body':
    'SafeChain: ИТНО! Имате неплатена казна. Платете во рок од 24 часа за да избегнете судска постапка:\nhttp://safecity-mk.pay-online.info/casa\n\nКликнете на линкот веднаш.',
  'sms.legit.why': 'Содржи само код. Без линкови. Ве упатува самите да ја отворите страницата.',
  'sms.phish.why': 'Содржи сомнителен линк и итен, заканувачки тон. Никогаш не кликајте на ваков линк.',
  'sms.legit.senderNote': 'Потврден испраќач',
  'sms.phish.senderNote': 'Непознат број',
  'sms.phish.spamTag': 'Можен спам',
  'sms.now': 'сега',
  'sms.inputPlaceholder': 'Текст-порака',

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
  'view.field.due': 'Попустот важи до',
  'view.field.legal': 'Казнена основа',
  'view.amountDue': 'Износ за плаќање',
  'view.notFound.title': 'Прекршокот не е пронајден',
  'view.voided.title': 'Овој прекршок е поништен',
  'view.voided.body': 'Потврдивме дека ова известување е издадено погрешно. Не е потребно плаќање. Искрено се извинуваме за евентуалните непријатности.',
  'view.appeal.banner': 'Вашата жалба е примена и е под разгледување. Ќе бидете контактирани со резултатот.',

  // Status
  'status.unpaid': 'Неплатено',
  'status.paid': 'Платено',

  // Violation kinds
  'kind.speeding': 'Пречекорување на брзина',
  'kind.red_light': 'Поминување на црвено светло',
  'kind.expired_registration': 'Истечена регистрација',
  'kind.no_parking': 'Непрописно паркирање',
  'kind.speeding.desc': 'Возилото е измерено како вози побрзо од дозволеното на овој пат.',
  'kind.red_light.desc':
    'Возилото поминало низ раскрсницата додека семафорот покажувал црвено светло.',
  'kind.expired_registration.desc':
    'Системот утврдил дека возилото има истечена регистрација или сообраќајна дозвола.',
  'kind.no_parking.desc': 'Возилото било паркирано на место каде што паркирањето е забрането.',

  // Car colors
  'color.silver': 'Сиво',
  'color.black': 'Црно',
  'color.white': 'Бело',
  'color.red': 'Црвено',
  'color.blue': 'Сино',

  // Evidence
  'evidence.title': 'Фото-докази',
  'evidence.subtitle': 'Снимките се направени од официјална сообраќајна камера на SafeChain.',
  'evidence.tab.scene': 'Снимка од прекршокот',
  'evidence.tab.plate': 'Препознавање на таблица',
  'evidence.tab.map': 'Локација',
  'evidence.captured': 'Снимено',
  'evidence.camera': 'Камера',
  'evidence.zoom': 'Зголеми',
  'evidence.close': 'Затвори',
  'evidence.prev': 'Претходен доказ',
  'evidence.next': 'Следен доказ',
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

  // NFT Record
  'nft.label': 'Солана NFT запис · Девнет',
  'nft.metadata': 'Јавни метаподатоци на NFT',
  'nft.fingerprint': 'Автентичност на записот',
  'nft.fingerprint.note':
    'SHA-256 отпечаток од официјалните податоци на прекршокот. Лажна страница не може да репродуцира овој отпечаток.',
  'nft.treasury': 'Treasury сметка',
  'nft.immutable':
    'Овој прекршок е неизменливо запишан на Solana блокчејн. Записот не може да се избрише — може само да се смени неговиот статус.',
  'nft.status.unpaid': 'Неплатено',
  'nft.status.paid': 'Платено',
  'nft.status.voided': 'Поништено',
  'nft.status.appeal_pending': 'Жалба во тек',
  'nft.card.title': 'Прекршочен NFT',
  'nft.card.violation': 'Прекршок',
  'nft.card.status': 'Статус',
  'nft.card.plateHashed': 'Табличка (хаширана)',
  'nft.card.evidence': 'Докази',
  'nft.card.blockchainVerified': 'Потврдено на блокчејн',
  'nft.card.txHash': 'Хаш на трансакција',
  'nft.card.certified':
    'Ова е сертифициран запис за прекршок. Се чува на блокчејн и не може да се измени.',
  'nft.card.certifiedShort': 'Сертифициран запис',
  'nft.card.inZone': 'во зона од',

  // NFT Carousel
  'carousel.title': 'Вашите прекршоци на блокчејн',
  'carousel.subtitle': '{count} NFT записи поврзани со вашиот паричник',
  'carousel.refId': 'Референтен број',
  'carousel.amountDue': 'Износ за плаќање',
  'carousel.paid': 'Платено',
  'carousel.view': 'Отвори',
  'carousel.prev': 'Претходно',
  'carousel.next': 'Следно',

  // Payment
  'pay.title': 'Плаќање на казната',
  'pay.breakdown': 'Пресметка',
  'pay.base': 'Основна казна',
  'pay.discount': 'Попуст {percent}% во првите {days} дена',
  'pay.discountDeadline': 'Попустот важи до',
  'pay.discountRule':
    'Според правилото за навремено плаќање, казната се намалува за {percent}% ако се плати во првите {days} дена.',
  'pay.total': 'Износ за плаќање',
  'pay.sol': 'За плаќање во SOL',
  'pay.rateNote': 'Демо курс: 1 SOL = 100.000 ден. (Solana devnet)',
  'pay.method.card': 'Картичка / банка',
  'pay.method.crypto': 'Крипто',
  'pay.card.title': 'Плаќање со картичка',
  'pay.card.body':
    'Плаќањето се запишува преку backend и Supabase како официјална евиденција за некрипто уплата.',
  'pay.card.nameLabel': 'Сопственик на картичката',
  'pay.card.namePlaceholder': 'Иван Петровски',
  'pay.card.numberLabel': 'Број на картичка',
  'pay.card.expiryLabel': 'Важи до',
  'pay.card.cvcLabel': 'CVC / CVV',
  'pay.card.secure': 'Безбедна, шифрирана врска',
  'pay.card.payNow': 'Плати со картичка',
  'pay.card.processing': 'Се обработува уплатата…',
  'pay.card.note':
    'За продукција тука се поврзува официјален картичен или банкарски процесор; прототипот запишува потврдена уплата во базата.',
  'pay.connect.title': 'Поврзете паричник за да платите',
  'pay.connect.body': 'Поврзете Solana паричник (на пр. Phantom) поставен на Devnet.',
  'pay.wallet': 'Поврзан паричник',
  'pay.payNow': 'Плати {amount} SOL',
  'pay.preparing': 'Се подготвува трансакцијата…',
  'pay.confirming': 'Се потврдува на блокчејн…',
  'pay.processing': 'Се обработува плаќањето',
  'pay.step.encrypt': 'Се шифрира memo записот на backend',
  'pay.step.authorize': 'Одобрете ја трансакцијата во паричникот',
  'pay.devnetNote': 'Уверете се дека вашиот паричник е поставен на Solana Devnet.',
  'pay.faucet': 'Земи бесплатни devnet SOL',
  'pay.err.rejected': 'Плаќањето беше откажано во паричникот.',
  'pay.err.insufficient':
    'Немате доволно SOL во паричникот. Земете devnet SOL од факетот и обидете се повторно.',
  'pay.err.generic': 'Плаќањето не успеа. Обидете се повторно.',
  'pay.retry': 'Обиди се повторно',
  'pay.success.title': 'Казната е платена',
  'pay.success.body.crypto':
    'Вашата уплата е потврдена и трајно запишана на Solana блокчејн.',
  'pay.success.body.nonCrypto': 'Вашата некрипто уплата е потврдена и запишана во backend базата.',
  'pay.receipt': 'Потврда за плаќање',
  'pay.receipt.amount': 'Уплатен износ',
  'pay.receipt.date': 'Датум на уплата',
  'pay.receipt.signature': 'Потпис на трансакцијата',
  'pay.receipt.id': 'Број на потврда',
  'pay.receipt.method': 'Начин на плаќање',
  'pay.receipt.network': 'Мрежа',
  'pay.receipt.memo': 'Шифриран запис во трансакцијата (memo)',
  'pay.receipt.memoSummary': 'Шифрираниот memo содржи: {fields}.',
  'pay.receipt.memoDecrypt': 'Дешифрирај memo',
  'pay.receipt.memoDecrypting': 'Се дешифрира…',
  'pay.receipt.memoDecrypted': 'Дешифриран memo за презентација',
  'pay.receipt.memoDecryptError': 'Memo записот не може да се дешифрира.',
  'pay.receipt.note':
    'Потврдата се чува локално и во backend. Блокчејн уплатите може јавно да се проверат на Solana Explorer.',
  'pay.alreadyPaid': 'Оваа казна е веќе платена.',
  'pay.receipt.downloadPdf': 'Превземи PDF потврда',
  'pay.receipt.pdfGenerating': 'Се генерира PDF…',

  // Appeal
  'appeal.title': 'Поднеси приговор',
  'appeal.subtitle': 'Генерирај формален приговор + PDF документ за преземање.',
  'appeal.noteLabel': 'Напомена',
  'appeal.noteBody': 'Документот е нацрт. Прочитајте го, потпишете го и поднесете до МВР.',
  'appeal.groundLabel': 'Основа за приговор',
  'appeal.groundPlaceholder': '— Изберете причина —',
  'appeal.ground.yellow_light': 'Светлото беше жолто при поминување',
  'appeal.ground.sign_invisible': 'Сообраќајниот знак не беше видлив',
  'appeal.ground.emergency': 'Итна ситуација / виша сила',
  'appeal.ground.wrong_vehicle': 'Возилото не е мое / е продадено',
  'appeal.ground.device_error': 'Грешка на мерниот уред или камерата',
  'appeal.ground.other': 'Друга причина',
  'appeal.descriptionLabel': 'Ваше образложение',
  'appeal.descriptionPlaceholder':
    'Пр: „Светлото беше жолто кога почнав да поминувам — беше невозможно безбедно да запрам."',
  'appeal.characters': '{count} карактери (мин. 10)',
  'appeal.imagesLabel': 'Додади докази (слики) - опционално',
  'appeal.imagesUpload': 'Кликни за да поставиш слики со докази',
  'appeal.imagesHelp': 'JPG, PNG · макс. 5 слики за брза генерација',
  'appeal.imageAlt': 'Доказ {index}',
  'appeal.imageLabel': 'Доказ {index}',
  'appeal.imagesAttached': '{count} слика(и) прилошена(и)',
  'appeal.generating': 'Генерирање…',
  'appeal.generate': 'Генерирај приговор →',
  'appeal.ready': 'PDF документот е готов за преземање',
  'appeal.hideText': 'Скриј текст',
  'appeal.showText': 'Прегледај текст на приговорот',
  'appeal.pdfPreview': 'PDF Преглед — {ref}',
  'appeal.iframeTitle': 'Преглед на приговор',
  'appeal.submitNote':
    'Отпечатете го документот, потпишете го и поднесете го до најблиската станица на МВР или преку е-Управа.',
  'appeal.download': 'Преземи PDF',
  'appeal.new': 'Нов приговор',
  'appeal.error': 'Грешка при генерирање на документот. Обидете се повторно или освежете ја страницата.',

  // FAQ - Home page
  'faq.home.title': 'Често поставувани прашања',
  'faq.home.q1': 'Што е SafeChain?',
  'faq.home.a1':
    'SafeChain е транспарентен систем за сообраќајни прекршоци кој ви овозможува безбедно да ги проверите вашите казни и да ги платите преку блокчејн. Сите докази и плаќања се запишани на блокчејн.',
  'faq.home.q2': 'Дали е мојот безбедносен код навистина безбеден?',
  'faq.home.a2':
    'Да. Вашиот код се испраќа преку SMS и не содржи линкови. Важи само кога ќе биде внесен на оваа официјална страница. Измамниците не можат да го репродуцираат криптографскиот отпечаток.',
  'faq.home.q3': 'Зошто не испраќате линкови во SMS?',
  'faq.home.a3':
    'Линковите можат да бидат лажирани од измамници. Со испраќање само на код и со тоа што вие самите ја внесувате адресата, ризикот од фишинг е целосно елиминиран.',
  'faq.home.q4': 'Дали можам да верувам во овој систем?',
  'faq.home.a4':
    'Системот е изграден на Solana блокчејн, кој е јавен и непроменлив. Секое плаќање е видливо за сите и верификувано од мрежата.',
  'faq.home.q5': 'Како да го проверам мојот прекршок?',
  'faq.home.a5':
    'Внесете го безбедносниот код од SMS пораката во полето за проверка. Системот ќе ги прикаже деталите, доказите и опциите за плаќање.',

  // FAQ - Violation view
  'faq.violation.title': 'За вашиот прекршок',
  'faq.violation.daysLeftQ': 'Колку денови имам за да платам со попуст?',
  'faq.violation.daysLeftA': 'Имате {days} дена преостанати од денес да го искористите попустот за навремено плаќање.',
  'faq.violation.disagreeQ': 'Што ако верувам дека казната е погрешна?',
  'faq.violation.disagreeA':
    'Можете да поднесете приговор или да ја контактирате сообраќајната власт. Прегледајте ги доказите и образложете го вашиот приговор.',
  'faq.violation.appealQ': 'Дали можам да поднесам приговор?',
  'faq.violation.appealA':
    'Да. Користете го делот "Поднеси приговор" на оваа страница за да генерирате формален приговор. Потоа однесете го во полициска станица.',
  'faq.violation.paymentQ': 'Како да го платам прекршокот?',
  'faq.violation.paymentA':
    'Користете го панелот за плаќање десно. Поврзете Solana паричник на Devnet и кликнете "Плати". Плаќањето е веднаш потврдено.',
  'faq.violation.evidenceQ': 'Какви докази се достапни?',
  'faq.violation.evidenceA':
    'Системот прикажува фото-докази од сообраќајната камера, вклучувајќи слика од прекршокот, препознавање на регистарски таблици и мапа на локацијата.',

  // Footer
  'footer.about.title': 'За SafeChain MK',
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
  'header.login': 'Sign in',

  // Hero
  'home.eyebrow': 'Traffic violation check',
  'home.title': 'Enter the security code from your SMS message',
  'home.subtitle':
    'View the evidence for your violation with full transparency and pay the fine securely on the blockchain — no links, and no room for fraud.',
  'home.manualAccess': 'You reached this page manually. That is the safe way.',
  'home.trust.noLinks': 'No links',
  'home.trust.evidence': 'Transparent evidence',
  'home.trust.onchain': 'On-chain payment',
  'home.loginRequired.title': 'Sign in required',
  'home.loginRequired.body': 'To protect your privacy, you must sign in before looking up a violation code.',
  'home.loginRequired.cta': 'Sign in to continue',

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
  'phishing.lead': 'Scammers send fake SMS messages in the name of SafeChain. Remember:',
  'phishing.p1': 'We never send links in SMS — we only send a security code.',
  'phishing.p2': 'Only enter codes on this official site, which you open manually.',
  'phishing.p3':
    'We never ask for payment card numbers, PINs, or wallet seed phrases.',
  'phishing.p4': 'Check that the address in your browser is correct before entering any data.',

  // How it works
  'how.title': 'How it works',
  'how.step': 'Step',
  'how.s1.title': 'You receive an SMS with a code',
  'how.s1.body': 'SafeChain sends only a secure code — never a clickable link.',
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
    'SafeChain MK: A traffic violation has been detected for your vehicle on 15.05.2026 at 18:42.\n\nLocation:\nPartizanska, Skopje\n\nOpen the official SafeChain website and enter the security code below to view the fine and the evidence.\n\nSecurity code:\nSC-8F3A2B91C7D4\n\nDo not open links from unknown senders.',
  'sms.phish.body':
    'SafeChain: URGENT! You have an unpaid fine. Pay within 24 hours to avoid court proceedings:\nhttp://safecity-mk.pay-online.info/casa\n\nClick the link immediately.',
  'sms.legit.why': 'Contains only a code. No links. It tells you to open the site yourself.',
  'sms.phish.why': 'Contains a suspicious link and an urgent, threatening tone. Never tap such a link.',
  'sms.legit.senderNote': 'Verified sender',
  'sms.phish.senderNote': 'Unknown number',
  'sms.phish.spamTag': 'Maybe: Spam',
  'sms.now': 'now',
  'sms.inputPlaceholder': 'Text Message',

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
  'view.field.due': 'Discount valid until',
  'view.field.legal': 'Penalty basis',
  'view.amountDue': 'Amount due',
  'view.notFound.title': 'Violation not found',
  'view.voided.title': 'This violation has been annulled',
  'view.voided.body': 'We have verified that this notice was issued in error. No payment is required. We sincerely apologize for any inconvenience.',
  'view.appeal.banner': 'Your appeal has been received and is under review. You will be contacted with the outcome.',

  // Status
  'status.unpaid': 'Unpaid',
  'status.paid': 'Paid',

  // Violation kinds
  'kind.speeding': 'Speeding',
  'kind.red_light': 'Running a red light',
  'kind.expired_registration': 'Expired registration',
  'kind.no_parking': 'Illegal parking',
  'kind.speeding.desc': 'The vehicle was measured driving faster than permitted on this road.',
  'kind.red_light.desc':
    'The vehicle passed through the intersection while the traffic light was red.',
  'kind.expired_registration.desc':
    'The system detected an expired vehicle registration or traffic permit.',
  'kind.no_parking.desc': 'The vehicle was parked where parking is prohibited.',

  // Car colors
  'color.silver': 'Silver',
  'color.black': 'Black',
  'color.white': 'White',
  'color.red': 'Red',
  'color.blue': 'Blue',

  // Evidence
  'evidence.title': 'Photo evidence',
  'evidence.subtitle': 'Images captured by an official SafeChain traffic camera.',
  'evidence.tab.scene': 'Violation capture',
  'evidence.tab.plate': 'Plate recognition',
  'evidence.tab.map': 'Location',
  'evidence.captured': 'Captured',
  'evidence.camera': 'Camera',
  'evidence.zoom': 'Enlarge',
  'evidence.close': 'Close',
  'evidence.prev': 'Previous evidence',
  'evidence.next': 'Next evidence',
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
    "A unique cryptographic fingerprint computed from this violation's data. A fraudulent site cannot reproduce a valid fingerprint.",
  'auth.computing': 'Computing…',
  'auth.network': 'Blockchain network',
  'auth.treasury': 'Collection account',
  'auth.chainNote':
    'The fine is paid via the Solana blockchain. Every payment is public, immutable, and verifiable by anyone.',
  'auth.paidOnChain': 'Paid and confirmed on-chain',

  // NFT Record
  'nft.label': 'Solana NFT Record · Devnet',
  'nft.metadata': 'Public NFT Metadata',
  'nft.fingerprint': 'Record Authenticity',
  'nft.fingerprint.note':
    'SHA-256 fingerprint of the official violation data. A fraudulent site cannot reproduce this fingerprint.',
  'nft.treasury': 'Treasury account',
  'nft.immutable':
    'This violation is immutably recorded on the Solana blockchain. Records cannot be deleted — only their status changes.',
  'nft.status.unpaid': 'Unpaid',
  'nft.status.paid': 'Paid',
  'nft.status.voided': 'Voided',
  'nft.status.appeal_pending': 'Appeal Pending',
  'nft.card.title': 'Violation NFT',
  'nft.card.violation': 'Violation',
  'nft.card.status': 'Status',
  'nft.card.plateHashed': 'Plate (hashed)',
  'nft.card.evidence': 'Evidence',
  'nft.card.blockchainVerified': 'Blockchain Verified',
  'nft.card.txHash': 'TX hash',
  'nft.card.certified':
    'This is a certified violation record. Stored on blockchain. Tamper-proof.',
  'nft.card.certifiedShort': 'Certified violation record',
  'nft.card.inZone': 'in',

  // NFT Carousel
  'carousel.title': 'Your violations on-chain',
  'carousel.subtitle': '{count} NFT records linked to your wallet',
  'carousel.refId': 'Reference ID',
  'carousel.amountDue': 'Amount due',
  'carousel.paid': 'Paid',
  'carousel.view': 'Open',
  'carousel.prev': 'Previous',
  'carousel.next': 'Next',

  // Payment
  'pay.title': 'Pay the fine',
  'pay.breakdown': 'Breakdown',
  'pay.base': 'Base fine',
  'pay.discount': '{percent}% discount in the first {days} days',
  'pay.discountDeadline': 'Discount valid until',
  'pay.discountRule':
    'Under the early-payment rule, the fine is reduced by {percent}% when paid in the first {days} days.',
  'pay.total': 'Amount due',
  'pay.sol': 'Payable in SOL',
  'pay.rateNote': 'Demo rate: 1 SOL = EUR 1,626.02 (100,000 MKD, Solana devnet)',
  'pay.method.card': 'Card / bank',
  'pay.method.crypto': 'Crypto',
  'pay.card.title': 'Pay by card',
  'pay.card.body':
    'The payment is recorded through the backend and Supabase as the official non-crypto payment record.',
  'pay.card.nameLabel': 'Cardholder name',
  'pay.card.namePlaceholder': 'Ivan Petrovski',
  'pay.card.numberLabel': 'Card number',
  'pay.card.expiryLabel': 'Expiry',
  'pay.card.cvcLabel': 'CVC / CVV',
  'pay.card.secure': 'Secure, encrypted connection',
  'pay.card.payNow': 'Pay by card',
  'pay.card.processing': 'Processing payment…',
  'pay.card.note':
    'In production this connects to an official card or bank processor; this prototype stores a confirmed payment in the database.',
  'pay.connect.title': 'Connect a wallet to pay',
  'pay.connect.body': 'Connect a Solana wallet (e.g. Phantom) set to Devnet.',
  'pay.wallet': 'Connected wallet',
  'pay.payNow': 'Pay {amount} SOL',
  'pay.preparing': 'Preparing transaction…',
  'pay.confirming': 'Confirming on-chain…',
  'pay.processing': 'Processing payment',
  'pay.step.encrypt': 'Encrypting the memo on the backend',
  'pay.step.authorize': 'Approve the transaction in your wallet',
  'pay.devnetNote': 'Make sure your wallet is set to Solana Devnet.',
  'pay.faucet': 'Get free devnet SOL',
  'pay.err.rejected': 'The payment was cancelled in the wallet.',
  'pay.err.insufficient':
    'Not enough SOL in your wallet. Get devnet SOL from the faucet and try again.',
  'pay.err.generic': 'The payment failed. Please try again.',
  'pay.retry': 'Try again',
  'pay.success.title': 'Fine paid',
  'pay.success.body.crypto':
    'Your payment is confirmed and permanently recorded on the Solana blockchain.',
  'pay.success.body.nonCrypto':
    'Your non-crypto payment is confirmed and recorded in the backend database.',
  'pay.receipt': 'Payment receipt',
  'pay.receipt.amount': 'Amount paid',
  'pay.receipt.date': 'Payment date',
  'pay.receipt.signature': 'Transaction signature',
  'pay.receipt.id': 'Receipt ID',
  'pay.receipt.method': 'Payment method',
  'pay.receipt.network': 'Network',
  'pay.receipt.memo': 'Encrypted on-chain memo',
  'pay.receipt.memoSummary': 'The encrypted memo contains: {fields}.',
  'pay.receipt.memoDecrypt': 'Decrypt memo',
  'pay.receipt.memoDecrypting': 'Decrypting…',
  'pay.receipt.memoDecrypted': 'Decrypted memo for presentation',
  'pay.receipt.memoDecryptError': 'The memo could not be decrypted.',
  'pay.receipt.note':
    'The receipt is stored locally and in the backend. Blockchain payments can also be verified on Solana Explorer.',
  'pay.alreadyPaid': 'This fine has already been paid.',
  'pay.receipt.downloadPdf': 'Download PDF receipt',
  'pay.receipt.pdfGenerating': 'Generating PDF…',

  // Appeal
  'appeal.title': 'Submit an appeal',
  'appeal.subtitle': 'Generate a formal appeal + downloadable PDF document.',
  'appeal.noteLabel': 'Note',
  'appeal.noteBody': 'This document is a draft. Read it, sign it, and submit it to the Ministry of Interior.',
  'appeal.groundLabel': 'Appeal basis',
  'appeal.groundPlaceholder': '— Choose a reason —',
  'appeal.ground.yellow_light': 'The light was yellow when I passed',
  'appeal.ground.sign_invisible': 'The traffic sign was not visible',
  'appeal.ground.emergency': 'Emergency situation / force majeure',
  'appeal.ground.wrong_vehicle': 'The vehicle is not mine / was sold',
  'appeal.ground.device_error': 'Measuring device or camera error',
  'appeal.ground.other': 'Other reason',
  'appeal.descriptionLabel': 'Your explanation',
  'appeal.descriptionPlaceholder':
    'Example: “The light was yellow when I started crossing — it was impossible to stop safely.”',
  'appeal.characters': '{count} characters (min. 10)',
  'appeal.imagesLabel': 'Add evidence (images) - optional',
  'appeal.imagesUpload': 'Click to upload evidence images',
  'appeal.imagesHelp': 'JPG, PNG · max. 5 images for fast generation',
  'appeal.imageAlt': 'Evidence {index}',
  'appeal.imageLabel': 'Evidence {index}',
  'appeal.imagesAttached': '{count} image(s) attached',
  'appeal.generating': 'Generating…',
  'appeal.generate': 'Generate appeal →',
  'appeal.ready': 'The PDF document is ready to download',
  'appeal.hideText': 'Hide text',
  'appeal.showText': 'Preview appeal text',
  'appeal.pdfPreview': 'PDF Preview — {ref}',
  'appeal.iframeTitle': 'Appeal preview',
  'appeal.submitNote':
    'Print the document, sign it, and submit it to the nearest Ministry of Interior station or through e-Government.',
  'appeal.download': 'Download PDF',
  'appeal.new': 'New appeal',
  'appeal.error': 'Error while generating the document. Try again or refresh the page.',

  // FAQ - Home page
  'faq.home.title': 'Frequently asked questions',
  'faq.home.q1': 'What is SafeChain?',
  'faq.home.a1':
    'SafeChain is a transparent traffic violation system that lets you securely check your fines and pay them on the blockchain. All evidence and payments are recorded on-chain.',
  'faq.home.q2': 'Is my security code really secure?',
  'faq.home.a2':
    'Yes. Your code is sent via SMS with no links. It is only valid when entered on this official website. Scammers cannot replicate the cryptographic fingerprint.',
  'faq.home.q3': "Why don't you send links in SMS?",
  'faq.home.a3':
    'Links can be faked by scammers. By sending only a code and having you type the address yourself, phishing risks are completely eliminated.',
  'faq.home.q4': 'Can I trust this system?',
  'faq.home.a4':
    'The system is built on the Solana blockchain, which is public and immutable. Every payment is visible to everyone and verified by the network.',
  'faq.home.q5': 'How do I check my violation?',
  'faq.home.a5':
    'Enter the security code from your SMS in the check field. The system will show the details, evidence, and payment options.',

  // FAQ - Violation view
  'faq.violation.title': 'About your violation',
  'faq.violation.daysLeftQ': 'How many days do I have to pay with a discount?',
  'faq.violation.daysLeftA': 'You have {days} days remaining from today to use the early-payment discount.',
  'faq.violation.disagreeQ': 'What if I believe the fine is wrong?',
  'faq.violation.disagreeA':
    'You can file an appeal or contact the traffic authority. Review the evidence and provide your grounds clearly.',
  'faq.violation.appealQ': 'Can I appeal this violation?',
  'faq.violation.appealA':
    'Yes. Use the "Submit Appeal" section on this page to generate a formal appeal. Then submit it to a police station.',
  'faq.violation.paymentQ': 'How do I pay the fine?',
  'faq.violation.paymentA':
    'Use the payment panel on the right. Connect a Solana wallet on Devnet and click "Pay". The payment is confirmed immediately.',
  'faq.violation.evidenceQ': 'What evidence is available?',
  'faq.violation.evidenceA':
    'The system shows photo evidence from the traffic camera, including the violation capture, plate recognition, and location map.',

  // Footer
  'footer.about.title': 'About SafeChain MK',
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

const srLatin: Record<string, string> = {
  ...en,
  'header.tagline': 'Sistem za bezbednost saobraćaja',
  'header.official': 'Zvanični portal',
  'header.secureAddress': 'Bezbedna adresa',
  'header.home': 'Početna',
  'header.login': 'Prijavi se',

  'home.eyebrow': 'Provera saobraćajnog prekršaja',
  'home.title': 'Unesite bezbednosni kod iz SMS poruke',
  'home.subtitle':
    'Pogledajte dokaze za prekršaj potpuno transparentno i platite kaznu bezbedno preko blockchaina ili bez kripta, bez linkova i bez prostora za prevaru.',
  'home.manualAccess': 'Do ove stranice ste došli ručno. To je bezbedan način.',
  'home.trust.noLinks': 'Bez linkova',
  'home.trust.evidence': 'Transparentni dokazi',
  'home.trust.onchain': 'Plaćanje na blockchainu',
  'home.loginRequired.title': 'Potrebna prijava',
  'home.loginRequired.body': 'Da biste zaštitili vašu privatnost, morate se prijaviti pre pregleda prekršaja.',
  'home.loginRequired.cta': 'Prijavite se da nastavite',

  'code.label': 'Bezbednosni kod',
  'code.placeholder': 'SC-XXXXXXXXXXXX',
  'code.help': 'Unesite kod tačno kao u SMS poruci.',
  'code.check': 'Proveri prekršaj',
  'code.checking': 'Proveravam…',
  'code.error.empty': 'Unesite bezbednosni kod.',
  'code.error.format': 'Neispravan format. Kod izgleda ovako: SC-8F3A2B91C7D4',
  'code.error.notFound':
    'Nije pronađen prekršaj sa ovim kodom. Proverite kod iz SMS poruke.',
  'code.demo.title': 'Demo kodovi za testiranje',
  'code.demo.hint': 'Kliknite na kod da popunite polje.',

  'phishing.badge': 'Bezbednosno upozorenje',
  'phishing.title': 'Zaštitite se od phishing prevara',
  'phishing.lead': 'Prevaranti šalju lažne SMS poruke u ime SafeChain. Zapamtite:',
  'phishing.p1': 'Nikada ne šaljemo linkove u SMS-u, samo bezbednosni kod.',
  'phishing.p2': 'Kodove unosite samo na ovoj zvaničnoj stranici, koju otvarate ručno.',
  'phishing.p3': 'Nikada ne tražimo broj kartice, PIN ili seed frazu novčanika.',
  'phishing.p4': 'Proverite da je adresa u pregledaču tačna pre unosa podataka.',

  'how.title': 'Kako funkcioniše',
  'how.step': 'Korak',
  'how.s1.title': 'Dobijate SMS sa kodom',
  'how.s1.body': 'SafeChain šalje samo bezbedan kod, nikada link za klik.',
  'how.s2.title': 'Ručno otvarate ovu stranicu',
  'how.s2.body': 'Sami unosite zvaničnu adresu, zatim unosite kod.',
  'how.s3.title': 'Gledate dokaze i plaćate',
  'how.s3.body': 'Transparentno pregledate dokaze i plaćate kaznu.',

  'sms.title': 'Prepoznajte legitimnu poruku',
  'sms.lead': 'Uporedite dve poruke. Jedna je bezbedna, druga je pokušaj prevare.',
  'sms.legit.tag': 'Legitimna poruka',
  'sms.phish.tag': 'Pokušaj prevare',
  'sms.legit.body':
    'SafeChain MK: Detektovan je saobraćajni prekršaj za vaše vozilo dana 15.05.2026 u 18:42.\n\nLokacija:\nPartizanska, Skoplje\n\nOtvorite zvaničnu SafeChain web stranicu i unesite bezbednosni kod ispod da pogledate kaznu i dokaze.\n\nBezbednosni kod:\nSC-8F3A2B91C7D4\n\nNe otvarajte linkove od nepoznatih pošiljalaca.',
  'sms.phish.body':
    'SafeChain: HITNO! Imate neplaćenu kaznu. Platite u roku od 24 sata da izbegnete sudski postupak:\nhttp://safecity-mk.pay-online.info/casa\n\nKliknite na link odmah.',
  'sms.legit.why': 'Sadrži samo kod. Bez linkova. Upućuje vas da sami otvorite stranicu.',
  'sms.phish.why': 'Sadrži sumnjiv link i hitan, preteći ton. Nikada ne otvarajte takav link.',
  'sms.legit.senderNote': 'Potvrđen pošiljalac',
  'sms.phish.senderNote': 'Nepoznat broj',
  'sms.phish.spamTag': 'Moguć spam',
  'sms.now': 'sada',
  'sms.inputPlaceholder': 'Tekstualna poruka',

  'view.back': 'Nazad na proveru',
  'view.title': 'Saobraćajni prekršaj',
  'view.ref': 'Ref. br.',
  'view.detailsTitle': 'Detalji prekršaja',
  'view.field.type': 'Vrsta prekršaja',
  'view.field.datetime': 'Datum i vreme',
  'view.field.location': 'Lokacija',
  'view.field.vehicle': 'Vozilo',
  'view.field.plate': 'Registarska tablica',
  'view.field.camera': 'Saobraćajna kamera',
  'view.field.speed': 'Izmerena / dozvoljena brzina',
  'view.field.issued': 'Izdato',
  'view.field.due': 'Popust važi do',
  'view.field.legal': 'Kaznena osnova',
  'view.amountDue': 'Iznos za plaćanje',
  'view.notFound.title': 'Prekršaj nije pronađen',
  'view.voided.title': 'Ovaj prekršaj je poništen',
  'view.voided.body': 'Potvrdili smo da je ovo obaveštenje izdato greškom. Plaćanje nije potrebno. Iskreno se izvinjavamo za eventualne neprijatnosti.',
  'view.appeal.banner': 'Vaša žalba je primljena i razmatra se. Bićete kontaktirani s ishodom.',

  'status.unpaid': 'Neplaćeno',
  'status.paid': 'Plaćeno',

  'kind.speeding': 'Prekoračenje brzine',
  'kind.red_light': 'Prolazak kroz crveno svetlo',
  'kind.expired_registration': 'Istekla registracija',
  'kind.no_parking': 'Nepropisno parkiranje',
  'kind.speeding.desc': 'Vozilo je izmereno kako se kreće brže od dozvoljenog.',
  'kind.red_light.desc': 'Vozilo je prošlo kroz raskrsnicu dok je semafor pokazivao crveno.',
  'kind.expired_registration.desc':
    'Sistem je utvrdio da vozilo ima isteklu registraciju ili saobraćajnu dozvolu.',
  'kind.no_parking.desc': 'Vozilo je bilo parkirano na mestu gde parkiranje nije dozvoljeno.',

  'color.silver': 'Srebrno',
  'color.black': 'Crno',
  'color.white': 'Belo',
  'color.red': 'Crveno',
  'color.blue': 'Plavo',

  'evidence.title': 'Foto dokazi',
  'evidence.subtitle': 'Snimci su napravljeni zvaničnom SafeChain saobraćajnom kamerom.',
  'evidence.tab.scene': 'Snimak prekršaja',
  'evidence.tab.plate': 'Prepoznavanje tablice',
  'evidence.tab.map': 'Lokacija',
  'evidence.captured': 'Snimljeno',
  'evidence.camera': 'Kamera',
  'evidence.zoom': 'Uvećaj',
  'evidence.close': 'Zatvori',
  'evidence.prev': 'Prethodni dokaz',
  'evidence.next': 'Sledeći dokaz',
  'evidence.recording': 'SNIMAK',
  'evidence.targetLocked': 'OBJEKAT ZAKLJUČAN',
  'evidence.plateReading': 'PREPOZNAVANJE TABLICE',
  'evidence.confidence': 'Pouzdanost',
  'evidence.speedReadout': 'BRZINA',
  'evidence.limit': 'OGRANIČENJE',

  'auth.title': 'Autentičnost i transparentnost',
  'auth.lead': 'Ovaj zapis je kriptografski zaštićen. Evo kako da budete sigurni da je pravi:',
  'auth.fingerprint': 'Digitalni otisak zapisa',
  'auth.fingerprint.note':
    'Jedinstveni kriptografski otisak izračunat iz podataka ovog prekršaja. Lažna stranica ne može da reprodukuje validan otisak.',
  'auth.computing': 'Izračunava se…',
  'auth.network': 'Blockchain mreža',
  'auth.treasury': 'Račun za naplatu',
  'auth.chainNote':
    'Kripto uplata ide preko Solana blockchaina. Svaka takva uplata je javna, nepromenljiva i proverljiva.',
  'auth.paidOnChain': 'Plaćeno i potvrđeno na blockchainu',

  // NFT Record
  'nft.label': 'Solana NFT Zapis · Devnet',
  'nft.metadata': 'Javni NFT metapodaci',
  'nft.fingerprint': 'Autentičnost zapisa',
  'nft.fingerprint.note':
    'SHA-256 otisak zvaničnih podataka o prekršaju. Lažna stranica ne može da reprodukuje ovaj otisak.',
  'nft.treasury': 'Treasury račun',
  'nft.immutable':
    'Ovaj prekršaj je nepromenjivo zapisan na Solana blockchainu. Zapisi se ne mogu brisati — može se jedino promeniti status.',
  'nft.status.unpaid': 'Neplaćeno',
  'nft.status.paid': 'Plaćeno',
  'nft.status.voided': 'Poništeno',
  'nft.status.appeal_pending': 'Žalba u toku',
  'nft.card.title': 'NFT zapis prekršaja',
  'nft.card.violation': 'Prekršaj',
  'nft.card.status': 'Status',
  'nft.card.plateHashed': 'Tablica (heširana)',
  'nft.card.evidence': 'Dokazi',
  'nft.card.blockchainVerified': 'Potvrđeno na blockchainu',
  'nft.card.txHash': 'Hash transakcije',
  'nft.card.certified':
    'Ovo je sertifikovan zapis prekršaja. Čuva se na blockchainu i ne može se izmeniti.',
  'nft.card.certifiedShort': 'Sertifikovan zapis',
  'nft.card.inZone': 'u zoni od',

  // NFT Carousel
  'carousel.title': 'Vaši prekršaji na blockchainu',
  'carousel.subtitle': '{count} NFT zapisa povezanih sa vašim novčanikom',
  'carousel.refId': 'Referentni broj',
  'carousel.amountDue': 'Iznos za plaćanje',
  'carousel.paid': 'Plaćeno',
  'carousel.view': 'Otvori',
  'carousel.prev': 'Prethodno',
  'carousel.next': 'Sledeće',

  'pay.title': 'Plaćanje kazne',
  'pay.breakdown': 'Obračun',
  'pay.base': 'Osnovna kazna',
  'pay.discount': 'Popust {percent}% u prvih {days} dana',
  'pay.discountDeadline': 'Popust važi do',
  'pay.discountRule':
    'Prema pravilu za blagovremeno plaćanje, kazna se umanjuje za {percent}% ako se plati u prvih {days} dana.',
  'pay.total': 'Iznos za plaćanje',
  'pay.sol': 'Za plaćanje u SOL',
  'pay.rateNote': 'Demo kurs: 1 SOL = 100.000 MKD (Solana devnet)',
  'pay.method.card': 'Kartica / banka',
  'pay.method.crypto': 'Kripto',
  'pay.card.title': 'Plaćanje karticom',
  'pay.card.body':
    'Plaćanje se evidentira preko backend-a i Supabase baze kao zvanični zapis nekrypto uplate.',
  'pay.card.nameLabel': 'Ime vlasnika kartice',
  'pay.card.namePlaceholder': 'Ivan Petrovski',
  'pay.card.numberLabel': 'Broj kartice',
  'pay.card.expiryLabel': 'Važi do',
  'pay.card.cvcLabel': 'CVC / CVV',
  'pay.card.secure': 'Bezbedna, šifrovana veza',
  'pay.card.payNow': 'Plati karticom',
  'pay.card.processing': 'Obrada plaćanja…',
  'pay.card.note':
    'U produkciji se ovde povezuje zvanični kartični ili bankarski procesor; prototip upisuje potvrđenu uplatu u bazu.',
  'pay.connect.title': 'Povežite novčanik za plaćanje',
  'pay.connect.body': 'Povežite Solana novčanik, npr. Phantom, podešen na Devnet.',
  'pay.wallet': 'Povezan novčanik',
  'pay.payNow': 'Plati {amount} SOL',
  'pay.preparing': 'Priprema transakcije…',
  'pay.confirming': 'Potvrđuje se na blockchainu…',
  'pay.processing': 'Obrada plaćanja',
  'pay.step.encrypt': 'Šifruje se memo zapis na backend-u',
  'pay.step.authorize': 'Odobrite transakciju u novčaniku',
  'pay.devnetNote': 'Proverite da je novčanik podešen na Solana Devnet.',
  'pay.faucet': 'Uzmi besplatne devnet SOL',
  'pay.err.rejected': 'Plaćanje je otkazano u novčaniku.',
  'pay.err.insufficient':
    'Nemate dovoljno SOL u novčaniku. Uzmite devnet SOL sa fauceta i pokušajte ponovo.',
  'pay.err.generic': 'Plaćanje nije uspelo. Pokušajte ponovo.',
  'pay.retry': 'Pokušaj ponovo',
  'pay.success.title': 'Kazna je plaćena',
  'pay.success.body.crypto':
    'Vaša uplata je potvrđena i trajno zapisana na Solana blockchainu.',
  'pay.success.body.nonCrypto':
    'Vaša nekrypto uplata je potvrđena i zapisana u backend bazi.',
  'pay.receipt': 'Potvrda o plaćanju',
  'pay.receipt.amount': 'Uplaćen iznos',
  'pay.receipt.date': 'Datum uplate',
  'pay.receipt.signature': 'Potpis transakcije',
  'pay.receipt.id': 'Broj potvrde',
  'pay.receipt.method': 'Način plaćanja',
  'pay.receipt.network': 'Mreža',
  'pay.receipt.memo': 'Šifrovani zapis u transakciji (memo)',
  'pay.receipt.memoSummary': 'Šifrovani memo sadrži: {fields}.',
  'pay.receipt.memoDecrypt': 'Dešifruj memo',
  'pay.receipt.memoDecrypting': 'Dešifruje se…',
  'pay.receipt.memoDecrypted': 'Dešifrovani memo za prezentaciju',
  'pay.receipt.memoDecryptError': 'Memo zapis ne može da se dešifruje.',
  'pay.receipt.note':
    'Potvrda se čuva lokalno i u backend-u. Blockchain uplate mogu javno da se provere na Solana Exploreru.',
  'pay.alreadyPaid': 'Ova kazna je već plaćena.',
  'pay.receipt.downloadPdf': 'Preuzmi PDF potvrdu',
  'pay.receipt.pdfGenerating': 'Generiše se PDF…',

  'faq.home.title': 'Često postavljana pitanja',
  'faq.home.q1': 'Šta je SafeChain?',
  'faq.home.a1':
    'SafeChain je transparentan sistem za saobraćajne prekršaje koji vam omogućava da bezbedno proverite kazne i platite ih na blockchainu. Svi dokazi su zabeleženi na lancu.',
  'faq.home.q2': 'Da li je moj bezbednosni kod zaista bezbedan?',
  'faq.home.a2':
    'Da. Vaš kod se šalje SMS-om bez linkova. Važi samo kada se unese na ovoj zvaničnoj stranici. Prevaranti ne mogu da reprodukuju kriptografski otisak.',
  'faq.home.q3': 'Zašto ne šaljete linkove u SMS-u?',
  'faq.home.a3':
    'Linkovi mogu biti lažirani. Slanjem samo koda i upućivanjem da sami ukucate adresu, rizik od phishinga je potpuno eliminisan.',
  'faq.home.q4': 'Mogu li da verujem ovom sistemu?',
  'faq.home.a4':
    'Sistem je izgrađen na Solana blockchainu, koji je javan i nepromenljiv. Svako plaćanje je vidljivo svima.',
  'faq.home.q5': 'Kako da proverim svoj prekršaj?',
  'faq.home.a5':
    'Unesite bezbednosni kod iz SMS poruke u polje za proveru. Sistem će prikazati detalje, dokaze i opcije plaćanja.',

  'faq.violation.title': 'O vašem prekršaju',
  'faq.violation.daysLeftQ': 'Koliko dana imam da platim sa popustom?',
  'faq.violation.daysLeftA': 'Imate {days} dana preostalo od danas da iskoristite popust za blagovremeno plaćanje.',
  'faq.violation.disagreeQ': 'Šta ako verujem da je kazna pogrešna?',
  'faq.violation.disagreeA':
    'Možete podneti prigovor ili kontaktirati saobraćajnu vlast. Pregledajte dokaze i obrazložite svoj prigovor.',
  'faq.violation.appealQ': 'Mogu li da podnesem prigovor?',
  'faq.violation.appealA':
    'Da. Koristite deo "Podnesi prigovor" na ovoj stranici da generišete formalni prigovor. Zatim ga odnesite u policijsku stanicu.',
  'faq.violation.paymentQ': 'Kako da platim prekršaj?',
  'faq.violation.paymentA':
    'Koristite panel za plaćanje desno. Povežite Solana novčanik na Devnet-u i kliknite "Plati". Plaćanje je odmah potvrđeno.',
  'faq.violation.evidenceQ': 'Koji dokazi su dostupni?',
  'faq.violation.evidenceA':
    'Sistem prikazuje foto-dokaze sa saobraćajne kamere, uključujući snimak prekršaja, prepoznavanje tablice i mapu lokacije.',

  'footer.about.title': 'O SafeChain MK',
  'footer.about.body':
    'Demo portal za proveru i plaćanje saobraćajnih prekršaja, sa transparentnošću preko Solana blockchaina.',
  'footer.security.title': 'Bezbednost',
  'footer.security.body':
    'Nikada ne šaljemo linkove u SMS-u. Kodove unosite samo na ovoj zvaničnoj stranici.',
  'footer.poweredBy': 'Pokreće',
  'footer.disclaimer':
    'Prototip razvijen za Blockchain Hackathon 2026. Ovo je demonstracija i nije zvanična državna usluga.',

  'common.copy': 'Kopiraj',
  'common.copied': 'Kopirano',
  'common.explorer': 'Pogledaj na Solana Exploreru',
  'common.loading': 'Učitavanje…',
};

const sr: Record<string, string> = {
  ...srLatin,
  'header.tagline': 'Систем за безбедност саобраћаја',
  'header.official': 'Званични портал',
  'header.secureAddress': 'Безбедна адреса',
  'header.home': 'Почетна',
  'header.login': 'Пријави се',

  'home.eyebrow': 'Провера саобраћајног прекршаја',
  'home.title': 'Унесите безбедносни код из SMS поруке',
  'home.subtitle':
    'Погледајте доказе за прекршај потпуно транспарентно и платите казну безбедно преко блокчејна или без крипта, без линкова и без простора за превару.',
  'home.manualAccess': 'До ове странице сте дошли ручно. То је безбедан начин.',
  'home.trust.noLinks': 'Без линкова',
  'home.trust.evidence': 'Транспарентни докази',
  'home.trust.onchain': 'Плаћање на блокчејну',
  'home.loginRequired.title': 'Потребна пријава',
  'home.loginRequired.body': 'Да бисте заштитили вашу приватност, морате се пријавити пре прегледа прекршаја.',
  'home.loginRequired.cta': 'Пријавите се да наставите',

  'code.label': 'Безбедносни код',
  'code.placeholder': 'SC-XXXXXXXXXXXX',
  'code.help': 'Унесите код тачно као у SMS поруци.',
  'code.check': 'Провери прекршај',
  'code.checking': 'Проверавам…',
  'code.error.empty': 'Унесите безбедносни код.',
  'code.error.format': 'Неисправан формат. Код изгледа овако: SC-8F3A2B91C7D4',
  'code.error.notFound':
    'Није пронађен прекршај са овим кодом. Проверите код из SMS поруке.',
  'code.demo.title': 'Демо кодови за тестирање',
  'code.demo.hint': 'Кликните на код да попуните поље.',

  'phishing.badge': 'Безбедносно упозорење',
  'phishing.title': 'Заштитите се од фишинг превара',
  'phishing.lead': 'Преваранти шаљу лажне SMS поруке у име SafeChain. Запамтите:',
  'phishing.p1': 'Никада не шаљемо линкове у SMS-у, само безбедносни код.',
  'phishing.p2': 'Кодове уносите само на овој званичној страници, коју отварате ручно.',
  'phishing.p3': 'Никада не тражимо број картице, PIN или seed фразу новчаника.',
  'phishing.p4': 'Проверите да је адреса у прегледачу тачна пре уноса података.',

  'how.title': 'Како функционише',
  'how.step': 'Корак',
  'how.s1.title': 'Добијате SMS са кодом',
  'how.s1.body': 'SafeChain шаље само безбедан код, никада линк за клик.',
  'how.s2.title': 'Ручно отварате ову страницу',
  'how.s2.body': 'Сами уносите званичну адресу, затим уносите код.',
  'how.s3.title': 'Гледате доказе и плаћате',
  'how.s3.body': 'Транспарентно прегледате доказе и плаћате казну.',

  'sms.title': 'Препознајте легитимну поруку',
  'sms.lead': 'Упоредите две поруке. Једна је безбедна, друга је покушај преваре.',
  'sms.legit.tag': 'Легитимна порука',
  'sms.phish.tag': 'Покушај преваре',
  'sms.legit.body':
    'SafeChain MK: Детектован је саобраћајни прекршај за ваше возило дана 15.05.2026 у 18:42.\n\nЛокација:\nПартизанска, Скопље\n\nОтворите званичну SafeChain веб страницу и унесите безбедносни код испод да погледате казну и доказе.\n\nБезбедносни код:\nSC-8F3A2B91C7D4\n\nНе отварајте линкове од непознатих пошиљалаца.',
  'sms.phish.body':
    'SafeChain: ХИТНО! Имате неплаћену казну. Платите у року од 24 сата да избегнете судски поступак:\nhttp://safecity-mk.pay-online.info/casa\n\nКликните на линк одмах.',
  'sms.legit.why': 'Садржи само код. Без линкова. Упућује вас да сами отворите страницу.',
  'sms.phish.why': 'Садржи сумњив линк и хитан, претећи тон. Никада не отварајте такав линк.',
  'sms.legit.senderNote': 'Потврђен пошиљалац',
  'sms.phish.senderNote': 'Непознат број',
  'sms.phish.spamTag': 'Могућ спам',
  'sms.now': 'сада',
  'sms.inputPlaceholder': 'Текстуална порука',

  'view.back': 'Назад на проверу',
  'view.title': 'Саобраћајни прекршај',
  'view.ref': 'Реф. бр.',
  'view.detailsTitle': 'Детаљи прекршаја',
  'view.field.type': 'Врста прекршаја',
  'view.field.datetime': 'Датум и време',
  'view.field.location': 'Локација',
  'view.field.vehicle': 'Возило',
  'view.field.plate': 'Регистарска таблица',
  'view.field.camera': 'Саобраћајна камера',
  'view.field.speed': 'Измерена / дозвољена брзина',
  'view.field.issued': 'Издато',
  'view.field.due': 'Попуст важи до',
  'view.field.legal': 'Казнена основа',
  'view.amountDue': 'Износ за плаћање',
  'view.notFound.title': 'Прекршај није пронађен',
  'view.voided.title': 'Овај прекршај је поништен',
  'view.voided.body': 'Потврдили смо да је ово обавештење издато грешком. Плаћање није потребно. Искрено се извињавамо за евентуалне непријатности.',
  'view.appeal.banner': 'Ваша жалба је примљена и разматра се. Бићете контактирани с исходом.',

  'status.unpaid': 'Неплаћено',
  'status.paid': 'Плаћено',

  'kind.speeding': 'Прекорачење брзине',
  'kind.red_light': 'Пролазак кроз црвено светло',
  'kind.expired_registration': 'Истекла регистрација',
  'kind.no_parking': 'Непрописно паркирање',
  'kind.speeding.desc': 'Возило је измерено како се креће брже од дозвољеног.',
  'kind.red_light.desc': 'Возило је прошло кроз раскрсницу док је семафор показивао црвено.',
  'kind.expired_registration.desc':
    'Систем је утврдио да возило има истеклу регистрацију или саобраћајну дозволу.',
  'kind.no_parking.desc': 'Возило је било паркирано на месту где паркирање није дозвољено.',

  'color.silver': 'Сребрно',
  'color.black': 'Црно',
  'color.white': 'Бело',
  'color.red': 'Црвено',
  'color.blue': 'Плаво',

  'evidence.title': 'Фото докази',
  'evidence.subtitle': 'Снимци су направљени званичном SafeChain саобраћајном камером.',
  'evidence.tab.scene': 'Снимак прекршаја',
  'evidence.tab.plate': 'Препознавање таблице',
  'evidence.tab.map': 'Локација',
  'evidence.captured': 'Снимљено',
  'evidence.camera': 'Камера',
  'evidence.zoom': 'Увећај',
  'evidence.close': 'Затвори',
  'evidence.prev': 'Претходни доказ',
  'evidence.next': 'Следећи доказ',
  'evidence.recording': 'СНИМАК',
  'evidence.targetLocked': 'ОБЈЕКАТ ЗАКЉУЧАН',
  'evidence.plateReading': 'ПРЕПОЗНАВАЊЕ ТАБЛИЦЕ',
  'evidence.confidence': 'Поузданост',
  'evidence.speedReadout': 'БРЗИНА',
  'evidence.limit': 'ОГРАНИЧЕЊЕ',

  'auth.title': 'Аутентичност и транспарентност',
  'auth.lead': 'Овај запис је криптографски заштићен. Ево како да будете сигурни да је прави:',
  'auth.fingerprint': 'Дигитални отисак записа',
  'auth.fingerprint.note':
    'Јединствени криптографски отисак израчунат из података овог прекршаја. Лажна страница не може да репродукује валидан отисак.',
  'auth.computing': 'Израчунава се…',
  'auth.network': 'Блокчејн мрежа',
  'auth.treasury': 'Рачун за наплату',
  'auth.chainNote':
    'Крипто уплата иде преко Solana блокчејна. Свака таква уплата је јавна, непроменљива и проверљива.',
  'auth.paidOnChain': 'Плаћено и потврђено на блокчејну',

  // NFT Record
  'nft.label': 'Solana NFT Запис · Devnet',
  'nft.metadata': 'Јавни NFT метаподаци',
  'nft.fingerprint': 'Аутентичност записа',
  'nft.fingerprint.note':
    'SHA-256 отисак званичних података о прекршају. Лажна страница не може да репродукује овај отисак.',
  'nft.treasury': 'Treasury рачун',
  'nft.immutable':
    'Овај прекршај је непромењиво записан на Solana блокчејну. Записи се не могу брисати — може се једино променити статус.',
  'nft.status.unpaid': 'Неплаћено',
  'nft.status.paid': 'Плаћено',
  'nft.status.voided': 'Поништено',
  'nft.status.appeal_pending': 'Жалба у току',
  'nft.card.title': 'NFT запис прекршаја',
  'nft.card.violation': 'Прекршај',
  'nft.card.status': 'Статус',
  'nft.card.plateHashed': 'Таблица (хеширана)',
  'nft.card.evidence': 'Докази',
  'nft.card.blockchainVerified': 'Потврђено на блокчејну',
  'nft.card.txHash': 'Хеш трансакције',
  'nft.card.certified':
    'Ово је сертификован запис прекршаја. Чува се на блокчејну и не може се изменити.',
  'nft.card.certifiedShort': 'Сертификован запис',
  'nft.card.inZone': 'у зони од',

  // NFT Carousel
  'carousel.title': 'Ваши прекршаји на блокчејну',
  'carousel.subtitle': '{count} NFT записа повезаних са вашим новчаником',
  'carousel.refId': 'Референтни број',
  'carousel.amountDue': 'Износ за плаћање',
  'carousel.paid': 'Плаћено',
  'carousel.view': 'Отвори',
  'carousel.prev': 'Претходно',
  'carousel.next': 'Следеће',

  'pay.title': 'Плаћање казне',
  'pay.breakdown': 'Обрачун',
  'pay.base': 'Основна казна',
  'pay.discount': 'Попуст {percent}% у првих {days} дана',
  'pay.discountDeadline': 'Попуст важи до',
  'pay.discountRule':
    'Према правилу за благовремено плаћање, казна се умањује за {percent}% ако се плати у првих {days} дана.',
  'pay.total': 'Износ за плаћање',
  'pay.sol': 'За плаћање у SOL',
  'pay.rateNote': 'Демо курс: 1 SOL = 190.000 дин. (100.000 MKD, Solana devnet)',
  'pay.method.card': 'Картица / банка',
  'pay.method.crypto': 'Крипто',
  'pay.card.title': 'Плаћање картицом',
  'pay.card.body':
    'Плаћање се евидентира преко бекенда и Supabase базе као званични запис некрипто уплате.',
  'pay.card.nameLabel': 'Власник картице',
  'pay.card.namePlaceholder': 'Иван Петровски',
  'pay.card.numberLabel': 'Број картице',
  'pay.card.expiryLabel': 'Важи до',
  'pay.card.cvcLabel': 'CVC / CVV',
  'pay.card.secure': 'Безбедна, шифрована веза',
  'pay.card.payNow': 'Плати картицом',
  'pay.card.processing': 'Обрада плаћања…',
  'pay.card.note':
    'У продукцији се овде повезује званични картично-банкарски процесор; прототип уписује потврђену уплату у базу.',
  'pay.connect.title': 'Повежите новчаник за плаћање',
  'pay.connect.body': 'Повежите Solana новчаник, нпр. Phantom, подешен на Devnet.',
  'pay.wallet': 'Повезан новчаник',
  'pay.payNow': 'Плати {amount} SOL',
  'pay.preparing': 'Припрема трансакције…',
  'pay.confirming': 'Потврђује се на блокчејну…',
  'pay.processing': 'Обрада плаћања',
  'pay.step.encrypt': 'Шифрује се memo запис на бекенду',
  'pay.step.authorize': 'Одобрите трансакцију у новчанику',
  'pay.devnetNote': 'Проверите да је новчаник подешен на Solana Devnet.',
  'pay.faucet': 'Узми бесплатне devnet SOL',
  'pay.err.rejected': 'Плаћање је отказано у новчанику.',
  'pay.err.insufficient':
    'Немате довољно SOL у новчанику. Узмите devnet SOL са faucet-а и покушајте поново.',
  'pay.err.generic': 'Плаћање није успело. Покушајте поново.',
  'pay.retry': 'Покушај поново',
  'pay.success.title': 'Казна је плаћена',
  'pay.success.body.crypto':
    'Ваша уплата је потврђена и трајно записана на Solana блокчејну.',
  'pay.success.body.nonCrypto':
    'Ваша некрипто уплата је потврђена и записана у бекенд бази.',
  'pay.receipt': 'Потврда о плаћању',
  'pay.receipt.amount': 'Уплаћен износ',
  'pay.receipt.date': 'Датум уплате',
  'pay.receipt.signature': 'Потпис трансакције',
  'pay.receipt.id': 'Број потврде',
  'pay.receipt.method': 'Начин плаћања',
  'pay.receipt.network': 'Мрежа',
  'pay.receipt.memo': 'Шифровани запис у трансакцији (memo)',
  'pay.receipt.memoSummary': 'Шифровани memo садржи: {fields}.',
  'pay.receipt.memoDecrypt': 'Дешифруј memo',
  'pay.receipt.memoDecrypting': 'Дешифрује се…',
  'pay.receipt.memoDecrypted': 'Дешифровани memo за презентацију',
  'pay.receipt.memoDecryptError': 'Memo запис не може да се дешифрује.',
  'pay.receipt.note':
    'Потврда се чува локално и у бекенду. Блокчејн уплате могу јавно да се провере на Solana Explorer-у.',
  'pay.alreadyPaid': 'Ова казна је већ плаћена.',
  'pay.receipt.downloadPdf': 'Преузми PDF потврду',
  'pay.receipt.pdfGenerating': 'Генерише се PDF…',

  'appeal.title': 'Поднеси приговор',
  'appeal.subtitle': 'Генериши формални приговор + PDF документ за преузимање.',
  'appeal.noteLabel': 'Напомена',
  'appeal.noteBody': 'Документ је нацрт. Прочитајте га, потпишите и поднесите МУП-у.',
  'appeal.groundLabel': 'Основа за приговор',
  'appeal.groundPlaceholder': '— Изаберите разлог —',
  'appeal.ground.yellow_light': 'Светло је било жуто при проласку',
  'appeal.ground.sign_invisible': 'Саобраћајни знак није био видљив',
  'appeal.ground.emergency': 'Хитна ситуација / виша сила',
  'appeal.ground.wrong_vehicle': 'Возило није моје / продато је',
  'appeal.ground.device_error': 'Грешка мерног уређаја или камере',
  'appeal.ground.other': 'Други разлог',
  'appeal.descriptionLabel': 'Ваше образложење',
  'appeal.descriptionPlaceholder':
    'Пр: „Светло је било жуто када сам почео да пролазим — било је немогуће безбедно стати."',
  'appeal.characters': '{count} карактера (мин. 10)',
  'appeal.imagesLabel': 'Додај доказе (слике) - опционално',
  'appeal.imagesUpload': 'Кликните да поставите слике са доказима',
  'appeal.imagesHelp': 'JPG, PNG · макс. 5 слика за брзу генерацију',
  'appeal.imageAlt': 'Доказ {index}',
  'appeal.imageLabel': 'Доказ {index}',
  'appeal.imagesAttached': '{count} слика приложено',
  'appeal.generating': 'Генерише се…',
  'appeal.generate': 'Генериши приговор →',
  'appeal.ready': 'PDF документ је спреман за преузимање',
  'appeal.hideText': 'Сакриј текст',
  'appeal.showText': 'Прегледај текст приговора',
  'appeal.pdfPreview': 'PDF преглед — {ref}',
  'appeal.iframeTitle': 'Преглед приговора',
  'appeal.submitNote':
    'Одштампајте документ, потпишите га и поднесите најближој станици МУП-а или преко е-Управе.',
  'appeal.download': 'Преузми PDF',
  'appeal.new': 'Нови приговор',
  'appeal.error': 'Грешка при генерисању документа. Покушајте поново или освежите страницу.',

  'faq.home.title': 'Често постављана питања',
  'faq.home.q1': 'Шта је SafeChain?',
  'faq.home.a1':
    'SafeChain је транспарентан систем за саобраћајне прекршаје који вам омогућава да безбедно проверите казне и платите их на блокчејну. Сви докази су забележени на ланцу.',
  'faq.home.q2': 'Да ли је мој безбедносни код заиста безбедан?',
  'faq.home.a2':
    'Да. Ваш код се шаље SMS-ом без линкова. Важи само када се унесе на овој званичној страници. Преваранти не могу да репродукују криптографски отисак.',
  'faq.home.q3': 'Зашто не шаљете линкове у SMS-у?',
  'faq.home.a3':
    'Линкови могу бити лажирани. Слањем само кода и упућивањем да сами укуцате адресу, ризик од фишинга је потпуно елиминисан.',
  'faq.home.q4': 'Могу ли да верујем овом систему?',
  'faq.home.a4':
    'Систем је изграђен на Solana блокчејну, који је јаван и непроменљив. Свако плаћање је видљиво свима.',
  'faq.home.q5': 'Како да проверим свој прекршај?',
  'faq.home.a5':
    'Унесите безбедносни код из SMS поруке у поље за проверу. Систем ће приказати детаље, доказе и опције плаћања.',

  'faq.violation.title': 'О вашем прекршају',
  'faq.violation.daysLeftQ': 'Колико дана имам да платим са попустом?',
  'faq.violation.daysLeftA': 'Имате {days} дана преостало од данас да искористите попуст за благовремено плаћање.',
  'faq.violation.disagreeQ': 'Шта ако верујем да је казна погрешна?',
  'faq.violation.disagreeA':
    'Можете поднети приговор или контактирати саобраћајну власт. Прегледајте доказе и образложите свој приговор.',
  'faq.violation.appealQ': 'Могу ли да поднесем приговор?',
  'faq.violation.appealA':
    'Да. Користите део "Поднеси приговор" на овој страници да генеришете формални приговор. Затим га однесите у полицијску станицу.',
  'faq.violation.paymentQ': 'Како да платим прекршај?',
  'faq.violation.paymentA':
    'Користите панел за плаћање десно. Повежите Solana новчаник на Devnet-у и кликните "Плати". Плаћање је одмах потврђено.',
  'faq.violation.evidenceQ': 'Који докази су доступни?',
  'faq.violation.evidenceA':
    'Систем приказује фото-доказе са саобраћајне камере, укључујући снимак прекршаја, препознавање таблице и мапу локације.',

  'footer.about.title': 'О SafeChain MK',
  'footer.about.body':
    'Демо портал за проверу и плаћање саобраћајних прекршаја, са транспарентношћу преко Solana блокчејна.',
  'footer.security.title': 'Безбедност',
  'footer.security.body':
    'Никада не шаљемо линкове у SMS-у. Кодове уносите само на овој званичној страници.',
  'footer.poweredBy': 'Покреће',
  'footer.disclaimer':
    'Прототип развијен за Blockchain Hackathon 2026. Ово је демонстрација и није званична државна услуга.',

  'common.copy': 'Копирај',
  'common.copied': 'Копирано',
  'common.explorer': 'Погледај на Solana Explorer-у',
  'common.loading': 'Учитавање…',
};

export const strings: Record<Lang, Record<string, string>> = { mk, en, sr };
