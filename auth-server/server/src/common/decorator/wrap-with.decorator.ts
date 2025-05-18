import 'reflect-metadata';

export type ExceptionWrapStrategy = (error: Error) => never;

const WRAPPED = Symbol('WRAPPED_BY_WRAPWITH');

function copyMetadata(source: object, target: object) {
	for (const key of Reflect.getMetadataKeys(source)) {
		const value = Reflect.getMetadata(key, source);
		Reflect.defineMetadata(key, value, target);
	}
}

function wrapMethod(
	target: any,
	key: string | symbol,
	strategy: ExceptionWrapStrategy,
) {
	const desc = Object.getOwnPropertyDescriptor(target, key);

	if (!desc || typeof desc.value !== 'function') return;

	const original = desc.value;
	if (Reflect.getOwnMetadata(WRAPPED, original)) return;

	const wrapped = async function (...args: any[]) {
		try {
			return await original.apply(this, args);
		} catch (err) {
			return strategy(err);
		}
	};

	copyMetadata(original, wrapped);
	Reflect.defineMetadata(WRAPPED, true, wrapped);

	desc.value = wrapped;
	Object.defineProperty(target, key, desc);
}

export function WrapWith(
	strategy: ExceptionWrapStrategy,
): ClassDecorator & MethodDecorator {
	return (
		target: any,
		propertyKey?: string | symbol,
		descriptor?: PropertyDescriptor,
	) => {
		if (descriptor) {
			wrapMethod(target, propertyKey!, strategy);
			return;
		}

		const proto = target.prototype;
		for (const key of Object.getOwnPropertyNames(proto)) {
			if (key === 'constructor') continue;
			wrapMethod(proto, key, strategy);
		}

		for (const key of Object.getOwnPropertyNames(target)) {
			if (['length', 'name', 'prototype'].includes(key)) continue;
			wrapMethod(target, key, strategy);
		}
	};
}
