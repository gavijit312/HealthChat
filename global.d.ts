// Type declarations for importing CSS files in TypeScript
declare module '*.css' {
	const content: { [className: string]: string } | string
	export default content
}
declare module '*.module.css' {
	const content: { [className: string]: string }
	export default content
}
declare module '*.scss' {
	const content: { [className: string]: string } | string
	export default content
}
declare module '*.module.scss' {
	const content: { [className: string]: string }
	export default content
}
declare module '*.sass' {
	const content: { [className: string]: string } | string
	export default content
}
declare module '*.module.sass' {
	const content: { [className: string]: string }
	export default content
}

export {}
