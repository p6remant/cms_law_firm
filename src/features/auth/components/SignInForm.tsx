import { useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { type LoginFormValues, loginSchema } from '@/features/auth/schemas';

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
};

export function SignInForm() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      console.log('Sign in form submitted:', value);
      void navigate({ to: '/dashboard' });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="mt-6 space-y-4"
      noValidate
    >
      <form.Field name="email">
        {(field) => (
          <div className="space-y-1.5">
            <label htmlFor={field.name} className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
            />
            {field.state.meta.errors.map((error, index) => (
              <p key={index} className="text-xs text-red-600">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div className="space-y-1.5">
            <label htmlFor={field.name} className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
            />
            {field.state.meta.errors.map((error, index) => (
              <p key={index} className="text-xs text-red-600">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
