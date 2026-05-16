import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLang } from '../i18n/LangContext';
import {
  IconAlert,
  IconKey,
  IconSearch,
  IconSpinner,
} from './Icons';

interface Props {
  onSubmit: (code: string) => void;
  loading: boolean;
  error: string | null;
}

const TYPEWRITER_CODES = [
  'SC-8F3A2B91C7D4',
  'SC-F2A3B4C5D6E7',
  'SC-7C8D9E0F1A2B',
];

export function CodeInput({ onSubmit, loading, error }: Props) {
  const { t } = useLang();
  const [value, setValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!isAnimating) return;
    cancelRef.current = false;

    let codeIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let tid: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelRef.current) return;
      const code = TYPEWRITER_CODES[codeIdx];
      if (!deleting) {
        charIdx++;
        setValue(code.slice(0, charIdx));
        if (charIdx === code.length) {
          deleting = true;
          tid = setTimeout(step, 1600);
        } else {
          tid = setTimeout(step, 90);
        }
      } else {
        charIdx--;
        setValue(code.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          codeIdx = (codeIdx + 1) % TYPEWRITER_CODES.length;
          tid = setTimeout(step, 400);
        } else {
          tid = setTimeout(step, 45);
        }
      }
    };

    tid = setTimeout(step, 900);
    return () => {
      clearTimeout(tid);
      cancelRef.current = true;
    };
  }, [isAnimating]);

  const stopAnimation = () => {
    if (!isAnimating) return;
    cancelRef.current = true;
    setIsAnimating(false);
    setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stopAnimation();
    setValue(e.target.value.toUpperCase());
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loading) onSubmit(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl bg-white shadow-float ring-1 ring-navy-950/5"
    >
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500"
      />
      <div className="p-5 sm:p-6">
        <label htmlFor="code" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            <IconKey className="h-5 w-5" />
          </span>
          <span className="font-display text-[15px] font-bold text-slate-900">
            {t('code.label')}
          </span>
        </label>

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <input
            id="code"
            name="code"
            value={value}
            onChange={handleChange}
            onFocus={stopAnimation}
            onKeyDown={stopAnimation}
            placeholder={t('code.placeholder')}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="characters"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'code-error' : 'code-help'}
            className={[
              'w-full rounded-xl border bg-slate-50 px-4 py-3.5 font-mono text-lg tracking-[0.12em] text-slate-900 outline-none transition-colors duration-150 placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200',
              isAnimating && value
                ? 'border-blue-400 bg-white ring-2 ring-blue-100'
                : 'border-slate-300',
            ].join(' ')}
          />
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 px-6 py-3.5 font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.85)] transition duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100"
          >
            {loading ? (
              <IconSpinner className="h-5 w-5 animate-spin" />
            ) : (
              <IconSearch className="h-5 w-5" />
            )}
            {loading ? t('code.checking') : t('code.check')}
          </button>
        </div>

        {error ? (
          <p
            id="code-error"
            className="mt-2.5 flex items-start gap-1.5 text-sm font-medium text-red-600"
          >
            <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </p>
        ) : (
          <p id="code-help" className="mt-2.5 text-sm text-slate-500">
            {t('code.help')}
          </p>
        )}


      </div>
    </form>
  );
}
