import { useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { VIOLATIONS } from '../data/violations';
import { IconAlert, IconSearch, IconShield, IconSpinner } from './Icons';

interface Props {
  onSubmit: (code: string) => void;
  loading: boolean;
  error: string | null;
}

export function CodeInput({ onSubmit, loading, error }: Props) {
  const { t } = useLang();
  const [value, setValue] = useState('');

  const submit = (code: string) => {
    if (!loading) onSubmit(code);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <label htmlFor="code" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <IconShield className="h-4 w-4 text-blue-700" />
        {t('code.label')}
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="code"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit(value);
          }}
          placeholder={t('code.placeholder')}
          spellCheck={false}
          autoComplete="off"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 font-mono text-lg tracking-wider text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="button"
          onClick={() => submit(value)}
          disabled={loading}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
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
        <p className="mt-2 flex items-start gap-1.5 text-sm text-red-600">
          <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-500">{t('code.help')}</p>
      )}

      <details className="mt-4 rounded-lg bg-slate-50 p-3">
        <summary className="cursor-pointer select-none text-sm font-medium text-slate-600">
          {t('code.demo.title')}
        </summary>
        <p className="mt-2 text-xs text-slate-500">{t('code.demo.hint')}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {VIOLATIONS.map((v) => (
            <button
              key={v.code}
              type="button"
              onClick={() => {
                setValue(v.code);
                submit(v.code);
              }}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 font-mono text-xs text-slate-700 transition hover:border-blue-400 hover:text-blue-700"
            >
              {v.code}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
