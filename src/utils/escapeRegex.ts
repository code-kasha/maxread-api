// Prevents user input from being interpreted as regex syntax (ReDoS / injection safety)
export function escapeRegex(input: string): string {
	return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
