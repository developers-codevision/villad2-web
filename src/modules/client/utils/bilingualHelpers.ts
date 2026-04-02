import { Language } from '../contexts/LanguageContext';

/**
 * Parsea una descripción bilingüe en formato: "texto español / texto inglés"
 * @param text Texto en formato bilingüe
 * @param language Idioma a extraer ('es' o 'en')
 * @returns El texto en el idioma especificado
 */
export function parseBilingualText(text: string | undefined | null, language: Language): string {
  if (!text) return '';
  
  const parts = text.split('/');
  
  if (parts.length < 2) {
    // Si no hay separador, devuelve el texto tal cual
    return text.trim();
  }
  
  if (language === 'es') {
    return parts[0].trim();
  } else {
    return parts[1].trim();
  }
}

/**
 * Parsea una lista separada por comas donde cada item es bilingüe
 * Formato: "item1 español/item1 inglés,item2 español/item2 inglés"
 * @param text Texto con items bilingües separados por comas
 * @param language Idioma a extraer
 * @returns Array de strings en el idioma especificado
 */
export function parseBilingualList(text: string | undefined | null, language: Language): string[] {
  if (!text) return [];
  
  const items = text.split(',').map(item => item.trim()).filter(item => item.length > 0);
  
  return items.map(item => {
    const parts = item.split('/');
    if (parts.length < 2) {
      return item.trim();
    }
    return language === 'es' ? parts[0].trim() : parts[1].trim();
  });
}
