/**
 * Simple HTML sanitization utility for user input
 * Removes potentially dangerous HTML tags and attributes
 */

// HTML entities to escape
const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param text - The input text to sanitize
 * @returns Sanitized text with HTML entities escaped
 */
export function escapeHtml(text: string): string {
    if (typeof text !== 'string') {
        return '';
    }

    return text.replace(/[&<>"'`=\/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Sanitizes user input by:
 * 1. Escaping HTML special characters
 * 2. Removing potential script injection patterns
 * 3. Trimming whitespace
 * 
 * @param input - The user input to sanitize
 * @param maxLength - Optional maximum length (default: 10000)
 * @returns Sanitized input
 */
export function sanitizeInput(input: string, maxLength: number = 10000): string {
    if (typeof input !== 'string') {
        return '';
    }

    let sanitized = input.trim();

    // Limit length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Escape HTML entities
    sanitized = escapeHtml(sanitized);

    return sanitized;
}

/**
 * Sanitizes a comment object
 * @param comment - Object with text property
 * @returns Object with sanitized text
 */
export function sanitizeComment(text: string): string {
    // Max comment length: 2000 characters
    return sanitizeInput(text, 2000);
}

/**
 * Sanitizes username
 * @param username - Username to sanitize
 * @returns Sanitized username
 */
export function sanitizeUsername(username: string): string {
    if (typeof username !== 'string') {
        return '';
    }

    // Only allow alphanumeric, underscore, dash (max 50 chars)
    return username
        .trim()
        .substring(0, 50)
        .replace(/[^a-zA-Z0-9_-]/g, '');
}
