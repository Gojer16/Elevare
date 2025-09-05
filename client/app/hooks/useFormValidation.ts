import { useState, useEffect } from 'react';

interface ValidationErrors {
  [key: string]: string;
}

export default function useFormValidation<T>(
  initialState: T,
  validate: (values: T) => ValidationErrors,
  submit: () => void
) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        try {
          submit();
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    }
  }, [isSubmitting, errors, submit]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
  };

  return { handleChange, handleSubmit, values, errors, isSubmitting };
}
