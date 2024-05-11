
/**
 * Memoize (by reference on the input parameter) the given arity 1 function.
 * 
 * * the input parameter must be an `object` (so it can be used as a key to 
 * `WeakMap` and thus garbage collected later)
 */
function memoize<T extends object, U>(f: (a: T) => U): (a: T) => U {
	const results = new WeakMap<T,U>();
	
	return function(t: T): U {
		let r = results.get(t);
		if (r !== undefined) {
			//console.log('cache hit');
			return r; 
		}

		//console.log('cache miss');
		r = f(t);
		results.set(t, r);
		
		return r;
	}
}


export { memoize }
