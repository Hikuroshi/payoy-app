export type ActionFormState<
  TFields extends string,
  TValues extends Record<string, unknown>,
> = {
  errors?: Partial<Record<TFields, string[]>>;
  message?: string;
  submissionId?: string;
  values?: Partial<TValues>;
};

export function createSubmissionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
