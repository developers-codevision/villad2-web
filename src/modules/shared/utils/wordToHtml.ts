import mammoth from 'mammoth';

export async function convertWordToHtml(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  const options = {
    styleMap: [
      "p[style-name='List Paragraph'] => ul > li:fresh",
      "p[style-name='Párrafo de lista'] => ul > li:fresh",
      "p[style-name='List Bullet'] => ul > li:fresh",
      "p[style-name='List Number'] => ol > li:fresh",
      "p[style-name='List'] => ul > li:fresh",
      "p[style-name='Lista'] => ul > li:fresh"
    ]
  };

  const result = await mammoth.convertToHtml({ arrayBuffer }, options);
  let html = result.value;

  // Post-procesar el HTML generado para atrapar viñetas manuales
  // Muchos usuarios no usan la función de lista real de Word, sino que teclean el símbolo "•", "-", etc.

  // Reemplazar párrafos que empiezan por viñetas comunes (•, ·, ◦, ■, -, –, —)
  html = html.replace(/<p>(\s|&nbsp;)*(?:•|·|◦|■|-|–|—)(\s|&nbsp;)+(.*?)<\/p>/gi, '<ul><li>$3</li></ul>');

  // Reemplazar párrafos que empiezan con números (ej. "1. Hola" o "1) Hola")
  html = html.replace(/<p>(\s|&nbsp;)*(\d+)[\.\)](\s|&nbsp;)+(.*?)<\/p>/gi, '<ol><li>$4</li></ol>');

  // Nota: TipTap internamente unifica las etiquetas <ul> o <ol> adyacentes al momento de cargarlas.

  return html;
}