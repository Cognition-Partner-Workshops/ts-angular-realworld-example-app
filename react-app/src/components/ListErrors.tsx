interface ListErrorsProps {
  errors: { [key: string]: string[] | string } | undefined;
}

export default function ListErrors({ errors }: ListErrorsProps) {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  const errorList: string[] = [];
  for (const key of Object.keys(errors)) {
    const val = errors[key];
    if (Array.isArray(val)) {
      for (const msg of val) {
        errorList.push(`${key} ${msg}`);
      }
    } else {
      errorList.push(`${key} ${val}`);
    }
  }

  return (
    <ul className="error-messages" data-testid="auth-errors">
      {errorList.map((err) => (
        <li key={err}>{err}</li>
      ))}
    </ul>
  );
}
