export const applyPhoneMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 10) {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  
  return numbers
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

export const applyCpfMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export const applyCepMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/(\d{5})(\d)/, '$1-$2')
}

