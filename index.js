"use strict";

var
	prelude = require('Prelude-js'),
	maybe = require('Data.Maybe-js');

/* ------------------------------------------------------------------------
 * BASIC FUNCTIONS
 * -----------------------------------------------------------------------*/

var index = function(i, L) {
	var start, lr, data;

	lr = goNext;
	if(i >= 0) {
		start = L.head();
	} else {
		i = i * (-1);
		start = L.last();
		lr = goPrev;
	}

	data = null;
	iterLRbreak(start, null, lr, function(v, ret) {
		if(i == 0) {
			ret.v = data = v.getData();
			return;
		}
		i -= 1;
	});

	return data;
}


var join = function() {
	/* join :: [a] -> [a] -> ... -> [a] */
	var l = new List();
	for(var v in arguments) {
		var argument = arguments[v];
		iterL(argument, null, function(v) {
			l.ins(v.getData());
		});
	}
	return l;
}



var head = function(L) {
	/* head :: [a] -> a */
	var h = L.head();
	if(h === null) {
		throw new Error('Head of an empty list.');
	}
	return h;
}



var last = function(L) {
	/* last :: [a] -> a */
	return L.last();
}



var tail = function(L) {
	/* tail :: [a] -> [a] */
	var rest = new List();

	if(L.size() != 0) {
		iterLR(L.head().getNext(), null, goNext, function(v) {
			rest.ins(v.getData());
		});
	}
	return rest;
}



var init = function(L) {
	/* init :: [a] -> [a] */
	var l = new List();

	iterL(L, L.last(), function(v) {
		l.ins(v.getData());
	});

	return l;
}



var nil = function(L) {
	/* nil :: [a] -> Boolean */
	return L.size() === 0;
}



var length = function(L) {
	/* length :: [a] -> Number */
	return size(L);
}



var size = function(L) {
	/* size :: [a] -> Number */
	return L.size();
}



/* ------------------------------------------------------------------------
 * LIST TRANSFORMATIONS
 * -----------------------------------------------------------------------*/



var map = function(fn, R, L) {
	/* map :: (a -> b) -> [a] -> [b] */
	if (!(R instanceof List)) {
		R = new List();
	}

	iterL(L, null, function(v) {
		R.ins(fn(v.getData()));
	});

	return R;
}



var reverse = function(L) {
	/* reverse :: [a] -> [a] */
	var l = new List();
	iterR(L, null, function(v) {
		l.ins(v.getData());
	});
	return l;
}



var intersperse = function(A, L) {
	/* intersperse :: a -> [a] -> [a] */
	if(L.size() < 2) return L;

	var l = new List();

	iterL(L, L.last(), function(v) {
		l.ins(v.getData());
		l.ins(A);
	});

	l.ins(L.last().getData());

	return l;
}



var intercalate = function(L, LL) {
	/* intercalate :: [a] -> [[a]] -> [a] */
	/* intercalate xs xss = concat $ intersperse xs xss) */
	return intersperse(L, LL).concat();
}



var transpose = function(LL) {
	/* transpose :: [[a]] -> [[a]] */
	return LL;
}



var subsequences = function(L) {
	/* subsequences :: [a] -> [[a]] */
}



var permutations = function(L) {
	/* permutations :: [a] -> [[a]] */
}



/* ------------------------------------------------------------------------
 * REDUCING LISTS
 * -----------------------------------------------------------------------*/



var foldl = function(fn, r, L) {
	/* foldl :: (a -> b -> a) -> a -> [b] -> a */
	iterL(L, null, function(v) {
		r = fn(r, v.getData());
	});
	return r;
}



var foldl1 = function(fn, L) {
	/* foldl1 :: (a -> a -> a) -> [a] -> a */
	return foldl(fn, L.head().getData(), tail(L));
}



var foldr = function(fn, r, L) {
	/* foldr :: (a -> b -> a) -> a -> [b] -> a */
	iterR(L, null, function(v) {
		r = fn(v.getData(), r);
	});
	return r;
}



var foldr1 = function(fn, L) {
	/* foldr1 :: (a -> a -> a) -> [a] -> a */
	return foldr(fn, L.last().getData(), init(L));
}



/* ------------------------------------------------------------------------
 * SPECIAL FOLDS
 * -----------------------------------------------------------------------*/



var concat = function() {
	/* concat :: [[a]] -> [a] */
	var l = new List();
	for(var z in arguments) {
		var LL = arguments[z];
		iterL(LL, null, function(v) {
			if(v.getData() instanceof List) {
				iterL(v.getData(), null, function(w) {
					l.ins(w.getData());
				});
			} else {
				l.ins(v.getData());
			}
		});
	}
	return l;
}



var concatMap = function(fn, r, L) {
	/* concatMap :: (a -> [b]) -> [a] -> [b] */
	return concat(map(fn, r, L));
}



var and = function(L) {
	/* and :: [Bool] -> Bool */
	return all(function(v) { return v == true; }, L);
}


var or = function(L) {
	/* or :: [Bool] -> Bool */
	return any(function(v) { return v == true; }, L);
}


var any = function(fn, L) {
	/* any :: (a -> Bool) -> [Bool] -> Bool */
	var truth = false;
	iterLbreak(L, null, function(v, ret) {
		if(fn(v.getData())) {
			ret.v = truth = true;
			return;
		}
	});
	return truth;
}



var all = function(fn, L) {
	/* all :: (a -> Bool) -> [Bool] -> Bool */
	var truth = true;
	iterLbreak(L, null, function(v, ret) {
		if(!fn(v.getData())) {
			ret.v = truth = false;
			return;
		}
	});
	return truth;
}



var sum = function(L) {
	/* sum :: [a] -> a */
	return accum(function(a,b) {
		return a + b;
	}, L);
}



var product = function(L) {
	/* product :: [a] -> a */
	return accum(function(a,b) {
		return a * b;
	}, L);
}



var accum = function(fn, L) {
	var r;
	iterL(L, null, function(v) {
		if(r == undefined) { r = v.getData(); }
		else { r = fn(r, v.getData()); }
	});
	return r;
}



var maximum = function(L) {
	/* maximum :: [a] -> a */

	/*
	return accum(function(a, b) {
		if(b > a) { return b; }
		else { return a; }
	}, L);
	*/

	return maximumBy(prelude.compare, L);
}



var maximumBy = function(fn, L) {
	/* maximumBy :: (a - a -> Ordering) -> [a] -> a */
	return accum(function(x, y) {
		var cmp = fn(x, y);
		switch(cmp) {
			case prelude.Ordering.GT: {
				return x;
			}
			default: {
				return y;
			}
		}
	}, L);
}



var minimum = function(L) {
	/* minimum :: [a] -> a */

	/*
	return accum(function(a, b) {
		if(b > a) { return a; }
		else { return b; }
	}, L);
	*/

	return minimumBy(prelude.compare, L);
}


var minimumBy = function(fn, L) {
	/* minimumBy :: (a - a -> Ordering) -> [a] -> a */
	return accum(function(x, y) {
		var cmp = fn(x, y);
		switch(cmp) {
			case prelude.Ordering.GT: {
				return y;
			}
			default: {
				return x;
			}
		}
	}, L);
}


/* ------------------------------------------------------------------------
 * SCANS
 * -----------------------------------------------------------------------*/

var scanl = function(fn, r, L) {
	var l = new List(r);
	iterL(L, null, function(v) {
		r = fn(r, v.getData());
		l.ins(r);
	});
	return l;
}



var scanl1 = function(fn, L) {
	return scanl(fn, L.head().getData(), tail(L));
}



var scanr = function(fn, r, L) {
	var l = new List();
	var o_r = r;
	iterR(L, null, function(v) {
		r = fn(r, v.getData());
		l.insHead(r);
	});
	l.ins(o_r);
	return l;
}



var scanr1 = function(fn, L) {
	return scanr(fn, L.last().getData(), init(L));
}



/* ------------------------------------------------------------------------
 * ACCUMULATING MAPS
 * -----------------------------------------------------------------------*/

var mapAccumL = function(fn, acc, L) {
	/* mapAccumL :: (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y]) */
	return mapAccumLR(L.head(), null, goNext, 'L', fn, acc, L);
}



var mapAccumR = function(fn, acc, L) {
	/* mapAccumR :: (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y]) */
	return mapAccumLR(L.last(), null, goPrev, 'R', fn, acc, L);
}



var mapAccumLR = function(start, end, lr, ins, fn, acc, L) {
	/* mapAccumR :: (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y]) */

	var l = new List();
	var tup = new Array(2);

	iterLR(start, end, lr, function(v) {
		var t = fn(acc, v.getData());
		acc = t[0];
		(ins == 'L' ? l.ins(t[1]) : l.insHead(t[1]));
	});

	tup[0] = acc;
	tup[1] = l;

	return tup;
}


/* ------------------------------------------------------------------------
 * INFINITE LISTS
 * -----------------------------------------------------------------------*/

var iterate = function(fn, x) {
	/* iterate :: (a -> a) -> a -> [a] */
}


var repeat = function(x) {
	/* repeat :: a -> [a] */
}


var replicate = function(n, x) {
	/* replicate :: Int -> a -> [a] */
	var l = new List();
	for(var i = 0 ; i < n ; i++) {
		l.ins(x);
	}
	return l;
}



var cycle = function(L) {
	/* cycle :: [a] -> [a] */
}




/* ------------------------------------------------------------------------
 * EXTRACTING SUBLISTS
 * -----------------------------------------------------------------------*/

var take = function(n, L) {
	/* take :: Number -> [a] -> [a] */
	var l = new List();
	iterLbreak(L, null, function(v, ret) {
		if(n == 0) {
			ret.v = true;
			return;
		}
		l.ins(v.getData());
		n = n - 1;
	});
	return l;
}



var drop = function(n, L) {
	/* drop :: Number -> [a] -> [a] */
	var l = new List();
	iterL(L, null, function(v) {
		if(n == 0) {
			l.ins(v.getData());
		} else {
			n = n - 1;
		}
	});
	return l;
}



var splitAt = function(n, L) {
	/* splitAt :: Int -> [a] -> ([a], [a]) */
	/*
	var tup = new Array(2);
	tup[0] = new List();
	tup[1] = new List();
	iterL(L, null, function(v) {
		if(n > 0) {
			tup[0].ins(v.getData());
			n = n - 1;
		} else {
			tup[1].ins(v.getData());
		}
	});
	return tup;
	*/
	var tup = new Array(2);
	tup[0] = take(n, L);
	tup[1] = drop(n, L);
	return tup;
}



var takeWhile = function(fn, L) {
	/* takeWhile :: (a -> Bool) -> [a] -> [a] */
	var l = new List();

	iterLbreak(L, null, function(v, ret) {
		if(fn(v.getData()) == false) {
			ret.v = false;
			return;
		}
		l.ins(v.getData());
	});

	return l;
}



var dropWhile = function(fn, L) {
	/* dropWhile : (a -> Bool) -> [a] -> [a] */
	var l = new List();

	iterLbreak(L, null, function(v, ret) {
		if(fn(v.getData()) == false) {
			ret.v = false;
			iterLR(v, null, goNext, function(w) {
				l.ins(w.getData());
			});
			return;
		}
	});

	return l;
}



var dropWhileEnd = function(fn, L) {
	/* dropWhileEnd :: (a -> Bool) -> [a] -> [a] */
	var l = new List();

	iterRbreak(L, null, function(v, ret) {
		if(fn(v.getData()) == false) {
			ret.v = false;
			iterLR(v, null, goPrev, function(w) {
				l.insHead(w.getData());
			});
		}
	});

	return l;
}



var span = function(fn, L) {
	/* span :: (a -> Bool) -> [a] -> ([a], [a]) */
	var tup = new Array(2);
	tup[0] = takeWhile(fn, L);
	tup[1] = dropWhile(fn, L);
	return tup;
}


var xbreak = function(fn, L) {
	/* break :: (a -> Bool) -> [a] -> ([a], [a]) */
	return span(function(x) {
		return fn(x) == true ? false : true;
	}, L);
}



var stripPrefix = function(P, L) {
	/* stripPrefix :: [a] -> [a] -> Maybe [a] */
	var truth, last_elm, cnt;
	truth = true;
	cnt = 0;

	iterLLbreak(P, null, L, null, function(x, y, ret) {
		last_elm = y.getNext();
		if(x.getData() !== y.getData()) {
			ret.v = truth = false;
			return;
		}
		cnt += 1;
	});

	if(truth == false || cnt != size(P) || !last_elm) {
		return new maybe.Nothing();
	}

	var stripped_list = new List();

	iterLR(last_elm, null, goNext, function(v) {
		stripped_list.ins(v.getData());
	});

	return new maybe.Just(stripped_list);
}



var group = function(L) {
	return groupBy(prelude.eq, L);
}

var groupBy = function(fn, L) {
	/* group :: [a] -> [[a]] */
	var grouped_list;

	grouped_list = new List();

	var datums = [];

	/* hideous */
	iterL(L, null, function(v) {
		var d = v.getData();
		if(datums.length > 0) {
			if(fn(datums[0], d)) {
				datums.push(d);
			} else {
				var l = new List();
				l.fromArray(datums);
				grouped_list.ins(l);
				datums = [];
				datums.push(d);
			}
		} else {
			datums.push(d);
		}
	});

	if(datums.length) {
		grouped_list.ins(new List(datums));
	}

	return grouped_list;
}



var inits = function(L) {
	/* inits :: [a] -> [[a]] */
	var l = new List();
	l.ins(new List());
	iterL(L, null, function(v) {
		l.ins(copyL(L, v.getNext()));
	});
	return l;
}





var tails = function(L) {
	/* tails :: [a] -> [[a]] */
	var l = new List();
	iterL(L, null, function(v) {
		l.ins(copyLR(v, null, goNext));
	});
	l.ins(new List());
	return l;
}


/* ------------------------------------------------------------------------
 * PREDICATES
 * -----------------------------------------------------------------------*/

var isPrefixOf = function(LA, LB) {
	/* isPrefixOf :: Eq a => [a] -> [a] -> Bool */
	var truth = true;
	iterLLbreak(LA, LA.last(), LB, LB.last(), function(x, y, ret) {
		if(x.getData() !== y.getData()) {
			ret.v = truth = false;
			return;
		}
	});
	return truth;
}


var isSuffixOf = function(LA, LB) {
	/* isSuffixOf :: Eq a => [a] -> [a] -> Bool */
	var truth = true;
	iterRRbreak(LA, LA.head(), LB, LB.head(), function(x, y, ret) {
		if(x.getData() !== y.getData()) {
			ret.v = truth = false;
			return;
		}
	});
	return truth;
}



var isInfixOf = function(LA, LB) {
	/* isInfixOf :: Eq a => [a] -> [a] -> Bool */
	var truth = false;
	iterLbreak(LB, LB.last(), function(v, xret) {
		var subtruth = iterLLRRbreak(LA.head(), LA.last(), v, null, goNext, goNext, function(x, y, yret) {
			if(x.getData() !== y.getData()) {
				yret.v = false;
				return;
			}
		});
		if(subtruth !== false) {
			xret.v = truth = true;
			return;
		}
	});
	return truth;
}




/* ------------------------------------------------------------------------
 * Equality
 * -----------------------------------------------------------------------*/

var elem = function(a, L) {
	/* elem :: Eq a => a -> [a] -> Bool */
	/*
	var truth = false;
	iterLbreak(L, null, function(v, ret) {
		if(v.getData() == a) {
			ret.v = truth = true;
			return;
		}
	});
	return truth;
	*/
	return elemBy(prelude.eq, a, L);
}

var elemBy = function(fn, a, L) {
	var truth = false;
	iterLbreak(L, null, function(v, ret) {
		if(fn(a, v.getData()) == true) {
			ret.v = truth = true;
			return;
		}
	});
	return truth;
}


var notElem = function(a, L) {
	/* notElem :: Eq a => a -> [a] -> Bool */
	var truth = true;
	iterLbreak(L, null, function(v, ret) {
		if(v.getData() == a) {
			ret.v = truth = false;
			return;
		}
	});
	return truth;
}


var lookup = function(a, L) {
	/* lookup :: Eq a => a -> [(a, b)] -> Maybe b */
	var r = new maybe.Nothing();
	iterLbreak(L, null, function(v, ret) {
		var tup = v.getData();
		if(tup[0] === a) {
			ret.v = true;
			r = new maybe.Just(tup[1]);
			return;
		}
	});
	return r;
}


/* ------------------------------------------------------------------------
 * Searching with a predicate
 * -----------------------------------------------------------------------*/

var find = function(fn, L) {
	/* find :: (a -> Bool) -> [a] -> Maybe a */

	var data, truth;

	truth = false;
	iterLbreak(L, null, function(v, ret) {
		if(fn(v.getData())) {
			ret.v = truth = true;
			data = v.getData();
			return;
		}
	});
	return (truth == true ? new maybe.Just(data) : new maybe.Nothing());
}

var filter = function(fn, L) {
	/* filter :: (a -> Bool) -> [a] -> [a] */
	var l = new List();
	iterL(L, null, function(v) {
		if(fn(v.getData())) {
			l.ins(v.getData());
		}
	});
	return l;
}

var partition = function(fn, L) {
	/* partition :: (a -> Bool) -> [a] -> ([a], [a]) */
	/* partition p xs = (filter p xs, filter (not . p) xs) */
	return [filter(fn, L), filter(function(a){return(fn(a)==true?false:true);}, L)]
}

var ix = function(L, i) {
	/* (!!) :: [a] -> Int -> a */
	return index(i, L);
}

var elemIndex = function(a, L) {
	/* elemIndex :: Eq a => a -> [a] -> Maybe Int */
	var truth, cnt;
	truth = false;
	cnt = 0;
	iterLbreak(L, null, function(v, ret) {
		if(v.getData() === a) {
			ret.v = truth = true;
			return;
		}
		cnt = cnt + 1;
	});
	return (truth == true ? new maybe.Just(cnt) : new maybe.Nothing());
}

var elemIndices = function(a, L) {
	/* elemIndices :: Eq a => a -> [a] -> [Int] */
	var truth, cnt, indices;
	truth = false;
	cnt = 0;
	indices = new List();

	iterL(L, null, function(v) {
		if(v.getData() === a) {
			indices.ins(cnt);
		}
		cnt = cnt + 1;
	});
	return indices;
}

var findIndex = function(fn, L) {
	/* findIndex :: (a -> Bool) -> [a] -> Maybe Int */
	var truth, cnt;

	truth = false;
	cnt = 0;
	iterLbreak(L, null, function(v, ret) {
		if(fn(v.getData())) {
			ret.v = truth = true;
			return;
		}
		cnt = cnt + 1;
	});
	return (truth == true ? new maybe.Just(cnt) : new maybe.Nothing());
}

var findIndices = function(fn, L) {
	/* findIndices :: (a -> Bool) -> [a] -> [Int] */
	var truth, cnt, indices;
	truth = false;
	cnt = 0;
	indices = new List();

	iterL(L, null, function(v) {
		if(fn(v.getData())) {
			indices.ins(cnt);
		}
		cnt = cnt + 1;
	});
	return indices;
}


/* zippers */
var zip = function(A, B) {
	var l = new List();
	iterLL(A, null, B, null, function(x, y) {
		l.ins([x.getData(), y.getData()]);
	});
	return l;
}

var zipN = function() {
	var l;

	var l = new List();
	iterLarray(arguments, function(arr) {
		var bigTup = [];
		for(var i = 0; i < arr.length; i++) {
			bigTup[i] = arr[i].getData();
		}
		l.ins(bigTup);
	});
	return l;
}

var zipWith = function(fn, A, B) {
	var l = new List();
	iterLL(A, null, B, null, function(x, y) {
		l.ins(fn(x.getData(), y.getData()));
	});
	return l;
}

var zipWithN = function(fn) {
	var l, limit;

	var l = new List();
	delete(arguments[0]);
	iterLarray(arguments, function(arr) {
		var arrx = [], i=0;
		for(var v in arr) {
			arrx[i] = arr[v].getData();
			i++;
		}
		var ret = fn.apply(null, arrx);
		l.ins(ret);
	});
	return l;
}

var unzip = function(L) {
	/* unzip :: [(a, b)] -> ([a], [b]) */
	var tup = new Array(2);
	tup[0] = new List();
	tup[1] = new List();
	iterL(L, null, function(v) {
		tup[0].ins(v.getData()[0]);
		tup[1].ins(v.getData()[1]);
	});
	return tup;
}

var unzipN = function(L) {
	/* unzipN :: [(a,b,c)] -> ([a], [b], [c]) */
	var tup = [];
	iterL(L, null, function(v) {
		var arr = v.getData();
		for (var w in arr) {
			if(tup[w] == undefined) {
				tup[w] = new List();
			}
			tup[w].ins(arr[w]);
		}
	});
	return tup;
}


/* Functions on strings */

// fixme, add these to another library

var isNewline = function(ch) {
	return (ch === 10 || ch === 13);
//	return /\x0a|\x0d/.test(ch);
}

var isSpace = function(ch) {
	return (ch === 32 || ch > 8 && ch < 14);
//	return /\x20|\x09-\x13/.test(ch);
}

var token_splitter = function(L, tokenFn) {
	var l = new List();
	if(typeof(L) == 'string') {
		var sub = new List();
		for(var v in L) {
			if(tokenFn(L[v].charCodeAt(0))) {
				if(size(sub) !== 0) {
					l.ins(sub);
					sub = new List();
				}
			} else {
				sub.ins(L[v]);
			}
		}
		if(size(sub) !== 0) {
			l.ins(sub);
		}
	} else if(L instanceof List) {
		var sub = new List();
		iterL(L, null, function(v) {
			if(tokenFn(v.getData().charCodeAt(0))) {
				if(size(sub) !== 0) {
					l.ins(sub);
					sub = new List();
				}
			} else {
				sub.ins(v.getData());
			}
		});
		if(size(sub) !== 0) {
			l.ins(sub);
		}
	} else {
		throw Error('Unknown argument type');
	}
	return l;
}

var lines = function(L) {
	/* lines :: String -> [String] */
	return token_splitter(L, isNewline);
}

var words = function(L) {
	/* words :: String -> [String] */
	return token_splitter(L, isSpace);
}

var token_rejoicer = function(L, token) {
	var s, l;
	s = '';
	iterL(L, null, function(v) {
		if(v.getNext() == null && token !== '\n') {
			s = s + v.getData();
		} else {
			s = s + v.getData() + token;
		}
	});
	l = fromStr(s);

	return l;
}

var unlines = function(L) {
	/* unlines :: [String] -> String */
	return token_rejoicer(L, '\n');
}

var unwords = function(L) {
	/* unwords :: [String] -> String */
	return token_rejoicer(L, ' ');
}


/* Set operations */

var nub = function(L) {
	/* nub :: Eq a => [a] -> [a] */
	return nubBy(prelude.eq, L);
}

var nubBy = function(fn, L) {
	/* nubBy :: (a -> a -> Bool) -> [a] -> [a] */
	var l = new List();
	iterL(L, null, function(v) {
		if(elemBy(fn, v.getData(), l) == false) {
			l.ins(v.getData());
		}
	});
	return l;
}

var _delete = function(a, L) {
	/* delete :: (Eq a) => a -> [a] -> [a] */
	return deleteBy(prelude.eq, a, L);
}

var deleteBy = function(fn, a, L) {
	/* deleteBy :: (a -> a -> Bool) -> a -> [a] -> [a] */
	var l = new List();
	iterLbreak(L, null, function(v, ret) {
		if(fn(a, v.getData())) {
			ret.v = true;
			iterLR(v.getNext(), null, goNext, function(w) {
				l.ins(w.getData());
			});
		} else {
			l.ins(v.getData());
		}
	});
	return l;
}

var deleteFirstsBy = function(fn, A, B) {
	/* deleteFirstsBy :: (a -> a -> Bool) -> [a] -> [a] -> [a] */
	/* how does this work? lmao */
}

var difference = function(A, B) {
	/* (\\) :: Eq a => [a] -> [a] -> [a] */
	return foldl(function(a,b){return prelude.flip(_delete,a,b);}, A, B);
}

var union = function(A, B) {
	/* union :: Eq a => [a] -> [a] -> [a] */
	return unionBy(prelude.eq, A, B);
}

var unionBy = function(fn, xs, ys) {
	/* unionBy :: (a -> a -> Bool) -> [a] -> [a] -> [a] */
	/* unionBy eq xs ys = xs ++ foldl (flip (deleteBy eq)) (nubBy eq ys) xs */
	return join(xs, foldl(
		function(a,b) {
			return deleteBy(fn, b, a);
		},
		nubBy(prelude.eq, ys), xs));
}

var intersect = function(A, B) {
	/* intersect :: Eq a => [a] -> [a] -> [a] */
	return intersectBy(prelude.eq, A, B);
}

var intersectBy = function(fn, A, B) {
	/* intersectBy :: (a -> a -> Bool) -> [a] -> [a] -> [a] */
	/* intersectBy eq xs ys = [x | x <- xs, any (eq x) ys] */
	var l = new List();
	iterL(A, null, function(v) {
		var vd = v.getData();
		if(any(function(x){return fn(vd, x);}, B)) {
			l.ins(vd);
		}
	});
	return l;
}

var insert = function(a, L) {
	/* insert :: Ord a => a -> [a] -> [a] */
	return insertBy(prelude.compare, a, L);
}

var insertBy = function(fn, a, L) {
	/* insertBy :: (a -> a -> Ordering) -> a -> [a] -> [a] */
	/* insertBy cmp x ys@(y:ys') = case cmp x y of GT -> y : insertBy cmp x ys'_  -> x : ys */
	if (size(L) == 0) {
		return new List(a);
	}
	var l = new List();
	iterLbreak(L, null, function(v, ret) {
		var cmp = fn(a, v.getData());
		switch(cmp) {
			case prelude.Ordering.GT: {
				l.ins(v.getData());
				return;
			}
			default: {
				ret.v = true;
				l.ins(a);
				iterLR(v, null, goNext, function(w) {
					l.ins(w.getData());
				});
				return;
			}
		}
	}, function() {
		l.ins(a);
	});
	return l;
}


var sort = function(L) {
	/* sort :: (Ord a) => [a] -> [a] */
	return sortBy(prelude.compare, L);
}

var sortBy = function(fn, L) {
	/* sortBy :: (a -> a -> Ordering) -> [a] -> [a] */
	return foldr(
		function(v, r) {
			return insertBy(fn, v, r);
		}
		, new List(), L);
}

/* stuff to make our lives easier */


var chain = function() {
	var d = arguments[0];
	for(var v = 1; v < arguments.length; v += 1) {
		var fn = arguments[v];
		d = fn(d);
	}
	return d;
}



var fromStr = function() {
	var l = new List();
	for (var v = 0; v < arguments.length; v++) {
		var str = arguments[v];
		for(var w = 0; w < str.length; w++) {
			l.ins(str[w]);
		}
	}
	return l;
}


var copyL = function(L, last) {
	return copyLR(L.head(), last, goNext);
}



var copyR = function(L, last) {
	return copyLR(L.tail(), last, goPrev);
}



var copyLR = function(start, last, lr) {
	var l = new List();
	iterLR(start, last, lr, function(v) {
		l.ins(v.getData());
	});
	return l;
}



var iterL = function(L, last, fn) {
	return iterLR(L.head(), last, goNext, fn);
}



var iterR = function(L, last, fn) {
	return iterLR(L.last(), last, goPrev, fn);
}



var iterLR = function(start, last, lr, fn) {
	/* second argument to fn can be used to break the loop and return the specific value */
	for(var v = start; v != last; v = lr(v)) {
		fn(v);
	}
}


var iterLarray = function(array, fn) {
//	for(var i = 0; i < array.length; i++) { array[i] = array[i].head(); }
	for(var v in array) { array[v] = array[v].head(); }
	return iterLRarray(array, goNext, fn);
}

var iterRarray = function(array, fn) {
//	for(var i = 0; i < array.length; i++) { array[i] = array[i].last(); }
	return iterLRarray(array, goPrev, fn);
}

var iterLRarray = function(array, lr, fn) {
	while(true) {
		/*
		for (var i = 0; i < array.length; i++) {
			if(array[i] == null) return;
		}
		fn(array);
		for (var i = 0; i < array.length; i++) {
			array[i] = lr(array[i]);
		}
		*/
		for(var v in array) {
			if(array[v] == null) return;
		}
//		var arr = array.map(function(x){return x.getData()});
		fn(array);
		for(var v in array) {
			array[v] = lr(array[v]);
		}
	}
}


var iterLL = function(LA, LAlast, LB, LBlast, fn) {
	return iterLLRR(LA.head(), LAlast, LB.head(), LBlast, goNext, goNext, fn);
}



var iterRR = function(LA, LAlast, LB, LBlast, fn) {
	return iterLLRR(LA.last(), LAlast, LB.last(), LBlast, goPrev, goPrev, fn);
}



var iterLLRR = function(LAstart, LAlast, LBstart, LBlast, alr, blr, fn) {
	/* can traverse two lists in either direction etc .. */
	var ret = {};
	for(var v = LAstart, w = LBstart; v != LAlast && w != LBlast; v = blr(v), w = blr(w)) {
		fn(v, w);
	}
}


var iterLbreak = function(L, last, fn, defaultcb) {
	return iterLRbreak(L.head(), last, goNext, fn, defaultcb);
}



var iterRbreak = function(L, last, fn, defaultcb) {
	return iterLRbreak(L.last(), last, goPrev, fn, defaultcb);
}



var iterLRbreak = function(start, last, lr, fn, defaultcb) {
	/* second argument to fn can be used to break the loop and return the specific value */
	var ret = {};
	for(var v = start; v != last; v = lr(v)) {
		fn(v, ret);
		if(ret.v != undefined) {
			return ret.v;
		}
	}
	/* must have fallen through to the default cb: exec if exists */
	if(defaultcb) {
		defaultcb();
	}
}



var iterLLbreak = function(LA, LAlast, LB, LBlast, fn) {
	return iterLLRRbreak(LA.head(), LAlast, LB.head(), LBlast, goNext, goNext, fn);
}



var iterRRbreak = function(LA, LAlast, LB, LBlast, fn) {
	return iterLLRRbreak(LA.last(), LAlast, LB.last(), LBlast, goPrev, goPrev, fn);
}



var iterLLRRbreak = function(LAstart, LAlast, LBstart, LBlast, alr, blr, fn) {
	/* can traverse two lists in either direction etc .. */
	/* second argument to fn can be used to break the loop and return the specific value */
	var ret = {};
	for(var v = LAstart, w = LBstart; v != LAlast && w != LBlast; v = blr(v), w = blr(w)) {
		fn(v, w, ret);
		if(ret.v != undefined) {
			return ret.v;
		}
	}
}


var goPrev = function(v) {
	return v.getPrev();
}



var goNext = function(v) {
	return v.getNext();
}


var range = function(x, y) {
	var l = new List();
	var iter, end;

	if(x > y) {
		iter = function(k) {
			k = k - 1;
			return k;
		}
		end = y - 1;
	} else if (x < y) {
		iter = function(k) {
			k = k + 1;
			return k;
		}
		end = y + 1;
	} else {
		l.ins(x);
		return l;
	}

	for(; x !== end; x = iter(x)) {
		l.ins(x);
	}

	return l;
}



/* list obj */

var List = function() {
	/* private :: elements */
	var head = null;
	var last = null;
	var size = 0;

	this.size = function() {
		return size;
	}

	this.ins = function(arg) {
		/* insert data */
		return(this.insLast(arg));
	}

	this.insAfter = function() {
		/* insert data */
	}

	this.insHead = function(data) {
		/* insert data */
		var element = new ListElement(data);
		return this.insListElmHead(element);
	}

	this.insLast = function(data) {
		/* insert data */
		var element = new ListElement(data);
		return this.insListElm(element);
	}

	this.insListElm = function(E) {
		if(head === null || last === null) {
			head = last = E;
		} else {
			var last_prev = last;
			last = E;
			last_prev.setNext(E);
			E.setPrev(last_prev);
		}
		size += 1;
		return E;
	}

	this.insListElmHead = function(E) {
		if(head === null || last === null) {
			head = last = E;
		} else {
			var head_prev = head;
			head = E;
			head.setNext(head_prev);
		}
		size += 1;
		return E;
	}

	this.rem = function(element) {
		/* del element */
		if(head === null || last === null) {
			return false;
		}
		var element_prev = element.getPrev();
		var element_next = element.getNext();
		if(element_prev != null) {
			element_prev.setNext(element_next);
		}

		if(element_next != null) {
			element_next.setPrev(element_prev);
		}

		if(element === head) {
			head = element_next;
		} else if(element === last) {
			last = element_prev;
		}

		element = {};
		size -= 1;
		return true;
	}

	this.head = function() {
		return head;
	}

	this.last = function() {
		return last;
	}

	this.fromArgs = function() {
		return this.fromArray(arguments);
	}

	this.fromArray = function(arr) {
		/* insert data */
		var results = [];
		for (var v in arr) {
			var arg = arr[v];
//			var element = this.insLast(arg);
			this.ins(arg);
		}
		return;
	}

	this.toArrayL = function() {
		return this.toArrayLR(head, function(v) { return v.getNext(); });
	}

	this.toArrayR = function() {
		return this.toArrayLR(last, function(v) { return v.getPrev(); });
	}

	this.toArrayLR = function(start, lr) {
		var results = [];
		for(var v = start; v != null; v = lr(v)) { results.push(v.getData()); }
		return results;
	}

	this.empty = function() {
		head = null;
		last = null;
	}

	this.dumpL = function() {
		return this.dumpLR(head, function(v) { return v.getNext(); });
	}

	this.dumpR = function() {
		return this.dumpLR(last, function(v) { return v.getPrev(); });
	}

	this.dumpLR = function(start, lr) {
		var index, banner;

		index = 0;
		banner = function() { console.log("---------------------"); }

		banner();
		for(var v = start; v != null; v = lr(v)) {
			var element = v;
			console.log(index+":"+element.getData());
			index+=1;
		}
		banner();
	}

	this.isList = function() {
		return true;
	}

	this.join = function(L) {
		if(!L.isList()) {
			throw new Error('Unable to join non-lists');
		}
		return this.insListElm(L.head());
	}

	this.toString = function() {
		var s_arr = [];
		this.iterL(null, function(v) {
			s_arr.push(v.getData().toString());
		});
		return s_arr.join('').toString();
	}

	/* helper methods for chaining */
	this.concat = function() {
		return concat(this);
	}

	/* iterator stuff */
	this.iterL = function(last, fn) {
		return this.iterLR(this.head(), last, goNext, fn);
	}

	this.iterR = function(last, fn) {
		return this.iterLR(this.last(), last, goPrev, fn);
	}

	this.iterLR = function(start, last, lr, fn) {
		for(var v = start; v != last; v = lr(v)) {
			fn(v);
		}
	}

	var goPrev = function(v) {
		return v.getPrev();
	}

	var goNext = function(v) {
		return v.getNext();
	}

	var init = function(t, arr) {
		t.fromArray(arr);
	}

	init(this, arguments);
}



var ListElement = function(datum) {
	var data = null;
	var next = null;
	var prev = null;

	this.init = function(datum) {
		data = datum;
		return this;
	}

	this.getData = function() { return data; }
	this.setData = function(datum) { data = datum; }

	this.getNext = function() { return next; }
	this.setNext = function(anext) { next = anext; }

	this.getPrev = function() { return prev; }
	this.setPrev = function(aprev) { prev = aprev; }

	return this.init(datum);
}




module.exports = {
	List : List,
	ListElement : ListElement,
	/* basic functions */
	index : index,
	join : join,
	head : head,
	last : last,
	tail : tail,
	init : init,
	nil : nil,
	length : length,
	size : size,
	/* list transformations */
	map : map,
	reverse : reverse,
	intersperse : intersperse,
	intercalate : intercalate,
	transpose : transpose,
	subsequences : subsequences,
	permutations : permutations,
	/* reductions */
	foldl : foldl,
	foldl1 : foldl1,
	foldr : foldr,
	foldr1 : foldr1,
	/* special folds */
	concat : concat,
	concatMap : concatMap,
	and : and,
	or : or,
	any : any,
	all : all,
	sum : sum,
	product : product,
	maximum : maximum,
	minimum : minimum,
	/* scans */
	scanl : scanl,
	scanl1 : scanl1,
	scanr : scanr,
	scanr1 : scanr1,
	/* accumulating maps */
	mapAccumL : mapAccumL,
	mapAccumR : mapAccumR,
	/* infinite lists */
	iterate : iterate,
	repeat : repeat,
	replicate : replicate,
	cycle : cycle,
	/* extracting sublists */
	take : take,
	drop : drop,
	splitAt : splitAt,
	takeWhile : takeWhile,
	dropWhile : dropWhile,
	dropWhileEnd : dropWhileEnd,
	span : span,
	xbreak : xbreak,
	stripPrefix : stripPrefix,
	group : group,
	inits : inits,
	tails : tails,
	/* predicates */
	isPrefixOf : isPrefixOf,
	isSuffixOf : isSuffixOf,
	isInfixOf : isInfixOf,
	/* search by equality */
	elem : elem,
	notElem : notElem,
	lookup : lookup,
	/* searching with a predicate */
	find : find,
	filter : filter,
	partition : partition,
	ix : ix,
	elemIndex : elemIndex,
	elemIndices : elemIndices,
	findIndex : findIndex,
	findIndices : findIndices,
	/* zipping and unzipping lists */
	zip : zip,
	zipN : zipN,
	zipWith : zipWith,
	zipWithN : zipWithN,
	unzip : unzip,
	unzipN : unzipN,
	/* functions on strings */
	lines : lines,
	words : words,
	unlines : unlines,
	unwords : unwords,
	/* set operations */
	nub : nub,
	_delete : _delete,
	difference : difference,
	union : union,
	intersect : intersect,
	sort : sort,
	insert : insert,
	nubBy : nubBy,
	deleteBy : deleteBy,
	unionBy : unionBy,
	intersectBy : intersectBy,
	deleteFirstsBy : deleteFirstsBy,
	groupBy : groupBy,
	sortBy : sortBy,
	insertBy : insertBy,
	maximumBy : maximumBy,
	minimumBy : minimumBy,
	/* other, iterators */
	iterL : iterL,
	iterR : iterR,
	chain : chain,
	fromStr : fromStr,
	fromString : fromStr,
	range : range
	/* add catMaybes, mapMaybe, maybeToList, listToMaybe */
}
