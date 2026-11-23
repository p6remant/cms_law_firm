'use client';

import { useState, type ComponentType, type SyntheticEvent } from 'react';
import type { SlotComponent } from '@puckeditor/core';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import type { FormProps } from '@/features/editor/types';
import { simulateFormSubmit } from '@/features/editor/utils/form-utils';

export type FormContainerProps = Omit<FormProps, 'fields'> & {
  fields: SlotComponent | FormProps['fields'];
};

export function FormContainer({
  title,
  description,
  submitEndpoint,
  submitMethod,
  successMessage,
  errorMessage,
  theme,
  fields,
  layout,
}: FormContainerProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const SlotRenderer = (
    typeof fields === 'function'
      ? fields
      : (fields as unknown as { Slot?: ComponentType<{ className?: string }> }).Slot
  ) as ComponentType<{ className?: string }> | undefined;

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorText(null);

    try {
      if (submitEndpoint) {
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const response = await fetch(submitEndpoint, {
          method: submitMethod,
          headers: {
            'Content-Type': 'application/json',
          },
          body: submitMethod === 'GET' ? undefined : JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Submission failed with status: ${String(response.status)}`);
        }
      } else {
        await simulateFormSubmit();
      }
      setIsSubmitted(true);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <BlockLayout layout={layout}>
        <div
          className={
            isDark
              ? 'rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-neutral-100 shadow-sm sm:p-8'
              : 'rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xs sm:p-8'
          }
        >
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle className="mb-4 h-12 w-12 text-emerald-500" />
            <h3 className="text-xl font-bold tracking-tight">
              {successMessage || 'Thank you! Your inquiry has been submitted.'}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">
              We have received your message and our legal team will get back to you shortly.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
              }}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Submit another inquiry
            </button>
          </div>
        </div>
      </BlockLayout>
    );
  }

  return (
    <BlockLayout layout={layout}>
      <div
        className={
          isDark
            ? 'rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-neutral-100 shadow-sm sm:p-8'
            : 'rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xs sm:p-8'
        }
      >
        {(title || description) && (
          <div className="mb-6">
            {title && <h3 className="text-2xl font-bold tracking-tight">{title}</h3>}
            {description && (
              <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">{description}</p>
            )}
          </div>
        )}

        {errorText && (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage || errorText}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="mt-6"
          aria-busy={isSubmitting}
        >
          <fieldset disabled={isSubmitting} className="contents">
            {SlotRenderer && <SlotRenderer className="grid grid-cols-1 gap-4 md:grid-cols-2" />}
          </fieldset>
        </form>
      </div>
    </BlockLayout>
  );
}
