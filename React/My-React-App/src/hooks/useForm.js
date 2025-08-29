import { useState } from 'react';

export function useForm(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update value
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate
    const error = validationRules[name] ? validationRules[name](value) : '';
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const hasErrors = () => {
    return Object.values(errors).some(error => error !== '');
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, hasErrors, resetForm, setValues };
}