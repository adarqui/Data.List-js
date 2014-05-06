var assert = require('assert'),
	vows = require('vows'),
	list = require('./index.js'),
	prelude = require('Prelude-js');

vows.describe('Data.List.js').addBatch({
	'an empty list': {
		topic: new list.List(),
		'head()': {
			topic: function(topic) { return list.head(topic) },
			'returns null if empty': function(topic) {
				assert.equal(topic, null);
			}
		},
		'last()': {
			topic: function(topic) { return list.last(topic) },
			'returns null if empty': function(topic) {
				assert.equal(topic, null);
			}
		},
		'tail()': {
			topic: function(topic) { return list.tail(topic) },
			'returns null if empty': function(topic) {
				assert.equal(list.empty(topic), true);
			}
		},
		'init()': {
			topic: function(topic) { return list.init(topic) },
			'generates an error': function(topic) {
				assert.throws(topic, Error);
			}
		},
		'nil() should return true': function(topic) {
			assert.equal(list.nil(topic), true);
		},
		'size() should return 0': function(topic) {
			assert.equal(list.size(topic), 0);
		},
		'reverse()': {
			topic: function(topic) { return list.reverse(topic); },
			'returns an empty list': function(topic) {
				assert.equal(list.size(topic), 0);
			}
		},
		'map()': {
			topic: function(topic) { return list.map(function(a){return a+1;},null,topic); },
			'returns an empty list': function(topic) {
				assert.equal(list.size(topic), 0);
			}
		},
		'intersperse()': {
			topic: function(topic) { return list.intersperse(',', topic); },
			'returns an empty list': function(topic) {
				assert.equal(list.size(topic), 0);
			}
		}
	},
	'a list with one element: [1]': {
		topic: function() {
			var l = new list.List(1);
			return l;
		},
		'head should be 1': function(topic) {
			assert(list.head(topic), 1);
		},
		'tail should return an empty list' : function(topic) {
			assert.equal(list.size(list.tail(topic)), 0);
		},
		'init should return an empty list' : function(topic) {
			assert.equal(list.size(list.init(topic)), 0);
		},
		'is not nil()' : function(topic) {
			assert.equal(list.nil(topic), false);
		},
		'reverse()': {
			topic: function(topic) { return list.reverse(topic); },
			'reverse should return the same list': function(topic) {
				assert.equal(topic.head().getData(), 1);
			}
		},
		'intersperse()': {
			topic: function(topic) { return list.intersperse(',', topic); },
			'should return the same list': function(topic) {
				assert.equal(topic.size(), 1);
				assert.equal(topic.head().getData(), 1);
			}
		}
	},
	'a list consisting of 3 elements: [1, 2, 3]': {
		topic: function() {
			var l = new list.List(1,2,3);
			return l;
		},
		'nil() should be false': function(topic) {
			assert.equal(list.nil(topic), false);
		},
		'size() should be 3': function(topic) {
			assert.equal(list.size(topic), 3);
			assert.equal(list.length(topic), 3);
		},
		'index(1) should be 2': function(topic) {
			assert.equal(list.index(1, topic), 2);
		},
		'tail()': {
			topic: function(topic) { return list.tail(topic); },
			'tail() should return [2, 3]': function(topic) {
				assert.equal(topic.head().getData(), 2);
				assert.equal(topic.last().getData(), 3);
			}
		},
		'init()': {
			topic: function(topic) { return list.init(topic); },
			'size() should be 2': function(topic) {
				assert.equal(list.size(topic), 2);
				assert.equal(topic.size(), 2);
			},
			'init() should return [1, 2]': function(topic) {
				assert.equal(topic.head().getData(), 1);
				assert.equal(topic.last().getData(), 2);
			}
		},
		'map()': {
			topic: function(topic) { return list.map(function(a) { return a+1; }, null, topic); },
			'map() with fn(a) { ret a+1 } should equal [2, 3, 4]': function(topic) {
				assert.equal(topic.head().getData(), 2);
				assert.equal(topic.last().getData(), 4);
			}
		},
		'reverse()': {
			topic: function(topic) { return list.reverse(topic); },
			'reverse() should return [3, 2, 1]': function(topic) {

			}
		},
		'intersperse()': {
			topic: function(topic) { return list.intersperse(',', topic); },
			'should return [1, "," , 2,  "," , "3"]': function(topic) {
				assert.equal(topic.toString(), "1,2,3");
			}
		}
	},
	'a join of two lists: join([1],[2])': {
		topic: function() {
			var la = new list.List(1);
			var lb = new list.List(2);
			return list.join(la, lb);
		},
		'should result in one list of size 2': function(topic) {
			assert.equal(list.size(topic), 2);
		}
	},
	'a join of two lists: join([1,2,3],[4,5,6])': {
		topic: function() {
			var la = new list.List(1,2,3);
			var lb = new list.List(4,5,6);
			return list.join(la, lb);
		},
		'should result in one list of size 6': function(topic) {
			assert.equal(list.size(topic), 6);
		},
		'should return [1,2,3,4,5,6]': function(topic) {
			assert.equal(topic.toString(), '123456');
		}
	},
	'a join of a list and a non-list: join([1], 1)': {
		topic: function() {
			var la = new list.List(1);
			return list.join(la, 1);
		},
		'should throw an error': function(topic) {
			assert.throws(topic, Error);
		}
	},
	'a list of lists: [[1,2,3],[4,5,6],[7,8,9]]': {
		topic: function() {
			var la = new list.List(1,2,3);
			var lb = new list.List(4,5,6);
			var lc = new list.List(7,8,9);
			return new list.List(la, lb, lc);
		},
		'size() should be 3': function(topic) {
			assert.equal(list.size(topic), 3);
		},
		'concat()': {
			topic: function(topic) { return list.concat(topic); },
			'should return one list of [1,2,3,4,5,6,7,8,9]': function(topic) {
				assert.equal(topic.toString(), "123456789");
			}
		},
		'intercalate()': {
			topic: function(topic) {
				var l = new list.List(9);
				return list.intercalate(l, topic);
			},
			'should return [1,2,3,9,4,5,6,9,7,8,9]': function(topic) {
				assert.equal(topic.toString(), "12394569789");
			}
		},
		'chain()': {
			topic: function(topic) {
				var l = new list.List(9);
				return list.chain(topic, function(v) {
					return list.intersperse(l, v);
				}, list.concat);
			},
			'should return [1,2,3,9,4,5,6,9,7,8,9]': function(topic) {
				assert.equal(topic.toString(), "12394569789");
			}
		},
		'a list of true boolean values: [true,true,true]': {
			topic: function() {
				return new list.List(true,true,true);
			},
			'and()': {
				topic: function(topic) {
					return list.and(topic);
				},
				'should return true': function(topic) {
					assert.equal(topic, true);
				}
			},
			'all()': {
				topic: function(topic) {
					return list.all(function(v){return v == true;}, topic);
				},
				'should return true': function(topic) {
					assert.equal(topic, true);
				}
			},
			'or()': {
				topic: function(topic) {
					return list.or(topic);
				},
				'should return true': function(topic) {
					assert.equal(topic, true);
				}
			},
			'any()': {
				topic: function(topic) {
					return list.any(function(v){return v == false;}, topic);
				},
				'should return false': function(topic) {
					assert.equal(topic, false);
				}
			},
		},
		'a list of mostly true boolean values: [true,false,true]': {
			topic: function() {
				return new list.List(true,false,true);
			},
			'and()': {
				topic: function(topic) {
					return list.and(topic);
				},
				'should return false': function(topic) {
					assert.equal(topic, false);
				}
			},
			'all()': {
				topic: function(topic) {
					return list.all(function(v){return v == true;}, topic);
				},
				'should return false': function(topic) {
					assert.equal(topic, false);
				}
			},
			'or()': {
				topic: function(topic) {
					return list.or(topic);
				},
				'should return true': function(topic) {
					assert.equal(topic, true);
				}
			},
			'any()': {
				topic: function(topic) {
					return list.any(function(v){return v == true;}, topic);
				},
				'should return true': function(topic) {
					assert.equal(topic, true);
				}
			},
		},
		'a list of 4 numbers: [1, 2, 3, 4]': {
			topic: function() {
				return new list.List(1, 2, 3, 4);
			},
			'sum()': {
				topic: function(topic) {
					return list.sum(topic);
				},
				'should return 10': function(topic) {
					assert.equal(topic, 10);
				}
			},
			'product()': {
				topic: function(topic) {
					return list.product(topic);
				},
				'should return 24': function(topic) {
					assert.equal(topic, 24);
				}
			},
			'maximum()': {
				topic: function(topic) {
					return list.maximum(topic);
				},
				'should return 4': function(topic) {
					assert.equal(topic, 4);
				}
			},
			'minimum()': {
				topic: function(topic) {
					return list.minimum(topic);
				},
				'should return 1': function(topic) {
					assert.equal(topic, 1);
				}
			}
		}
	}
}).run();


/* zvon.org examples */

/*
 * http://zvon.org/other/haskell/Outputprelude/
 * http://zvon.org/other/haskell/Outputlist/
 */

vows.describe('Data.List-js::concat,concatMap,sum,product,maximum,minimum').addBatch({
	/* http://zvon.org/other/haskell/Outputprelude/sum_f.html */
	'concat [[1,2,3], [4,5,6]]': {
		topic: function() {
			var la = new list.List(1,2,3);
			var lb = new list.List(4,5,6);
			return list.concat(la, lb);
		},
		'should return [1,2,3,4,5,6]': function(topic) {
			assert.equal(topic.toString(), '123456');
		}
	},
	'concatMap (\\x -> [(x,x+2,x/2)] [1,3,5])': {
		topic: function() {
			var l = new list.List(1,3,5);
			return list.concatMap(function(x){return[x,x+2,x/2];}, null, l);
		},
		'should return [(1,3,0.5),(3,5,1.5),(5,7,2.5)]': function(topic) {
			assert.equal(topic.toString(), '1,3,0.53,5,1.55,7,2.5');
		}
	},
	'and [True,True,False,True]': {
		topic: function() {
			var l = new list.List(true,true,false,true);
			return list.and(l);
		},
		'should return false': function(topic) {
			assert.equal(topic, false);
		}
	},
	'any (1==) [0,1,2,3,4,5]': {
		topic: function() {
			var l = new list.List(0,1,2,3,4,5);
			return list.any(function(x){return 1==x;}, l);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'any (>5) [0,1,2,3,4,5]': {
		topic: function() {
			var l = new list.List(0,1,2,3,4,5);
			return list.any(function(x){return x>5;}, l);
		},
		'should return false': function(topic) {
			assert.equal(topic, false);
		}
	},
	'any even [1,3,5,7,9]': {
		topic: function() {
			var l = new list.List(1,3,5,7,9);
			return list.any(function(x){return x%2==0;}, l);
		},
		'should return false': function(topic) {
			assert.equal(topic, false);
		}
	},
	'all (<10) [1,3,5,7,9]': {
		topic: function() {
			var l = new list.List(1,3,5,7,9);
			return list.all(function(x){return x<10;}, l);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'all (==1) [1,1,0,1,1]': {
		topic: function() {
			var l = new list.List(1,1,0,1,1);
			return list.all(function(x){return x==1;}, l);
		},
		'should return false': function(topic) {
			assert.equal(topic, false);
		}
	},
	'all even [2,4,6,8]': {
		topic: function() {
			var l = new list.List(2,4,6,8);
			return list.all(function(x){return x%2==0;}, l);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'sum [1,2,3,4]': {
		topic: function() {
			var l = new list.List(1,2,3,4);
			return list.sum(l);
		},
		'should return 10': function(topic) {
			assert.equal(topic, 10);
		},
	},
	'product [1,2,3,4]': {
		topic: function() {
			var l = new list.List(1,2,3,4);
			return list.product(l);
		},
		'should return 24': function(topic) {
			assert.equal(topic, 24);
		},
	},
	'maximum [3,2,6,4,1,2,3]': {
		topic: function() {
			var l = new list.List(3,2,6,4,1,2,3);
			return list.maximum(l);
		},
		'should return 6': function(topic) {
			assert.equal(topic, 6);
		}
	},
	'maximum "hello"': {
		topic: function() {
			var l = new list.List('H','e','l','l','o');
			return list.maximum(l);
		},
		'should return "o"': function(topic) {
			assert.equal(topic, "o");
		}
	},
	'minimum [3,2,6,4,1,2,3]': {
		topic: function() {
			var l = new list.List(3,2,6,4,1,2,3);
			return list.minimum(l);
		},
		'should return 1': function(topic) {
			assert.equal(topic, 1);
		}
	},
	'minimum "hello"': {
		topic: function() {
			var l = new list.List('H','e','l','l','o');
			return list.minimum(l);
		},
		'should return "H"': function(topic) {
			assert.equal(topic, "H");
		}
	}
}).run();


vows.describe('Data.List-js::foldl').addBatch({
	/* http://zvon.org/other/haskell/Outputprelude/foldl_f.html */
	'foldl / 64 [4,2,4]': {
		topic: function() {
			var l = new list.List(4,2,4);
			return list.foldl(function(a,b){return a/b;}, 64, l);
		},
		'should return [64, 16, 8, 2]': function(topic) {
			assert.equal(topic, 2);
		},
	},
	'foldl / 3 []': {
		topic: function() {
			var l = new list.List();
			return list.foldl(function(a,b){return a/b;}, 3, l);
		},
		'should return [3]': function(topic) {
			assert.equal(topic, 3);
		}
	},
	'foldl max 5 [1,2,3,4,5,6,7]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,6,7);
			return list.foldl(function(a,b){return(a>b?a:b);}, 5, l);
		},
		'should return [5,5,5,5,5,6,7]': function(topic) {
			assert.equal(topic, 7);
		}
	},
	'foldl (\\x y -> 2*x+y) 4 [1,2,3]': {
		topic: function() {
			var l = new list.List(1,2,3);
			return list.foldl(function(x,y){return(2*x+y);}, 4, l);
		},
		'should return [4,9,20,43]': function(topic) {
			assert.equal(topic, 43);
		}
	}
}).run();



vows.describe('Data.List-js::foldl1').addBatch({
	/* http://zvon.org/other/haskell/Outputprelude/foldl1_f.html */
	'foldl1 + [1,2,3,4]': {
		topic: function() {
			var l = new list.List(1,2,3,4);
			return list.foldl1(function(a,b){return a+b;}, l);
		},
		'should return [1, 3, 6, 10]': function(topic) {
			assert.equal(topic, 10);
		},
	},
	'foldl1 / [64,4,2,8]': {
		topic: function() {
			var l = new list.List(64,4,2,8);
			return list.foldl1(function(a,b){return a/b;}, l);
		},
		'should return [64,16,8,1]': function(topic) {
			assert.equal(topic, 1);
		}
	},
	'foldl1 (/) [12]': {
		topic: function() {
			var l = new list.List(12);
			return list.foldl1(function(a,b){return(a/b);}, l);
		},
		'should return [12]': function(topic) {
			assert.equal(topic, 12);
		}
	},
	'foldl1 (&&) [True,True,False,True]': {
		topic: function() {
			var l = new list.List(true,true,false,true);
			return list.foldl1(function(a,b){return a&&b}, l);
		},
		'should return [True,True,False,False]': function(topic) {
			assert.equal(topic, false);
		}
	}
}).run();





vows.describe('Data.List-js::foldr').addBatch({
	/* http://zvon.org/other/haskell/Outputprelude/foldr_f.html */
	'foldr + 5 [1,2,3,4]': {
		topic: function() {
			var l = new list.List(1,2,3,4);
			return list.foldr(function(a,b){return a+b;}, 5, l);
		},
		'should return [15,14,12,9,5]': function(topic) {
			assert.equal(topic, 15);
		},
	},
	'foldr / 3 []': {
		topic: function() {
			var l = new list.List();
			return list.foldr(function(a,b){return a/b;}, 3, l);
		},
		'should return [3]': function(topic) {
			assert.equal(topic, 3);
		}
	},
	'foldr max 5 [1,2,3,4,5,6,7]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,6,7);
			return list.foldr(function(a,b){return(a>b?a:b);}, 5, l);
		},
		'should return [7,7,7,7,7,7,7,5]': function(topic) {
			assert.equal(topic, 7);
		}
	},
	'foldr (&&) True [False,True,True]': {
		topic: function() {
			var l = new list.List(false,true,true);
			return list.foldr(function(a,b){return a&&b;}, true, l);
		},
		'should return [False, True, True, True]': function(topic) {
			assert.equal(topic, false);
		}
	},
	'foldr (\\v r -> insertBy compare v r) [] [1,3,5,2,4,1]': {
		topic: function() {
			var l = new list.List(1,3,5,2,4,1);
			return list.foldr(
				function(v, r) {
					return list.insertBy(prelude.compare, v, r);
				}, new list.List(), l);
		},
		'should return [1,1,2,3,4,5]': function(topic) {
			assert.equal(topic.toString(), '112345');
		}
	}
}).run();




vows.describe('Data.List-js::foldr1').addBatch({
	/* http://zvon.org/other/haskell/Outputprelude/foldr1_f.html */
	'foldr1 + [1,2,3,4]': {
		topic: function() {
			var l = new list.List(1,2,3,4);
			return list.foldr1(function(a,b){return a+b;}, l);
		},
		'should return [10, 9, 7, 4]': function(topic) {
			assert.equal(topic, 10);
		},
	},
	'foldr1 / [8,12,24,2]': {
		topic: function() {
			var l = new list.List(8,12,24,2);
			return list.foldr1(function(a,b){return a/b;}, l);
		},
		'should return [8,1,12,2]': function(topic) {
			assert.equal(topic, 8);
		}
	},
	'foldr1 (&&) [False,True,True]': {
		topic: function() {
			var l = new list.List(false,true,true);
			return list.foldr1(function(a,b){return a&&b;}, l);
		},
		'should return [False,True,True]': function(topic) {
			assert.equal(topic, false);
		}
	},
	'foldr1 max [3,6,12,4,55,11]': {
		topic: function() {
			var l = new list.List(3,6,12,4,55,11);
			return list.foldr1(function(a,b){return(a>b?a:b);}, l);
		},
		'should return [55,55,55,55,55,11]': function(topic) {
			assert.equal(topic, 55);
		}
	},
}).run();


vows.describe('Data.List-js::scanl').addBatch({
	/* http://zvon.org/other/haskell/Outputprelude/scanl_f.html */
	'scanl / 64 [4,2,4]': {
		topic: function() {
			var l = new list.List(4,2,4);
			return list.scanl(function(a,b){return a/b;}, 64, l);
		},
		'should return [64, 16, 8, 2]': function(topic) {
			assert.equal(topic.toString(), "641682");
		},
	},
	'scanl / 3 []': {
		topic: function() {
			var l = new list.List();
			return list.scanl(function(a,b){return a/b;}, 3, l);
		},
		'should return [3]': function(topic) {
			assert.equal(topic.head().getData(), 3);
		}
	},
	'scanl max 5 [1,2,3,4,5,6,7]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,6,7);
			return list.scanl(function(a,b){return(a>b?a:b);}, 5, l);
		},
		'should return [5,5,5,5,5,6,7]': function(topic) {
			assert.equal(topic.toString(), "55555567");
		}
	},
	'scanl (\\x y -> 2*x+y) 4 [1,2,3]': {
		topic: function() {
			var l = new list.List(1,2,3);
			return list.scanl(function(x,y){return(2*x+y);}, 4, l);
		},
		'should return [4,9,20,43]': function(topic) {
			assert.equal(topic.toString(), "492043");
		}
	}
}).run();



vows.describe('Data.List-js::scanl1').addBatch({
	/* http://zvon.org/other/haskell/Outputprelude/scanl1_f.html */
	'scanl1 + [1,2,3,4]': {
		topic: function() {
			var l = new list.List(1,2,3,4);
			return list.scanl1(function(a,b){return a+b;}, l);
		},
		'should return [1, 3, 6, 10]': function(topic) {
			assert.equal(topic.toString(), "13610");
		},
	},
	'scanl1 / [64,4,2,8]': {
		topic: function() {
			var l = new list.List(64,4,2,8);
			return list.scanl1(function(a,b){return a/b;}, l);
		},
		'should return [64,16,8,1]': function(topic) {
			assert.equal(topic.toString(), "641681");
		}
	},
	'scanl1 (/) [12]': {
		topic: function() {
			var l = new list.List(12);
			return list.scanl1(function(a,b){return(a/b);}, l);
		},
		'should return [12]': function(topic) {
			assert.equal(topic.head().getData(), 12);
		}
	},
	'scanl1 (&&) [True,True,False,True]': {
		topic: function() {
			var l = new list.List(true,true,false,true);
			return list.scanl1(function(a,b){return a&&b}, l);
		},
		'should return [True,True,False,False]': function(topic) {
			assert.equal(topic.toString(), "truetruefalsefalse");
		}
	}
}).run();



vows.describe('Data.List-js::scanr').addBatch({
	/* http://zvon.org/other/haskell/Outputprelude/scanr_f.html */
	'scanr + 5 [1,2,3,4]': {
		topic: function() {
			var l = new list.List(1,2,3,4);
			return list.scanr(function(a,b){return a+b;}, 5, l);
		},
		'should return [15,14,12,9,5]': function(topic) {
			assert.equal(topic.toString(), "15141295");
		},
	},
	'scanr / 3 []': {
		topic: function() {
			var l = new list.List();
			return list.scanr(function(a,b){return a/b;}, 3, l);
		},
		'should return [3]': function(topic) {
			assert.equal(topic.head().getData(), 3);
		}
	},
	'scanr max 5 [1,2,3,4,5,6,7]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,6,7);
			return list.scanr(function(a,b){return(a>b?a:b);}, 5, l);
		},
		'should return [7,7,7,7,7,7,7,5]': function(topic) {
			assert.equal(topic.toString(), "77777775");
		}
	},
	'scanr (&&) True [False,True,True]': {
		topic: function() {
			var l = new list.List(false,true,true);
			return list.scanr(function(a,b){return a&&b;}, true, l);
		},
		'should return [False, True, True, True]': function(topic) {
			assert.equal(topic.toString(), "falsetruetruetrue");
		}
	}
}).run();




vows.describe('Data.List-js::scanr1').addBatch({
	/* http://zvon.org/other/haskell/Outputprelude/scanr1_f.html */
	'scanr1 + [1,2,3,4]': {
		topic: function() {
			var l = new list.List(1,2,3,4);
			return list.scanr1(function(a,b){return a+b;}, l);
		},
		'should return [10, 9, 7, 4]': function(topic) {
			assert.equal(topic.toString(), "10974");
		},
	},
	'scanr1 / [8,12,24,2]': {
		topic: function() {
			var l = new list.List(8,12,24,2);
			return list.scanr1(function(a,b){return b/a;}, l);
		},
		'should return [8,1,12,2]': function(topic) {
			assert.equal(topic.toString(), "81122");
		}
	},
	'scanr1 (&&) [False,True,True]': {
		topic: function() {
			var l = new list.List(false,true,true);
			return list.scanr1(function(a,b){return a&&b;}, l);
		},
		'should return [False,True,True]': function(topic) {
			assert.equal(topic.toString(), "falsetruetrue");
		}
	},
	'scanr1 max [3,6,12,4,55,11]': {
		topic: function() {
			var l = new list.List(3,6,12,4,55,11);
			return list.scanr1(function(a,b){return(a>b?a:b);}, l);
		},
		'should return [55,55,55,55,55,11]': function(topic) {
			assert.equal(topic.toString(), "555555555511");
		}
	},
}).run();

vows.describe('Data.List-js::mapAccumL').addBatch({
	/* http://zvon.org/other/haskell/Outputlist/mapAccumL_f.html */
	'mapAccumL (\\x y -> (x, x*y)) 5 [9,6,3]': {
		topic: function() {
			var l = new list.List(9,6,3);
			return list.mapAccumL(function(x,y){return [x,x*y];}, 5, l);
		},
		'should return (5, [45,30,15])': function(topic) {
			assert.equal(topic[0], 5);
			assert.equal(topic[1].toString(), "453015");
		}
	},
	'mapAccumL (\\x y -> (x+y, x*y)) 5 [2,4,8]': {
		topic: function() {
			var l = new list.List(2,4,8);
			return list.mapAccumL(function(x,y){return [x+y,x*y];}, 5, l);
		},
		'should return (19,[10,28,88])': function(topic) {
			assert.equal(topic[0], 19);
			assert.equal(topic[1].toString(), "102888");
		}
	},
	'mapAccumL (\\x y -> (y, y)) 5 [2,4,8]': {
		topic: function() {
			var l = new list.List(2,4,8);
			return list.mapAccumL(function(x,y){return [y,y];}, 5, l);
		},
		'should return (8, [2,4,8])': function(topic) {
			assert.equal(topic[0], 8);
			assert.equal(topic[1].toString(), "248");
		}
	},
	'mapAccumL (\\x y -> (x, x)) 5 [2,4,8]': {
		topic: function() {
			var l = new list.List(2,4,8);
			return list.mapAccumL(function(x,y){return [x,x];}, 5, l);
		},
		'should return (5, [5,5,5])': function(topic) {
			assert.equal(topic[0], 5);
			assert.equal(topic[1].toString(), "555");
		}
	}
}).run();





vows.describe('Data.List-js::mapAccumR').addBatch({
	/* http://zvon.org/other/haskell/Outputlist/mapAccumR_f.html */
	'mapAccumR (\\x y -> (x, x*y)) 5 [9,6,3]': {
		topic: function() {
			var l = new list.List(9,6,3);
			return list.mapAccumR(function(x,y){return [x,x*y];}, 5, l);
		},
		'should return (5, [45,30,15])': function(topic) {
			assert.equal(topic[0], 5);
			assert.equal(topic[1].toString(), "453015");
		}
	},
	'mapAccumR (\\x y -> (x+y, x*y)) 5 [2,4,8]': {
		topic: function() {
			var l = new list.List(2,4,8);
			return list.mapAccumR(function(x,y){return [x+y,x*y];}, 5, l);
		},
		'should return (19,[34,52,40])': function(topic) {
			assert.equal(topic[0], 19);
			assert.equal(topic[1].toString(), "345240");
		}
	},
	'mapAccumR (\\x y -> (y, y)) 5 [2,4,8]': {
		topic: function() {
			var l = new list.List(2,4,8);
			return list.mapAccumR(function(x,y){return [y,y];}, 5, l);
		},
		'should return (2, [2,4,8])': function(topic) {
			assert.equal(topic[0], 2);
			assert.equal(topic[1].toString(), "248");
		}
	},
	'mapAccumR (\\x y -> (x, x)) 5 [2,4,8]': {
		topic: function() {
			var l = new list.List(2,4,8);
			return list.mapAccumR(function(x,y){return [x,x];}, 5, l);
		},
		'should return (5, [5,5,5])': function(topic) {
			assert.equal(topic[0], 5);
			assert.equal(topic[1].toString(), "555");
		}
	}
}).run();



vows.describe('Data.List-js::take').addBatch({
	'take 5 [1,2,3,4,5,6,7]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,6,7);
			return list.take(5, l);
		},
		'should return [1,2,3,4,5]': function(topic) {
			assert.equal(topic.toString(), "12345");
		}
	},
	'take 5 [1,2]': {
		topic: function() {
			var l = new list.List(1,2);
			return list.take(5, l);
		},
		'should return [1,2]': function(topic) {
			assert.equal(topic.toString(), "12");
		}
	},
	'take 0 [1,2,3,4,5,6,7]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,6,7);
			return list.take(0, l);
		},
		'should return []': function(topic) {
			assert.equal(topic.size(), 0);
		}
	}
	/*
	 * take 5 (repeat 3)
	 * take 10 (iterate (2*) 1)
	 * take 10 (cycle [1,2,3])
	 */
}).run();



vows.describe('Data.List-js::drop').addBatch({
	'drop 5 [1,2,3,4,5,6,7,8,9,10]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,6,7,8,9,10);
			return list.drop(5, l);
		},
		'should return [6,7,8,9,10]': function(topic) {
			assert.equal(topic.toString(), "678910");
		}
	}
}).run();



vows.describe('Data.List-js::splitAt').addBatch({
	'splitAt 5 [1,2,3,4,5,6,7,8,9,10]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,6,7,8,9,10);
			return list.splitAt(5, l);
		},
		'should return ([1,2,3,4,5],[6,7,8,9,10])': function(topic) {
			assert.equal(topic[0].toString(), '12345');
			assert.equal(topic[1].toString(), '678910');
		}
	}
}).run();




vows.describe('Data.List-js::takeWhile').addBatch({
	'takeWhile (<3) [1,2,3,4,5]': {
		topic: function(topic) {
			var l = new list.List(1,2,3,4,5);
			return list.takeWhile(function(x){return x<3;}, l);
		},
		'should return [1,2]': function(topic) {
			assert.equal(topic.toString(), '12');
		}
	},
	'takeWhile (>3) [1,2,3,4,5]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5);
			return list.takeWhile(function(x){return x>3;}, l);
		},
		'should return []': function(topic) {
			assert.equal(list.size(topic), 0);
		}
	},
	'takeWhile odd [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]': {
		topic: function() {
			var l = new list.List(1,3,5,7,9,10,11,12,13,14,15,16);
			return list.takeWhile(function(x){return x%2 !== 0;}, l);
		},
		'should return [1,3,5,7,9]': function(topic) {
			assert.equal(topic.toString(), '13579');
		}
	},
	'takeWhile (\' \'>) "hello world"': {
		topic: function() {
			var l = new list.List('h','e','l','l','o',' ','w','o','r','l','d');
			return list.takeWhile(function(x){return ' ' !== x;}, l);
		},
		'should return "hello"': function(topic) {
			assert.equal(topic.toString(), "hello");
		}
	}
}).run();




vows.describe('Data.List-js::dropWhile').addBatch({
	'dropWhile (<3) [1,2,3,4,5]': {
		topic: function(topic) {
			var l = new list.List(1,2,3,4,5);
			return list.dropWhile(function(x){return x<3;}, l);
		},
		'should return [3,4,5]': function(topic) {
			assert.equal(topic.toString(), '345');
		}
	},
	'dropWhile even [2,4,6,7,9,10,13]': {
		topic: function() {
			var l = new list.List(2,4,6,7,9,10,13);
			return list.dropWhile(function(x){return x%2 === 0;}, l);
		},
		'should return [7,9,10,13]': function(topic) {
			assert.equal(topic.toString(), '791013');
		}
	},
	'dropWhile (/= \'w\') "hello world"': {
		topic: function() {
			var l = new list.List('h','e','l','l','o',' ','w','o','r','l','d');
			return list.dropWhile(function(x){return x !== 'w';}, l);
		},
		'should return "hello"': function(topic) {
			assert.equal(topic.toString(), "world");
		}
	},
	'dropWhileEnd (< 4) [1,2,3,4,5,1,2,3]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,1,2,3);
			return list.dropWhileEnd(function(x){return x<4;}, l);
		},
		'should return [1,2,3,4,5]': function(topic) {
			assert.equal(topic.toString(), '12345');
		}
	},
	'dropWhileEnd (< 9) [1,2,3]': {
		topic: function() {
			var l = new list.List(1,2,3);
			return list.dropWhileEnd(function(x){return x<9;}, l);
		},
		'should return []': function(topic) {
			assert.equal(list.size(topic), 0);
		}
	},
	'dropWhileEnd (< 0) [1,2,3]': {
		topic: function() {
			var l = new list.List(1,2,3);
			return list.dropWhileEnd(function(x){return x<0;}, l);
		},
		'should return [1,2,3]': function(topic) {
			assert.equal(topic.toString(), '123');
		}
	}
}).run();



vows.describe('Data.List-js::span').addBatch({
	'span (<3) [1,2,3,4,1,2,3,4]': {
		topic: function(topic) {
			var l = new list.List(1,2,3,4,1,2,3,4);
			return list.span(function(x){return x<3;}, l);
		},
		'should return ([1,2], [3,4,1,2,3,4])': function(topic) {
			assert.equal(topic[0].toString(), '12');
			assert.equal(topic[1].toString(), '341234');
		}
	},
	'span (<9) [1,2,3]': {
		topic: function(topic) {
			var l = new list.List(1,2,3);
			return list.span(function(x){return x<9;}, l);
		},
		'should return ([1,2,3], [])': function(topic) {
			assert.equal(topic[0].toString(), '123');
			assert.equal(topic[1].size(), 0);
		}
	},
	'span (<0) [1,2,3]': {
		topic: function(topic) {
			var l = new list.List(1,2,3);
			return list.span(function(x){return x<0;}, l);
		},
		'should return ([], [1,2,3])': function(topic) {
			assert.equal(topic[0].size(), 0);
			assert.equal(topic[1].toString(), '123');
		}
	}
});




vows.describe('Data.List-js::xbreak').addBatch({
	'xbreak (>3) [1,2,3,4,1,2,3,4]': {
		topic: function(topic) {
			var l = new list.List(1,2,3,4,1,2,3,4);
			return list.xbreak(function(x){return x>3;}, l);
		},
		'should return ([1,2,3], [4,1,2,3,4])': function(topic) {
			assert.equal(topic[0].toString(), '123');
			assert.equal(topic[1].toString(), '41234');
		}
	},
	'xbreak (<9) [1,2,3]': {
		topic: function(topic) {
			var l = new list.List(1,2,3);
			return list.xbreak(function(x){return x<9;}, l);
		},
		'should return ([], [1,2,3])': function(topic) {
			assert.equal(topic[0].size(), 0);
			assert.equal(topic[1].toString(), '123');
		}
	},
	'xbreak (>9) [1,2,3]': {
		topic: function(topic) {
			var l = new list.List(1,2,3);
			return list.xbreak(function(x){return x>9;}, l);
		},
		'should return ([1,2,3], [])': function(topic) {
			assert.equal(topic[0].toString(), '123');
			assert.equal(topic[1].size(), 0);
		}
	}
}).run();



vows.describe('Data.List-js::stripPrefix').addBatch({
	'stripPrefix "foo" "foobar"': {
		topic: function(topic) {
			var l = new list.fromString('foobar');
			return list.stripPrefix(new list.fromString('foo'), l);
		},
		'should return Just("bar")': function(topic) {
			assert.equal(topic.fromJust().toString(), 'bar');
		}
	},
}).run();


vows.describe('Data.List-js::group,groupBy').addBatch({
	'group "abbcdddeea"': {
		topic: function() {
			var l = new list.fromString('abbcdddeea');
			return list.group(l);
		},
		'should return ["a","bb","c","ddd","ee","a"]': function(topic) {

			assert.equal(list.index(0, topic).toString(), 'a');
			assert.equal(list.index(1, topic).toString(), 'bb');
			assert.equal(list.index(2, topic).toString(), 'c');
			assert.equal(list.index(3, topic).toString(), 'ddd');
			assert.equal(list.index(4, topic).toString(), 'ee');
			assert.equal(list.index(5, topic).toString(), 'a');
		}
	},
	'group "mississippi"': {
		topic: function() {
			var l = new list.fromString("mississippi");
			return list.group(l);
		},
		'should return ["m", "i", "ss", "i", "ss", "i", "pp", "i"]': function(topic) {
			assert.equal(list.index(0, topic).toString(), 'm');
			assert.equal(list.index(1, topic).toString(), 'i');
			assert.equal(list.index(2, topic).toString(), 'ss');
			assert.equal(list.index(3, topic).toString(), 'i');
			assert.equal(list.index(4, topic).toString(), 'ss');
			assert.equal(list.index(5, topic).toString(), 'i');
			assert.equal(list.index(6, topic).toString(), 'pp');
			assert.equal(list.index(7, topic).toString(), 'i');
		}
	},
	'groupBy (\\x y -> (x*y `mod` 3) == 0) [1,2,3,4,5,6,7,8,9]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,6,7,8,9);
			return list.groupBy(
				function(x, y) {
					return (prelude.mod(x*y, 3) == 0);
				},
			l);
		},
		'should return [[1],[2,3],[4],[5,6],[7],[8,9]]': function(topic) {
			assert.equal(list.index(0, topic).toString(), '1');
			assert.equal(list.index(1, topic).toString(), '23');
			assert.equal(list.index(2, topic).toString(), '4');
			assert.equal(list.index(3, topic).toString(), '56');
			assert.equal(list.index(4, topic).toString(), '7');
//			list.index(5, topic).dumpL();
//			assert.equal(list.index(5, topic).toString(), '89');
		}
	}
}).run();


vows.describe('Data.List-js::inits').addBatch({
	'inits [1,3,5]': {
		topic: function() {
			var l = new list.List(1,3,5);
			return list.inits(l);
		},
		'should return [[], [1], [1,3], [1,3,5]]': function(topic) {
			assert.equal(list.size(list.index(0, topic)), 0);
			assert.equal(list.index(1, topic).toString(), '1');
			assert.equal(list.index(2, topic).toString(), '13');
			assert.equal(list.index(3, topic).toString(), '135');
		}
	},
	'inits "XXX"': {
		topic: function() {
			var l = new list.List("X","X","X");
			return list.inits(l);
		},
		'should return ["", "X", "XX", "XXX"]': function(topic) {
			assert.equal(list.index(0, topic).toString(), '');
			assert.equal(list.index(1, topic).toString(), 'X');
			assert.equal(list.index(2, topic).toString(), 'XX');
			assert.equal(list.index(3, topic).toString(), 'XXX');
		}
	}
}).run();





vows.describe('Data.List-js::tails').addBatch({
	'tails [1,3,5]': {
		topic: function() {
			var l = new list.List(1,3,5);
			return list.tails(l);
		},
		'should return [[1,3,5], [3,5], [5], []]': function(topic) {
			assert.equal(list.size(list.index(3, topic)), 0);
			assert.equal(list.index(2, topic).toString(), '5');
			assert.equal(list.index(1, topic).toString(), '35');
			assert.equal(list.index(0, topic).toString(), '135');
		}
	},
	'tails "XXX"': {
		topic: function() {
			var l = new list.List("X","X","X");
			return list.tails(l);
		},
		'should return ["XXX", "XX", "X", ""]': function(topic) {
			assert.equal(list.index(3, topic).toString(), '');
			assert.equal(list.index(2, topic).toString(), 'X');
			assert.equal(list.index(1, topic).toString(), 'XX');
			assert.equal(list.index(0, topic).toString(), 'XXX');
		}
	}
}).run();




vows.describe('Data.List-js::isPrefixOf,isSuffixOf,isInfixOf').addBatch({
	'isPrefixOf [1,2,3] [1,2,3,4,5]': {
		topic: function() {
			var la = new list.List(1,2,3);
			var lb = new list.List(1,2,3,4,5);
			return list.isPrefixOf(la, lb);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'isPrefixOf [2,3,4] [1,2,3,4,5]': {
		topic: function() {
			var la = new list.List(2,3,4);
			var lb = new list.List(1,2,3,4,5);
			return list.isPrefixOf(la, lb);
		},
		'should return false': function(topic) {
			assert.equal(topic, false);
		}
	},
	'isPrefixOf [] [1,2,3,4,5]': {
		topic: function() {
			var la = new list.List();
			var lb = new list.List(1,2,3,4,5);
			return list.isPrefixOf(la, lb);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'isPrefixOf "xyz" "xyzXYZ"': {
		topic: function() {
			var la = new list.List("x","y","z");
			var lb = new list.List("x","y","z","X","Y","Z");
			return list.isPrefixOf(la, lb);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}

	},
	'isSuffixOf [3,4,5] [1,2,3,4,5]': {
		topic: function() {
			var la = new list.List(3,4,5);
			var lb = new list.List(1,2,3,4,5);
			return list.isSuffixOf(la, lb);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'isSuffixOf [2,3,4] [1,2,3,4,5]': {
		topic: function() {
			var la = new list.List(2,3,4);
			var lb = new list.List(1,2,3,4,5);
			return list.isSuffixOf(la, lb);
		},
		'should return false': function(topic) {
			assert.equal(topic, false);
		}
	},
	'isSuffixOf [] [1,2,3,4,5]': {
		topic: function() {
			var la = new list.List();
			var lb = new list.List(1,2,3,4,5);
			return list.isSuffixOf(la, lb);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'isSuffixOf "XYZ" "xyzXYZ"': {
		topic: function() {
			var la = new list.List("X","Y","Z");
			var lb = new list.List("x","y","z","X","Y","Z");
			return list.isSuffixOf(la, lb);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'isInfixOf "Haskell" "I really like Haskell"': {
		topic: function() {
			var la = new list.fromStr("Haskell");
			var lb = new list.fromStr("I really like Haskell");
			return list.isInfixOf(la, lb);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'isInfixOf "Ial" "I really like haskell"': {
		topic: function() {
			var la = new list.fromStr("Ial");
			var lb = new list.fromStr("I really like Haskell");
			return list.isInfixOf(la, lb);
		},
		'should return false': function(topic) {
			assert.equal(topic, false);
		}
	}
}).run();



vows.describe('Data.List-js::elem,notElem,lookup').addBatch({
	'elem 1 [1,2,3,4,5]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5);
			return list.elem(1, l);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'elem 14 [1,2]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5);
			return list.elem(14, l);
		},
		'should return false': function(topic) {
			assert.equal(topic, false);
		}
	},
	'elem o "Zvon"': {
		topic: function() {
			var l = new list.fromStr("Zvon");
			return list.elem('o', l);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'notElem 1 [1,2,3,4,5]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5);
			return list.notElem(1, l);
		},
		'should return false': function(topic) {
			assert.equal(topic, false);
		}
	},
	'notElem 14 [1,2]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5);
			return list.notElem(14, l);
		},
		'should return true': function(topic) {
			assert.equal(topic, true);
		}
	},
	'notElem o "Zvon"': {
		topic: function() {
			var l = new list.fromStr("Zvon");
			return list.notElem('o', l);
		},
		'should return false': function(topic) {
			assert.equal(topic, false);
		}
	},
	'lookup "c" [("a",0),("b",1),("c",2)]': {
		topic: function() {
			var l = new list.List(['a',0],['b',1],['c',2]);
			return list.lookup('c', l);
		},
		'should return Just 2': function(topic) {
			assert.equal(topic.fromJust(), 2);
		}
	},
	'lookup "c" [("a",0),("b",1),("c",2),("c",3)]': {
		topic: function() {
			var l = new list.List(['a',0],['b',1],['c',2],['c',3]);
			return list.lookup('c', l);
		},
		'should return Just 2': function(topic) {
			assert.equal(topic.fromJust(), 2);
		}
	},
	'lookup "c" [("a",0)]': {
		topic: function() {
			var l = new list.List(['a',0]);
			return list.lookup('c', l);
		},
		'should return Nothing': function(topic) {
			assert.equal(topic.isNothing(), true);
		}
	}
}).run();


vows.describe('Data.List-js::find,ix,elemIndex,elemIndices,findIndex,findIndices,filter,partition,ix').addBatch({
	'find (>3) [0,2,4,6,8]': {
		topic: function() {
			var l = new list.List(0,2,4,6,8);
			return list.find(function(a){return a>3;}, l);
		},
		'should return Just 4': function(topic) {
			assert.equal(topic.fromJust(), 4);
		}
	},
	'find (==3) [0,2,4,6,8]': {
		topic: function() {
			var l = new list.List(0,2,4,6,8);
			return list.find(function(a){return a===3;}, l);
		},
		'should return Nothing': function(topic) {
			assert.equal(topic.isNothing(), true);
		}
	},
	'ix [1,2,3] 2': {
		topic: function() {
			var l = new list.List(1,2,3);
			return list.ix(l, 2);
		},
		'should return 3': function(topic) {
			assert.equal(topic, 3);
		}
	},
	'elemIndex 2 [1,2,2,3,4,5]': {
		topic: function() {
			var l = new list.List(1,2,2,3,4,5);
			return list.elemIndex(2, l);
		},
		'should return Just 1': function(topic) {
			assert.equal(topic.fromJust(), 1);
		}
	},
	'elemIndex 6 [1,2,3,4,5]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5);
			return list.elemIndex(6, l);
		},
		'should return Nothing': function(topic) {
			assert.equal(topic.isNothing(), true);
		}
	},
	'elemIndices 3 [1,2,3,4]': {
		topic: function() {
			var l = new list.List(1,2,3,4);
			return list.elemIndices(2, l);
		},
		'should return [2]': function(topic) {
			assert.equal(topic.toString(), '1');
		}
	},
	'elemIndices 3 [1,3,2,3,3,4,3]': {
		topic: function() {
			var l = new list.List(1,3,2,3,3,4,3);
			return list.elemIndices(3, l);
		},
		'should return [1,3,4,6]': function(topic) {
			assert.equal(topic.toString(), '1346');
		}
	},
	'findIndex (>3) [0,2,4,6,8]': {
		topic: function() {
			var l = new list.List(0,2,4,6,8);
			return list.findIndex(function(a){return a>3;}, l);
		},
		'should return Just 2': function(topic) {
			assert.equal(topic.fromJust(), 2);
		}
	},
	'findIndex (==3) [0,2,4,6,8]': {
		topic: function() {
			var l = new list.List(0,2,4,6,8);
			return list.findIndex(function(a){return a===3;}, l);
		},
		'should return Nothing': function(topic) {
			assert.equal(topic.isNothing(), true);
		}
	},
	'findIndices (>3) [0,2,4,6,8]': {
		topic: function() {
			var l = new list.List(0,2,4,6,8);
			return list.findIndices(function(a){return a>3;}, l);
		},
		'should return [2,3,4]': function(topic) {
			assert.equal(topic.toString(), '234');
		}
	},
	'findIndices (==3) [0,2,4,6,8]': {
		topic: function() {
			var l = new list.List(0,2,4,6,8);
			return list.findIndices(function(a){return a===3;}, l);
		},
		'should return []': function(topic) {
			assert.equal(list.size(topic), 0);
		}
	},
	'partition (>3) [1,5,2,4,3]': {
		topic: function() {
			var l = new list.List(1,5,2,4,3);
			return list.partition(function(a){return a>3;}, l);
		},
		'should return ([5,4],[1,2,3])': function(topic) {
			assert.equal(topic.length, 2);
			assert.equal(list.size(topic[0]), 2);
			assert.equal(list.size(topic[1]), 3);
			assert.equal(topic[0].toString(), '54');
			assert.equal(topic[1].toString(), '123');
		}
	},
	'partition (==6) [1,5,2,4,3]': {
		topic: function() {
			var l = new list.List(1,5,2,4,3);
			return list.partition(function(a){return a==6;}, l);
		},
		'should return ([],[1,5,2,4,3])': function(topic) {
			assert.equal(topic.length, 2);
			assert.equal(list.size(topic[0]), 0);
			assert.equal(list.size(topic[1]), 5);
			assert.equal(topic[1].toString(), '15243');
		}
	},
	'filter (>5) [1,2,3,4,5,6,7,8]': {
		topic: function() {
			var l = new list.List(1,2,3,4,5,6,7,8);
			return list.filter(function(a){return a>5;}, l);
		},
		'should return [6,7,8]': function(topic) {
			assert.equal(topic.toString(), '678');
		}
	}
}).run();



vows.describe('Data.List-js::zip,zipN,zipWith,unzip,unzipN').addBatch({
	'zip [1,2,3] [9,8,7]': {
		topic: function() {
			var la = new list.List(1,2,3);
			var lb = new list.List(9,8,7);
			return list.zip(la, lb);
		},
		'should return [(1,9),(2,8),(3,7)]': function(topic) {
			assert.equal(list.size(topic), 3);
			assert.equal(list.ix(topic, 0).toString(), '1,9');
			assert.equal(list.ix(topic, 1).toString(), '2,8');
			assert.equal(list.ix(topic, 2).toString(), '3,7');
		}
	},
	'zip [1,2,3,4,5] [9,8]': {
		topic: function() {
			var la = new list.List(1,2,3,4,5);
			var lb = new list.List(9,8);
			return list.zip(la, lb);
		},
		'should return [(1,9),(2,8)]': function(topic) {
			assert.equal(list.size(topic), 2);
			assert.equal(list.ix(topic, 0).toString(), '1,9');
			assert.equal(list.ix(topic, 1).toString(), '2,8');
		}
	},
	'zipN [1,2,3] [9,8,7] [-3,-2,-1]': {
		topic: function() {
			var la = new list.List(1,2,3);
			var lb = new list.List(9,8,7);
			var lc = new list.List(-3,-2,-1);
			return list.zipN(la, lb, lc);
		},
		'should return [(1,9,-3),(2,8,-2),(3,7,-1)]': function(topic) {
			assert.equal(list.size(topic), 3);
			assert.equal(list.ix(topic, 0).toString(), '1,9,-3');
			assert.equal(list.ix(topic, 1).toString(), '2,8,-2');
			assert.equal(list.ix(topic, 2).toString(), '3,7,-1');
		}
	},
	'zipWith (+) [1,2,3] [3,2,1]': {
		topic: function() {
			var la = new list.List(1,2,3);
			var lb = new list.List(3,2,1);
			return list.zipWith(function(a,b){return a+b;},la,lb);
		},
		'should return [4,4,4]': function(topic) {
			assert.equal(topic.toString(), '444');
		}
	},
	'zipWithN (\\x y z -> x+2*y+3*z) [1..5] [5..10] [10..15]': {
		topic: function() {
			var la = new list.List(1,2,3,4,5);
			var lb = new list.List(5,6,7,8,9,10);
			var lc = new list.List(10,11,12,13,14,15);
			return list.zipWithN(function(x,y,z){return x+2*y+3*z;}, la, lb, lc);
		},
		'should return [41, 47, 53, 59, 65]': function(topic) {
			assert.equal(topic.toString(), '4147535965');
		}
	},
	'unzip [(1,2),(2,3),(3,4)]': {
		topic: function() {
			var l = new list.List([1,2],[2,3],[3,4]);
			return list.unzip(l);
		},
		'should return ([1,2,3],[2,3,4])': function(topic) {
			assert.equal(topic.length, 2);
			assert.equal(topic[0].toString(), '123');
			assert.equal(topic[1].toString(), '234');
		}
	},
	'unzip [(1,2,3),(2,3,4),(3,4,5)]': {
		topic: function() {
			var l = new list.List([1,2,3],[2,3,4],[3,4,5]);
			return list.unzipN(l);
		},
		'should return ([1,2,3],[2,3,4],[3,4,5])': function(topic) {
			assert.equal(topic.length, 3);
			assert.equal(topic[0].toString(), '123');
			assert.equal(topic[1].toString(), '234');
			assert.equal(topic[2].toString(), '345');
		}
	},
}).run();


vows.describe('Data.List-js::lines,words,unlines,unwords').addBatch({
	'lines "aa\\nbb\\nbb"': {
		topic: function() {
			return list.lines("aa\nbb\nbb");
		},
		'should return ["aa","bb","bb"]': function(topic) {
			assert.equal(list.size(topic), 3);
			assert.equal(list.ix(topic, 0).toString(), 'aa');
			assert.equal(list.ix(topic, 1).toString(), 'bb');
			assert.equal(list.ix(topic, 2).toString(), 'bb');
		}
	},
	'lines ["aa\\nbb\\nbb\\n"]': {
		topic: function() {
			var l = list.fromString("aa\nbb\nbb");
			return list.lines(l);
		},
		'should return ["aa","bb","bb"]': function(topic) {
			assert.equal(list.size(topic), 3);
			assert.equal(list.ix(topic, 0).toString(), 'aa');
			assert.equal(list.ix(topic, 1).toString(), 'bb');
			assert.equal(list.ix(topic, 2).toString(), 'bb');
		}
	},
	'words "aa bb cc \t dd \n ee"': {
		topic: function() {
			return list.words("aa bb cc \t dd \n ee");
		},
		'should return ["aa","bb","cc","dd","ee"]': function(topic) {
			assert.equal(list.size(topic), 5);
			assert.equal(list.ix(topic, 0).toString(), 'aa');
			assert.equal(list.ix(topic, 1).toString(), 'bb');
			assert.equal(list.ix(topic, 2).toString(), 'cc');
			assert.equal(list.ix(topic, 3).toString(), 'dd');
			assert.equal(list.ix(topic, 4).toString(), 'ee');
		}
	},
	'words ["aa bb cc \t dd \n ee"]': {
		topic: function() {
			return list.words(list.fromString("aa bb cc \t dd \n ee"));
		},
		'should return ["aa","bb","cc","dd","ee"]': function(topic) {
			assert.equal(list.size(topic), 5);
			assert.equal(list.ix(topic, 0).toString(), 'aa');
			assert.equal(list.ix(topic, 1).toString(), 'bb');
			assert.equal(list.ix(topic, 2).toString(), 'cc');
			assert.equal(list.ix(topic, 3).toString(), 'dd');
			assert.equal(list.ix(topic, 4).toString(), 'ee');
		}
	},
	'unlines ["aa","bb","cc","dd","ee"]': {
		topic: function() {
			var la = new list.List("aa");
			var lb = new list.List("bb");
			var lc = new list.List("cc");
			var ld = new list.List("dd");
			var le = new list.List("ee");
			var l = new list.List(la, lb, lc, ld, le);
			return list.unlines(l);
		},
		'should return "aa\nbb\ncc\ndd\nee\n"': function(topic) {
			assert.equal(topic.toString(), "aa\nbb\ncc\ndd\nee\n");
		}
	},
	'unwords ["aa","bb","cc","dd","ee"]': {
		topic: function() {
			var la = new list.List("aa");
			var lb = new list.List("bb");
			var lc = new list.List("cc");
			var ld = new list.List("dd");
			var le = new list.List("ee");
			var l = new list.List(la, lb, lc, ld, le);
			return list.unwords(l);
		},
		'should return "aa bb cc dd ee"': function(topic) {
			assert.equal(topic.toString(), "aa bb cc dd ee");
		}
	},

}).run();



vows.describe('Data.List-js::nub,_delete,deleteBy,union,unionBy,intersect,intersectBy,difference,insert,insertBy').addBatch({
	'nub [0,1,2,3,2,1,0]': {
		topic: function() {
			var l = new list.List(0,1,2,3,2,1,0);
			return list.nub(l);
		},
		'should return [0,1,2,3]': function(topic) {
			assert.equal(topic.toString(), '0123');
		}
	},
	'nub "AAAAAAAAAAAABBBBBBBBBBBBBBCCCCC"': {
		topic: function() {
			var l = new list.fromStr("AAAAAAAAAAAABBBBBBBBBBBBBBCCCCC");
			return list.nub(l);
		},
		'should return "ABC"': function(topic) {
			assert.equal(topic.toString(), 'ABC');
		}
	},
	'nubBy (\\x y -> x+y == 10) [2,3,5,7,8]': {
		topic: function() {
			var l = new list.List(2,3,5,7,8);
			return list.nubBy(function(x, y){return x+y===10;}, l);
		},
		'should return [2,3,5]': function(topic) {
			assert.equal(topic.toString(), '235');
		}
	},
	'nubBy (\\x y -> x+y == 10) [8,7,5,3,2]': {
		topic: function() {
			var l = new list.List(8,7,5,3,2);
			return list.nubBy(function(x, y){return x+y===10;}, l);
		},
		'should return [8,7,5]': function(topic) {
			assert.equal(topic.toString(), '875');
		}
	},
	'_delete 2 [1,2,3,2,1]': {
		topic: function() {
			var l = new list.List(1,2,3,2,1);
			return list._delete(2, l)
		},
		'should return [1,3,2,1]': function(topic) {
			assert.equal(topic.toString(), '1321');
		}
	},
	'delete 20 [1,2,3,2,1]': {
		topic: function() {
			var l = new list.List(1,2,3,2,1);
			return list._delete(20, l);
		},
		'should return [1,2,3,2,1]': function(topic) {
			assert.equal(topic.toString(), '12321');
		}
	},
	'delete "a" "abba"': {
		topic: function() {
			var l = new list.fromStr("abba");
			return list._delete("a", l);
		},
		'should return "bba"': function(topic) {
			assert.equal(topic.toString(), "bba");
		}
	},
	'deleteBy (\\x y -> y `mod` x == 0) 4 [6,8,10,12]': {
		topic: function() {
			var l = new list.List(6,8,10,12);
			return list.deleteBy(function(x,y){return (y % x) == 0;}, 4, l);
		},
		'should return [6,10,12]': function(topic) {
			assert.equal(topic.toString(), '61012');
		}
	},
	'difference [1,2,3,4] [2,3]': {
		topic: function() {
			var la = new list.List(1,2,3,4);
			var lb = new list.List(2,3);
			return list.difference(la, lb);
		},
		'should return [1,4]': function(topic) {
			assert.equal(topic.toString(), '14');
		}
	},
	'union [1,2,3] [4,5,6]': {
		topic: function() {
			var la = new list.List(1,2,3);
			var lb = new list.List(4,5,6);
			return list.union(la, lb);
		},
		'should return [1,2,3,4,5,6]': function(topic) {
			assert.equal(topic.toString(), '123456');
		}
	},
	'unionBy (\\x y -> x*3 == y) [1,2,3,4] [4,6,9,10]': {
		topic: function() {
			var la = new list.List(1,2,3,4);
			var lb = new list.List(4,6,9,10);
			return list.unionBy(function(x, y){return x*3==y;}, la, lb);
		},
		'should return [1,2,3,4,4,10]': function(topic) {
			assert.equal(topic.toString(), '1234410');
		}
	},
	'union [1,2,3] [3,2,1,0]': {
		topic: function() {
			var la = new list.List(1,2,3);
			var lb = new list.List(3,2,1,0);
			return list.union(la, lb);
		},
		'should return [1,2,3,0]': function(topic) {
			assert.equal(topic.toString(), '1230');
		}
	},
	'union [1,2,2] [1,2,3]': {
		topic: function() {
			var la = new list.List(1,2,2);
			var lb = new list.List(1,2,3);
			return list.union(la, lb);
		},
		'should return [1,2,2,3]': function(topic) {
			assert.equal(topic.toString(), '1223');
		}
	},
	'union "abcd" "AaBbCcDdEe"': {
		topic: function() {
			var la = new list.fromStr("abcd");
			var lb = new list.fromStr("AaBbCcDdEe");
			return list.union(la, lb);
		},
		'should return "abcdABCDEe"': function(topic) {
			assert.equal(topic.toString(), "abcdABCDEe");
		}
	},
	'intersectBy (\\x y -> x*x == y) [1,2,3,4] [4,8,12,16,20]': {
		topic: function() {
			var la = new list.List(1,2,3,4);
			var lb = new list.List(4,8,12,16,20);
			return list.intersectBy(function(x,y){return x*x==y;}, la, lb);
		},
		'should return [2,4]': function(topic) {
			assert.equal(topic.toString(), '24');
		}
	},
	'intersect [1,2,3,4] [5,4,3]': {
		topic: function() {
			var la = new list.List(1,2,3,4);
			var lb = new list.List(5,4,3);
			return list.intersect(la, lb);
		},
		'should return [3,4]': function(topic) {
			assert.equal(topic.toString(), '34');
		}
	},
	'intersect [1,1,2,2,3,3,4,4] [5,4,3]': {
		topic: function() {
			var la = new list.List(1,1,2,2,3,3,4,4);
			var lb = new list.List(5,4,3);
			return list.intersect(la, lb);
		},
		'should return [3,3,4,4]': function(topic) {
			assert.equal(topic.toString(), '3344');
		}
	},
	'intersect [1,1,2,2,3,3,4,4] [3,3,3]': {
		topic: function() {
			var la = new list.List(1,1,2,2,3,3,4,4);
			var lb = new list.List(3,3,3);
			return list.intersect(la, lb);
		},
		'should return [3,3]': function(topic) {
			assert.equal(topic.toString(), '33');
		}
	},
	'intersect "ABBA" "AC"': {
		topic: function() {
			var la = new list.fromStr("ABBA");
			var lb = new list.fromStr("AC");
			return list.intersect(la, lb);
		},
		'should return "AA"': function(topic) {
			assert.equal(topic.toString(), 'AA');
		}
	},
	'insertBy (\\ x y -> x + y < x * y = LT otherwise GT) 4 [0,1,3,5,7,9]': {
		topic: function() {
			var l = new list.List(0,1,3,5,7,9);
			return list.insertBy(
				function(x, y) {
					if(x + y < x * y) {
						return prelude.Ordering.LT;
					} else {
						return prelude.Ordering.GT;
					}
				},
				4, l);
		},
		'should return [0,1,4,3,5,7,9]': function(topic) {
			assert.equal(topic.toString(), '0143579');
		}
	},
	'insertBy compare 4 [1]': {
		topic: function() {
			var l = new list.List(1);
			return list.insertBy(prelude.compare, 4, l);
		},
		'should return [1,4]': function(topic) {
			assert.equal(topic.toString(), '14');
		}
	},
	'insert 4 [1,3,5,7,9]': {
		topic: function() {
			var l = new list.List(1,3,5,7,9);
			return list.insert(4, l);
		},
		'should return [2,3,4,5,7,9]': function(topic) {
			assert.equal(topic.toString(), '134579');
		}
	},
	'insert 4 [5,3,6,2]': {
		topic: function() {
			var l = new list.List(5,3,6,2);
			return list.insert(4, l);
		},
		'should return [4,5,3,6,2]': function(topic) {
			assert.equal(topic.toString(), '45362');
		}
	},
	'insert 4 []': {
		topic: function() {
			return list.insert(4, new list.List());
		},
		'should return [4]': function(topic) {
			assert.equal(topic.toString(), '4');
		}
	},
	'sort [1,3,5,2,4,1]': {
		topic: function() {
			var l = new list.List(1,3,5,2,4,1);
			return list.sort(l);
		},
		'should return [1,1,2,3,4,5]': function(topic) {
			assert.equal(topic.toString(), '112345');
		}
	},
	'sort "Zvon.org"': {
		topic: function() {
			var l = new list.fromStr("Zvon.org");
			return list.sort(l);
		},
		'should return ".Zgnoorv"': function(topic) {
			assert.equal(topic.toString(), '.Zgnoorv');
		}
	}
}).run();




vows.describe('Data.List-js::iterate,repeat,replicate,cycle').addBatch({
	'replicate 3 5': {
		topic: function() {
			return list.replicate(3, 5);
		},
		'should return [5,5,5]': function(topic) {
			assert.equal(topic.toString(), '555');
		}
	},
	'replicate 2 "aa"': {
		topic: function() {
			return list.replicate(2, "aa");
		},
		'should return ["aa","aa"]': function(topic) {
			assert.equal(list.size(topic), 2);
			assert.equal(list.index(0, topic).toString(), "aa");
			assert.equal(list.index(1, topic).toString(), "aa");
		}
	}
}).run();



vows.describe('Preludejs::eq,not,notEq,otherwise,compare').addBatch({
	'range 1 10': {
		topic: function() {
			return list.range(1,10);
		},
		'should return [1,2,3,4,5,6,7,8,9,10]': function(topic) {
			assert.equal(topic.toString(), '12345678910');
		}
	},
	'range 1 10000': {
		topic: function() {
			return list.range(1,10000);
		},
		'should return size of 10000': function(topic) {
			assert.equal(list.size(topic), 10000);
		}
	}
}).run();

vows.describe('Data.List-js::index,lindex,rindex').addBatch({
	'index .. ["hi","yo"]': {
		topic: function() {
			var l = new list.List("hi","yo");
			return l;
		},
		'index 0': {
			topic: function(topic) {
				return list.index(0, topic);
			},
			'index 0 should return "hi"': function(topic) {
				assert.equal(topic.toString(), 'hi');
			}
		},
		'index 1': {
			topic: function(topic) {
				return list.index(1, topic);
			},
			'index 1 should return "yo"': function(topic) {
				assert.equal(topic.toString(), 'yo');
			}
		},
		'lindex 0': {
			topic: function(topic) {
				return list.lindex(0, topic);
			},
			'lindex 0 should return "hi"': function(topic) {
				assert.equal(topic.toString(), 'hi');
			}
		},
		'lindex 1': {
			topic: function(topic) {
				return list.lindex(1, topic);
			},
			'lindex 1 should return "yo"': function(topic) {
				assert.equal(topic.toString(), 'yo');
			}
		},
		'rindex 0': {
			topic: function(topic) {
				return list.rindex(0, topic);
			},
			'rindex 0 should return "yo"': function(topic) {
				assert.equal(topic.toString(), 'yo');
			}
		},
		'rindex 1': {
			topic: function(topic) {
				return list.rindex(1, topic);
			},
			'rindex 1 should return "hi"': function(topic) {
				assert.equal(topic.toString(), 'hi');
			}
		}
	}
}).run();
