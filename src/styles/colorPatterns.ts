
/**
 * Color Styling Patterns
 * 
 * Primary Color (Pink):
 * - Use `text-primary [&]:!text-primary` for text that needs to match the primary color
 * - This combination:
 *   1. Sets the base color with text-primary
 *   2. Uses [&]:!text-primary to increase specificity and override conflicting styles
 * 
 * Example usage:
 * <h1 className="text-primary [&]:!text-primary">Pink Heading</h1>
 */

// Export constant to make the file a module
export const PRIMARY_COLOR_PATTERN = 'text-primary [&]:!text-primary';

