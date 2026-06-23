import React from 'react';

/**
 * Highlights words in UPPERCASE with specified color classes
 * @param text - The text to process
 * @param primaryClass - CSS class for primary highlighting (default: text-primary)
 * @param accentClass - CSS class for accent highlighting (default: text-accent)
 * @returns React elements with highlighted uppercase words
 */
export function highlightUppercase(
  text: string | undefined,
  primaryClass: string = 'text-primary font-semibold',
  accentClass: string = 'text-accent font-semibold'
): React.ReactNode {
  if (!text) return '';

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let colorToggle = 0;

  // Match all uppercase words (2+ letters, Latin or Cyrillic)
  const regex = /\b([A-ZА-ЯЁ0-9]{2,})\b/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const word = match[1];
    const startIndex = match.index;
    
    // Add text before the match
    if (startIndex > lastIndex) {
      elements.push(
        <React.Fragment key={`text-${lastIndex}`}>
          {text.substring(lastIndex, startIndex)}
        </React.Fragment>
      );
    }
    
    // Add highlighted word
    const colorClass = colorToggle % 2 === 0 ? primaryClass : accentClass;
    elements.push(
      <span key={`word-${startIndex}`} className={colorClass}>
        {word}
      </span>
    );
    
    colorToggle++;
    lastIndex = startIndex + word.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(
      <React.Fragment key={`text-${lastIndex}`}>
        {text.substring(lastIndex)}
      </React.Fragment>
    );
  }

  return elements.length > 0 ? elements : text;
}
