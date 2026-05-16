import { useState } from 'react';

function IcChev({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
    </svg>
  );
}

const FAQ_ITEMS = [
  {
    question: 'Дали оваа страница е официјална?',
    answer:
      'Да. Ова е единствениот официјален портал на Safe City MK. Внесувајте кодови само овде — никогаш преку линк од SMS или е-мајл.',
  },
  {
    question: 'Добив SMS со линк за плаќање. Дали е легитимен?',
    answer:
      'Не. Safe City никогаш не испраќа линкови во SMS. Ако добивте порака со линк, тоа е обид за измама. Игнорирајте ја и пријавете ја на 192.',
  },
  {
    question: 'Зошто плаќањето оди преку blockchain?',
    answer:
      'Секоја уплата создава јавен, неизменлив запис на Solana мрежата. Можете во секое време да го верификувате вашето плаќање преку Solana Explorer — без да се верувате на никого.',
  },
  {
    question: 'Дали ми треба крипто паричник?',
    answer:
      'Да, за онлајн плаќање преку порталот потребен е Solana паричник (на пример Phantom). Алтернативно, казната може да се плати физички во секоја пошта или банка со референтниот број.',
  },
  {
    question: 'Го изгубив кодот. Како да го добијам повторно?',
    answer:
      'Кодот е испратен само преку официјална SMS порака. Ако ја избришавте пораката, контактирајте го МВР на 192 со регистарскиот број на вашето возило.',
  },
  {
    question: 'Колку имам време да ја платам казната?',
    answer:
      'Рокот за плаќање е наведен во деталите на прекршокот. Доколку платите во рок од 8 дена, добивате попуст од 50% на основната казна.',
  },
  {
    question: 'Можам ли да поднесам приговор?',
    answer:
      'Да. На страницата на вашиот прекршок постои опција за генерирање на формален приговор. Документот го печатите, го потпишувате и го поднесувате до МВР или преку е-Управа.',
  },
  {
    question: 'Дали моите податоци се безбедни?',
    answer:
      'Порталот не бара лични податоци — само го внесувате кодот од SMS. Никогаш не внесувајте PIN, лозинка или seed phrase на ниту една страница.',
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Често поставувани прашања</h2>
      <div className="mt-3 space-y-1">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className="rounded-xl border border-slate-100 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <span className="flex-1">{item.question}</span>
                <IcChev open={isOpen} />
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
