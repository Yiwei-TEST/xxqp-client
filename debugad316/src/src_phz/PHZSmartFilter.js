/**
 * Created by zhoufan on 2018/5/12.
 */
var PaohuziTool = cc.Class.extend({

	ctor: function () {
	},


	/**
	 * 检查麻将是否有重复
	 *
	 * @param majiangs
	 * @return
	 */
	isPaohuziRepeat: function(majiangs) {
		if (majiangs == null) {
			return false;
		}

		var map = {};
		for (var key in majiangs) {
			var count = 0;
			var mj = majiangs[key];
			if (map[mj.c]){
				count = map[mj.c];
			}
			map[mj.c] = count + 1;
		}
		for (var key in map) {
			if (map[key] > 1) {
				return true;
			}
		}
		return false;
	},

	/**
	 * 找出红牌
	 *
	 * @param copy
	 * @return
	 */
	findRedPhzs: function(copy) {
		var find = [];
		for (var key in copy) {
			var card = copy[key];
			if (ArrayUtil.indexOf(PHZ2710List,card.n) >= 0) {
				find.push(card);
			}
		}
		return find;
	},

	isBig: function(card) {
		return (card.t == 2);
	},

	/**
	 * 找出小牌
	 *
	 * @param copy
	 * @return
	 */
	findSmallPhzs: function(copy) {
		var find = [];
		for (var key in copy) {
			var card = copy[key];
			if (!this.isBig(card)) {
				find.push(card);
			}
		}
		return find;
	},

	/**
	 * 找出相同的值
	 *
	 * @param copy
	 * @param val
	 * @return
	 */
	findPhzByVal: function(copy, val) {
		var list = [];
		for (var key in copy) {
			var phz = copy[key];
			if (phz.v == val) {
				list.push(phz);
			}
		}
		return list;
	},

	find: function(copy, valList) {
		var pai = [];
		if (!valList.isEmpty()) {
			for (var zpId in valList) {
				//Iterator<Integer> iterator = copy.iterator();
				//while (iterator.hasNext()) {
				//	int card = iterator.next();
				//	PaohzCard phz = PaohzCard.getPaohzCard(card);
				//	if (phz.getVal() == zpId) {
				//		pai.add(phz);
				//		iterator.remove();
				//		break;
				//	}
				//}
			}

		}
		return pai;
	},

	/**
	 * 转化为Map<val,valNum>
	 */
	toPhzValMap: function(phzs) {
		var ids = {};
		if (phzs == null) {
			return ids;
		}
		for (var key in phzs) {
			var phz = phzs[key];
			if (ids.indexOf(phz, phz.v) >= 0) {
				ids[phz.v] += 1;
			} else {
				ids[phz.v] = 1;
			}
		}
		return ids;
	},

	/**
	 * 去除重复转化为val
	 *
	 */
	toPhzRepeatVals: function(phzs) {
		//List<Integer> ids = new ArrayList<>();
		//if (phzs == null) {
		//	return ids;
		//}
		//for (PaohzCard phz : phzs) {
		//	if (!ids.contains(phz.getVal())) {
		//		ids.add(phz.getVal());
		//	}
		//}
		//return ids;
	},

	/**
	 * Id转化为牌
	 *
	 * @param phzIds
	 * @return
	 */
	toPhzCards: function(phzIds) {
		//List<PaohzCard> cards = new ArrayList<>();
		//for (int id : phzIds) {
		//	cards.add(PaohzCard.getPaohzCard(id));
		//}
		//return cards;
	},

	/**
	 * 牌转化为Id
	 *
	 * @param phzs
	 * @return
	 */
	toPhzCardZeroIds: function(phzs) {
		//List<Integer> ids = new ArrayList<>();
		//if (phzs == null) {
		//	return ids;
		//}
		//for (int i = 0; i < phzs.size(); i++) {
		//	if (i == 0) {
		//		ids.add((Integer) phzs.get(i));
		//	} else {
		//		ids.add(0);
		//	}
		//}
		//return ids;
	},

	/**
	 * 牌转化为Id
	 *
	 * @param phzs
	 * @return
	 */
	toPhzCardIds: function(phzs) {
		//List<Integer> ids = new ArrayList<>();
		//if (phzs == null) {
		//	return ids;
		//}
		//for (PaohzCard phz : phzs) {
		//	ids.add(phz.getId());
		//}
		//return ids;
		var ids = [];
		if (phzs == null) {
			return ids;
		}
		for (var key in phzs){
			ids.push(phzs[key].c);
		}
		return ids;
	},

	/**
	 * 跑胡子转化为牌s
	 */
	toPhzCardVals: function(phzs, matchCase) {
		//var majiangIds = [];
		//if (phzs == null) {
		//	return majiangIds;
		//}
		//for (PaohzCard card : phzs) {
		//	if (matchCase) {
		//		majiangIds.push(card.v);
		//	} else {
		//		majiangIds.push(card.v);
		//	}
		//}
		//
		//return majiangIds;
	},

	/**
	 * 得到最大相同数
	 */
	getMax: function(list) {
		var card_index = new PaohzCardIndexArr();
		var phzMap = {};
		for (var key in list) {
			var phzCard = list[key];
			var count;
			if (phzMap[phzCard.v]) {
				count = phzMap[phzCard.v];
			} else {
				count = [];
				phzMap[phzCard.v] = count;
			}
			count.push(phzCard);
		}
		for (var key in phzMap) {
			var phzVal = key;
			var phzList = phzMap[key];
			switch (phzList.length) {
				case 1:
					card_index.addPaohzCardIndex(0, phzList, phzVal);
					break;
				case 2:
					card_index.addPaohzCardIndex(1, phzList, phzVal);
					break;
				case 3:
					card_index.addPaohzCardIndex(2, phzList, phzVal);
					break;
				case 4:
					card_index.addPaohzCardIndex(3, phzList, phzVal);
					break;
			}
		}
		return card_index;
	},

	/**
	 * 是否能吃
	 *
	 * @param handCards
	 * @param disCard
	 * @return
	 */
	checkChi: function(handCards, disCard) {
		//int disVal = disCard.getVal();
		//int otherVal = disCard.getOtherVal();
        //
		//List<Integer> chi0 = new ArrayList<>(Arrays.asList(disVal, otherVal));
		//List<Integer> chi4 = new ArrayList<>(Arrays.asList(otherVal, otherVal));
		//List<Integer> chi1 = new ArrayList<>(Arrays.asList(disVal - 2, disVal - 1));
		//List<Integer> chi2 = new ArrayList<>(Arrays.asList(disVal - 1, disVal + 1));
		//List<Integer> chi3 = new ArrayList<>(Arrays.asList(disVal + 1, disVal + 2));
		//List<List<Integer>> chiList = new ArrayList<>();
		//chiList.add(chi0);
		//chiList.add(chi4);
		//chiList.add(chi1);
		//chiList.add(chi2);
		//chiList.add(chi3);
        //
		//// // 不区分大小写 找到值
		//// List<PaohzCard> vals = findCountByVal(handCards, disCard, false);
		//// if (vals != null && vals.size() >= 2) {
		//// int needCards = 3;
		//// if (!vals.contains(disCard)) {
		//// // 只能是3个牌
		//// vals.add(disCard);
		//// }
		////
		//// if (vals.size() == needCards) {
		//// if (isSameCard(vals)) {
		//// // 不能是一样的牌
		//// return new ArrayList<PaohzCard>();
		//// }
		//// return vals;
		////
		//// } else if (vals.size() > needCards) {
		//// List<PaohzCard> list = new ArrayList<>();
		//// if (needCards == 3) {
		//// list.add(disCard);
		//// needCards = 2;
		//// }
		//// int k = 0;
		//// int s = 1;
		//// for (int i = 0; i < vals.size(); i++) {
		//// PaohzCard card = vals.get(i);
		//// if (!list.contains(card)) {
		//// if (card.getId() == disCard.getId()) {
		//// if (s >= 2) {
		//// continue;
		//// } else {
		//// s++;
		////
		//// }
		//// }
		////
		//// k++;
		//// list.add(card);
		////
		//// }
		////
		//// if (k >= needCards) {
		//// break;
		//// }
		//// }
		//// if (isSameCard(list)) {
		//// // 不能是一样的牌
		//// return new ArrayList<PaohzCard>();
		//// }
		//// return list;
		//// }
		//// return new ArrayList<PaohzCard>();
		//// }
		//// 检查2 7 10
        //
		//List<Integer> val2710 = Arrays.asList(2, 7, 10);
		//if (val2710.contains(disCard.getPai())) {
		//	List<Integer> chi2710 = new ArrayList<>();
		//	for (int val : val2710) {
		//		if (disCard.getPai() == val) {
		//			continue;
		//		}
		//		chi2710.add(disCard.getCase() + val);
        //
		//	}
        //
		//	chiList.add(chi2710);
        //
		//}
        //
		//List<PaohzCard> copy = new ArrayList<>(handCards);
		//copy.remove(disCard);
        //
		//for (List<Integer> chi : chiList) {
		//	List<PaohzCard> findList = findPhzCards(copy, chi);
		//	if (!findList.isEmpty()) {
		//		return findList;
		//	}
        //
		//}
        //
		//// List<Integer> ids = toPhzCardVals(copy, true);
		//// for (List<Integer> chi : chiList) {
		//// for (int chiVal : chi) {
		//// for (int id : ids) {
		//// if (chiVal == id) {
		////
		//// }
		//// }
		//// }
		//// if (ids.containsAll(chi)) {
		//// return findByVals(handCards, chi);
		//// }
		//// }
        //
		//return [];
	},

	findPhzCards: function(cards, vals) {
		//List<PaohzCard> findList = new ArrayList<>();
		//for (int chiVal : vals) {
		//	boolean find = false;
		//	for (PaohzCard card : cards) {
		//		if (findList.contains(card)) {
		//			continue;
		//		}
		//		if (card.getVal() == chiVal) {
		//			findList.add(card);
		//			find = true;
		//			break;
		//		}
		//	}
		//	if (!find) {
		//		findList.clear();
		//		break;
		//	}
		//}
		//return findList;
	},

	/**
	 * 检查出相同的牌
	 */
	getSameCards: function(handCards, disCard) {
		//List<PaohzCard> list = findCountByVal(handCards, disCard, true);
		//if (list != null) {
		//	return list;
		//}
		//return null;
	},

	/**
	 * 是否一样的牌
	 */
	isSameCard: function(handCards) {
		//int val = 0;
		//for (PaohzCard card : handCards) {
		//	if (val == 0) {
		//		val = card.getVal();
		//		continue;
		//	}
		//	if (val != card.getVal()) {
		//		return false;
		//	}
		//}
		//return true;

		//cc.log("isSameCard:::handCards==="+JSON.stringify(handCards));

		var val = 0;
		for (var key in handCards) {
			if (val == 0) {
				val = handCards[key].v;
				continue;
			}
			if (val != handCards[key].v) {
				return false;
			}
		}
		//cc.log("isSameCard==="+JSON.stringify(handCards));
		return true;
	},

	/**
	 * 删除牌
	 *
	 * @param handCards
	 * @param cardVal
	 * @return
	 */
	removePhzByVal: function(handCards, cardVal) {
		//Iterator<PaohzCard> iterator = handCards.iterator();
		//while (iterator.hasNext()) {
		//	PaohzCard paohzCard = iterator.next();
		//	if (paohzCard.getVal() == cardVal) {
		//		iterator.remove();
		//	}
        //
		//}
	},

	/**
	 * 是否有这张相同的牌
	 */
	isHasCardVal: function(handCards, cardVal) {
		//for (PaohzCard card : handCards) {
		//	if (cardVal == card.getVal()) {
		//		return true;
		//	}
		//}
		//return false;
	},

	/**
	 * @param phzList
	 *            牌List
	 * @param o
	 *            值or牌
	 * @param matchCase
	 *            是否为值（true取val，false取pai）
	 * @return
	 */
	findCountByVal: function(phzList, o, matchCase) {
		var val;
		if (o) {
			if (o.hasOwnProperty("t")) {
				if (matchCase) {
					val = o.v;
				} else {
					val = o.n;
				}
			} else if (TypeUtil.isNumber(o)) {
				val = o;
			} else {
				return null;
			}
		} else {
			return null;
		}
		var result = [];
		for (var key in phzList) {
			var card = phzList[key];
			var matchVal;
			if (matchCase) {
				matchVal = card.v;
			} else {
				matchVal = card.n;
			}
			if (matchVal == val) {
				result.push(card);
			}
		}
		return result;
	},

	findByVals: function(majiangs, vals) {
		//List<PaohzCard> result = new ArrayList<>();
		//for (int val : vals) {
		//	for (PaohzCard majiang : majiangs) {
		//		if (majiang.getVal() == val) {
		//			result.add(majiang);
		//			break;
		//		}
		//	}
		//}
        //
		//return result;
	},

	remove: function(list,mjVo){
		//cc.log("mjVo.c==="+mjVo.c);
		for(var i=0;i<list.length;i++){
			if(mjVo.c == list[i].c){
				list.splice(i,1);
				i--;
				break;
			}
		}
	},

	containsAll: function(list, contains) {
		var containCount = 0;
		for (var i=0;i<contains.length;i++) {
			var conVo = contains[i];
			for (var j=0;j<list.length;j++) {
				if(conVo.c == list[j].c){
					containCount++;
					break;
				}
			}
		}
		if (containCount == contains.length) {
			return true;
		}
		return false;
	},

	removeAll: function(list,removeList) {
		for (var i=0;i<removeList.length;i++) {
			this.remove(list,removeList[i]);
		}
	},

	checkHu: function(handCard) {
		if (handCard == null || handCard.isEmpty()) {
			return null;
		}
		var bean = new PHZHuBean();

		var copy = ArrayUtil.clone(handCard);
		bean.setHandCards(ArrayUtil.clone(handCard));
		var valArr = this.getMax(copy);
		bean.setValArr(valArr);

		// 去掉3张和4张一样的牌
		var index3 = valArr.getPaohzCardIndex(3);
		if (index3 != null) {
			this.removeAll(copy, index3.getPaohzList());
		}
		var index2 = valArr.getPaohzCardIndex(2);
		if (index2 != null) {
			this.removeAll(copy, index2.getPaohzList());
		}
		bean.setOperateCards(copy);

		return bean;
	},

// public static void chaiPai(PaohuziHuBean bean) {
// 不管大2小2先找出来
// List<PaohzCard> find2 = findCountByVal(bean.getOperateCards(), 2,
// false);
// for (PaohzCard card2 : find2) {
// 是否有123 或者2710可以配对

// }

// }

	/**
	 * 得到某个值的麻将
	 *
	 * @param copy
	 * @return
	 */
	getVals: function(copy, val, exceptCards) {
		var list = [];
		for (var key in copy) {
			var phz = copy[key];
			if (exceptCards != null) {
				// 有某些除外的牌不能算在内
				var findExcept = false;
				for (var key1 in exceptCards) {
					var except = exceptCards[key1];
					if (phz.t == except.t && phz.i == except.i) {
						findExcept = true;
						break;
					}
				}
				if (findExcept) {
					continue;
				}
			}
			if (phz.v == val) {
				list.push(phz);
			}
		}
		return list;
	},

	/**
	 * 得到某个值的跑胡子牌
	 * @param copy 手牌
	 */
	getVal: function(copy, val, exceptCards) {
		for (var key in copy) {
			var phz = copy[key];
			if (exceptCards && exceptCards.length > 0) {
				// 有某些除外的牌不能算在内
				var findExcept = false;
				for (var key1 in exceptCards) {
					var except = exceptCards[key1];
					if (except!=null && phz.c == except.c) {
						findExcept = true;
						break;
					}
				}
				if (findExcept) {
					continue;
				}
			}
			if (phz.v == val) {
				return phz;
			}
		}
		return null;
	},

	sortMin:function(hasPais) {
		var compare = function(o1,o2) {
			if (o1.n < o2.n) {
				return -1;
			}
			if (o1.n > o2.n) {
				return 1;
			}
			return 0;
		};
		hasPais.sort(compare);
	},

	// 拆牌
	chaipai: function(lack, hasPais) {
		if (hasPais.length == 0) {
			return true;
		}
		// cc.log("lack = ",JSON.stringify(lack));
		var hu = this.chaishun(lack, hasPais);
		if (hu)
			return true;
		return false;
	},

	chaiSame: function(lack, hasPais, minCard, sameList) {
		if (sameList.length < 3) {
			// 小于3张牌没法拆
			return false;
		} else if (sameList.length == 3) {
			// 大小加一起正好3张牌
			var chaisame = this.chaishun3(lack, hasPais, minCard, false, false, sameList[0].v, sameList[1].v, sameList[2].v);
			if (!chaisame) {
				return false;
			} else {
				return true;
			}
		} else if (sameList.length > 3) {
			var minVal = minCard.v;
			var modelList = this.getSameModel(minVal);
			for (var key in modelList) {
				var model = modelList[key];
				var copyLack = lack.clone();
				var copyHasPais = ArrayUtil.clone(hasPais);
				var chaisame = this.chaishun3(copyLack, copyHasPais, minCard, false, false, model[0], model[1], minVal);
				if (chaisame) {
					lack.copy(copyLack);
					return true;
				}
			}
		}
		return false;
	},

	/**
	 * 拆坎子
	 * @param hasPais canoperateHandPais
	 */
	chaikan: function(lack, hasPais, minCard) {
		var sameValList = this.findCountByVal(hasPais, minCard, true);
		if (sameValList.length == 3) {
			var chaiSame = this.chaishun3(lack, hasPais, minCard, false, false, sameValList[0].v, sameValList[1].v, sameValList[2].v);
			if (chaiSame) {
				return true;
			}
		}
		return false;
	},

	chaiSame0: function(lack, hasPais, minCard) {
		var sameList = this.findCountByVal(hasPais, minCard, false);
		if (sameList.length < 3) {
			return false;
		}

		// 拆相同
		var copyLack = lack.clone();
		var copyHasPais = ArrayUtil.clone(hasPais);
		if (this.chaikan(copyLack, copyHasPais, minCard)) {
			lack.copy(copyLack);
			return true;
		}

		// 拆相同2
		var chaiSame = this.chaiSame(copyLack, copyHasPais, minCard, sameList);
		if (chaiSame) {
			lack.copy(copyLack);
			return true;
		}
		return false;
	},

	/**
	 * 拆顺
	 */
	chaishun: function(lack, hasPais) {
		if (hasPais.length == 0) {
			return true;
		}
		this.sortMin(hasPais);
		var minCard = hasPais[0];
		var minVal = minCard.v;
		var minPai = minCard.n;
		var isTryChaiSame = false;
		var copyLack = null;
		var copyHasPais = null;
		if (minPai != 1 && minPai != 2) {
			// 如果不是1 和2 尝试拆相同
			isTryChaiSame = true;
			var isHu = this.chaiSame0(lack, hasPais, minCard);
			if (isHu) {
				return true;
			}
		} else {
			copyLack = lack.clone();
			copyHasPais = ArrayUtil.clone(hasPais);
		}

		// 拆顺子
		var pai1 = minVal;
		if (pai1 % 100 == 10) {
			pai1 = pai1 - 2;

		} else if (pai1 % 100 == 9) {
			pai1 = pai1 - 1;
		}
		var pai2 = pai1 + 1;
		var pai3 = pai2 + 1;
		var check2710 = false;
		var chaishun = false;
		var check1510 = (minCard.n == 1 && PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ && PHZRoomModel.intParams[12] == 1)
						|| (minCard.n == 1 && PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK && PHZRoomModel.intParams[14] == 1)
						|| (minCard.n == 1 && PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ && PHZRoomModel.intParams[32] == 1);
		if (!lack.isHasFail2710Val(minVal) && minCard.n == 2) {
			// 2 7 10
			var getCase = this.isBig(minCard) ? 100 : 0;
			var pai7 = getCase + 7;
			var pai10 = getCase + 10;
			check2710 = true;
			var copyLack2 = lack.clone();
			var copyHasPais2 = ArrayUtil.clone(hasPais);
			chaishun = this.chaiShun(copyLack2, copyHasPais2, minCard, true, check2710, pai1, pai7, pai10);
			if (chaishun) {
				lack.copy(copyLack2);
			} else {
				// 拆2 7 10组合失败
				chaishun = this.chaiShun(lack, hasPais, minCard, true, false, pai1, pai2, pai3);
			}
		}else if (check1510) {
			// 2 7 10
			var getCase = this.isBig(minCard) ? 100 : 0;
			var pai5 = getCase + 5;
			var pai10 = getCase + 10;
			var copyLack2 = lack.clone();
			var copyHasPais2 = ArrayUtil.clone(hasPais);
			chaishun = this.chaiShun(copyLack2, copyHasPais2, minCard, true, check2710, pai1, pai5, pai10);
			if (chaishun) {
				lack.copy(copyLack2);
			} else {
				// 拆2 7 10组合失败
				chaishun = this.chaiShun(lack, hasPais, minCard, true, false, pai1, pai2, pai3);
			}
		}  else {
			// 拆顺
			chaishun = this.chaiShun(lack, hasPais, minCard, true, check2710, pai1, pai2, pai3);
		}

		if (!chaishun && !isTryChaiSame) {
			chaishun = this.chaiSame0(copyLack, copyHasPais, minCard);
			if (chaishun) {
				lack.copy(copyLack);
			}
		}
		return chaishun;
	},

	chaiShun: function(lack, hasPais, minCard, isShun, check2710, pai1, pai2, pai3) {
		// 拆顺
		var chaishun = this.chaishun3(lack, hasPais, minCard, true, check2710, pai1, pai2, pai3);
		if (!chaishun) {
			if (check2710) {
				return this.chaishun(lack, hasPais);
			}
			// 拆同牌
			return false;
		}
		return true;
	},

	/**
	 * @return
	 */
	getSameModel: function(val) {
		var result = [];
		var smallpai = val % 100;
		var bigpai = 100 + smallpai;
		var model1 = [bigpai, smallpai];
		var model2 = [bigpai, bigpai];
		var model3 = [smallpai, smallpai];
		result.push(model2);
		result.push(model3);
		result.push(model1);
		return result;
	},

	chaishun3: function(lack, hasPais, minCard, isShun, check2710, pai1, pai2, pai3) {
		var minVal = minCard.v;
		// cc.log("chaishun3::"+pai1+"_"+pai2+"_"+pai3);e

		var lackList = [];
		var num1 = this.getVal(hasPais, pai1);
		var num2 = this.getVal(hasPais, pai2, [num1]);
		var num3 = this.getVal(hasPais, pai3, [num1, num2]);
		
		// 找到一句话的
		var hasMajiangList = [];
		if (num1 != null) {
			hasMajiangList.push(num1);
		}
		if (num2 != null) {
			hasMajiangList.push(num2);
		}
		if (num3 != null) {
			hasMajiangList.push(num3);
		}

		// 一句话缺少的
		if (num1 == null) {
			lackList.push(pai1);
		}
		if (num2 == null) {
			lackList.push(pai2);
		}
		if (num3 == null) {
			lackList.push(pai3);
		}

		var lackNum = lackList.length;
		if (lackNum > 0) {
			// 看看三张牌是否相同
			if (lack.getHongzhongNum() <= 0) {
				if (check2710) {
					lack.addFail2710Val(minVal);
					return this.chaipai(lack, hasPais);
				}

				// 检查是不是对子
				// if (lack.isNeedDui()) {
				// List<PaohzCard> count = getVal(hasPais,
				// hasMajiangList.get(0).getVal());
				// if (count.size() == 2) {
				// lack.setNeedDui(false);
				// hasPais.removeAll(count);
				// return chaipai(lack, hasPais);
				// }
				// }

				return false;
			}

			// 做成一句话缺少2张以上的，没有将优先做将
			if (lackNum >= 2) {
				// 补坎子
				var count = this.getVals(hasPais, hasMajiangList[0].v);
				if (count.length == 2) {
					if (lack.isNeedDui()) {
						// 没有将做将
						lack.setNeedDui(false);
						hasPais.removeAll(count);
						return this.chaipai(lack, hasPais);
					}

					// 拿一张红中补坎子
					lack.changeHongzhong(-1);
					lack.addLack(count[0].v);
					hasPais.removeAll(count);
					return this.chaipai(lack, hasPais);
				}

				// 做将
				if (lack.isNeedDui() && lack.getHongzhongNum() > 0) {
					lack.changeHongzhong(-1);
					lack.setNeedDui(false);
					this.removeAll(hasPais, count);
					lack.addLack(count[0].v);
					return this.chaipai(lack, hasPais);
				}
			} else if (lackNum == 1) {
				// 做将
				if (lack.isNeedDui() && lack.getHongzhongNum() > 0) {
					lack.changeHongzhong(-1);
					lack.setNeedDui(false);
					this.remove(hasPais, minCard);
					lack.addLack(minCard.v);
					return this.chaipai(lack, hasPais);
				}

				var count = this.getVals(hasPais, hasMajiangList[0].v);
				if (count.length == 2 && lack.getHongzhongNum() > 0) {
					lack.changeHongzhong(-1);
					lack.addLack(count[0].v);
					this.removeAll(hasPais, count);
					return this.chaipai(lack, hasPais);
				}
			}

			// 如果有红中则补上
			if (lack.getHongzhongNum() >= lackNum) {
				lack.changeHongzhong(-lackNum);
				hasPais.removeAll(hasMajiangList);
				lack.addAllLack(lackList);

			} else {
				return false;
			}
		} else {
			// 可以一句话
			if (lack.getHongzhongNum() > 0) {
				var count1 = this.getVals(hasPais, hasMajiangList[0].v);
				var count2 = this.getVals(hasPais, hasMajiangList[1].v);
				var count3 = this.getVals(hasPais, hasMajiangList[2].v);
				if (count1.length >= 2 && count2.length == 1 && count3.length == 1) {
					this.removeAll(hasPais, count1);
					lack.changeHongzhong(-1);
					lack.addLack(hasMajiangList[0].v);
					this.chaipai(lack, hasPais);
				}
			}
			var huxi = 0;
			var action = PHZAction.CHI;
			if (isShun) {
				var minPai = minCard.n;
				if (minPai == 1 || minPai == 2) {
					// 123 和 2710 加胡息
					huxi = this.getShunHuxi(hasMajiangList);
				}
			} else {
				if (this.isSameCard(hasMajiangList)) {
					// 如果是三个一模一样的
					action = PHZAction.PENG;
					if (lack.isSelfMo()) {
						action = PHZAction.WEI;
					}

					//cc.log("lack.isSelfMo()==="+lack.isSelfMo());
					huxi = this.getOutCardHuxi(action, hasMajiangList);
				}
			}

			// cc.log("huxi =",huxi);
			lack.addPhzHuCards(action, this.toPhzCardIds(hasMajiangList), huxi);
			lack.changeHuxi(huxi);

			// cc.log("chaishun3 hasMajiangList::"+JSON.stringify(hasMajiangList));

			this.removeAll(hasPais, hasMajiangList);


			//cc.log("chaishun3 hasPais::"+JSON.stringify(hasPais));
			return this.chaipai(lack, hasPais);
		}
		return this.chaipai(lack, hasPais);
	},

	/**
	 * 去除重复后得到val的集合
	 *
	 * @param cards
	 * @return
	 */
	getDistinctVal: function(cards) {
		var valIds = {};
		if (cards == null) {
			return valIds;
		}
		for (var key in cards) {
			var phz = cards[key];
			if (valIds[phz.v]) {
				valIds[phz.v] += 1;
			} else {
				valIds[phz.v] = 1;
			}
		}
		return valIds;
	},

	/**
	 * 算出的牌的胡息
	 *
	 * @param action
	 *
	 * @param cards
	 * @return
	 */
	getOutCardHuxi: function(action, cards) {
		var huxi = 0;
		if (action == 0) {
			return huxi;
		}
		if (action == PHZAction.TI) {
			// 大的12分 小的9分
			var valmap = this.getDistinctVal(cards);
			for(var key in valmap) {
				var entry = valmap[key];
				if (entry != 4) {
					continue;
				}
				if (key > 100) {
					// 大的
					huxi += 12;
				} else {
					huxi += 9;
				}
			}
		} else if (action == PHZAction.PAO) {
			// 大的9分 小的6分
			var valmap = this.getDistinctVal(cards);
			for(var key in valmap) {
				var entry = valmap[key];
				if (entry != 4) {
					continue;
				}
				if (key > 100) {
					// 大的
					huxi += 9;
				} else {
					huxi += 6;
				}

			}
		} else if (action == PHZAction.CHI) {
			// 吃 只有123 和2710 大的6分 小的3分
			var copy = ArrayUtil.clone(cards);
			this.sortMin(copy);
			huxi = this.getShunHuxi(copy);
		} else if (action == PHZAction.PENG) {
			// 大的3分 小的1分
			var valmap = this.getDistinctVal(cards);
			for (var key in valmap) {
				var entry = valmap[key];
				if (entry != 3) {
					continue;
				}
				if (key > 100) {
					// 大的
					huxi += 3;
				} else {
					huxi += 1;
				}
			}

		} else if (action == PHZAction.WEI || action == PHZAction.CHOU_WEI) {
			// 大的6分 小的3分
			var valmap = this.getDistinctVal(cards);
			for (var key in valmap) {
				var entry = valmap[key];
				if (entry != 3) {
					continue;
				}
				if (key > 100) {
					// 大的
					huxi += 6;
				} else {
					huxi += 3;
				}
			}

		}
		//cc.log("getOutCardHuxi===action=="+action+",huxi==="+huxi)
		return huxi;
	},

	/**
	 * 算顺子的胡息 123 和2710 分大小 大6小3
	 *
	 * @param hasMajiangList
	 * @return
	 */

	getShunHuxi: function(hasMajiangList) {
		// cc.log("hasMajiangList = ",JSON.stringify(hasMajiangList));
		var isSamePai = true;
		var minPai = 0;
		for (var key in hasMajiangList) {
			var card = hasMajiangList[key];
			if (minPai == 0) {
				minPai = card.n;
				continue;
			}
			if (minPai != card.n) {
				isSamePai = false;
				break;
			}

		}
		if (isSamePai) {
			return 0;
		}
		var minCard = hasMajiangList[0];
		if (minCard.n == 1) {
			if (this.isBig(minCard)) {
				return 6;
			} else {
				// cc.log("11111111111111111111111333===>");
				return 3;
			}
		} else if (minCard.n == 2) {
			for (var key in hasMajiangList) {
				var card = hasMajiangList[key];
				if (ArrayUtil.indexOf(PHZ2710List, card.n) < 0){//!PHZ2710List.contains(card.getPai())) {
					return 0;
				}
			}
			if (this.isBig(minCard)) {
				return 6;
			} else {
				return 3;
			}
		}
		return 0;
	},

	getPaohuziHandCardBean: function(handPais) {
		var card = new PaohuziHandCard();
		var copy = ArrayUtil.clone(handPais);//new ArrayList<>(handPais);
		card.setHandCards(ArrayUtil.clone(handPais));

		var valArr = this.getMax(copy);
		card.setIndexArr(valArr);
		// 去掉4张和3张
		var index3 = valArr.getPaohzCardIndex(3);

		if (index3 != null) {
			this.removeAll(copy, index3.getPaohzList());
		}
		var index2 = valArr.getPaohzCardIndex(2);

		//cc.log("index2==="+JSON.stringify(index2));
		if (index2 != null) {
			this.removeAll(copy, index2.getPaohzList());
		}
		//cc.log("copy======="+JSON.stringify(copy));
		card.setOperateCards(copy);
		return card;
	},



/**
	 * 是否胡牌
	 * //needDui 没有跑，没有提为false，否则为true
	 * //isPaoHu false
	 * //已经吃/碰/提/跑等的胡息数
	 * //isSelfMo true
	 * //disCard 当前出的最后一张牌
	 * //handCardBean
	 */
	isHu: function(handCardBean, disCard, isSelfMo, outCardHuxi, needDui, isPaoHu) {
		var lack = new PaohuziHuLack(0);
		// lack.changeHuxi(outCardHuxi);
		lack.setSelfMo(isSelfMo);
		lack.setCheckCard(disCard);
		// int count = handCardBean.getHandCards().size();
		// if (count % 3 != 0) {
		lack.setNeedDui(needDui);
		// }
		var arr = handCardBean.getIndexArr();
		// 手上有3个的
		var index2 = arr.getPaohzCardIndex(2);
		if (index2 != null) {
			var list = index2.getValList();
			for (var key in list) {
				var val = list[key];
				//cc.log("val========="+val);
				if (disCard != null && val == disCard.v) {
					 //抓到手上的牌可以不用强制组出3个
					//cc.log("disCard.v========="+disCard.v);
					var allPhz = index2.getPaohzValMap()[val];
					for (var i=0;i<allPhz.length;i++) {
						handCardBean.getOperateCards().push(allPhz[i]);
					}
					continue;
				}
				var huxi = 0;
				if (val > 100) {
					// 大的6分
					huxi = 6;
				} else {
					// 小的3分
					huxi = 3;
				}
				lack.changeHuxi(huxi);
				var cards = index2.getPaohzValMap()[val];
				lack.addPhzHuCards(PHZAction.KAN, this.toPhzCardIds(cards), huxi);
			}
		}
		var index3 = arr.getPaohzCardIndex(3);
		if (index3 != null) {
			var list = index3.getValList();
			for (var key in list) {
				var val = list[key];
				var huxi = 0;
				var paoHu = false;
				var action = PHZAction.PAO;
				if (disCard != null && val == disCard.v) {
					if (!isPaoHu) {
						action = PHZAction.KAN;
						if (val > 100) {
							// 坎大的6分
							huxi = 6;
						} else {
							// 坎小的3分
							huxi = 3;
						}
						handCardBean.getOperateCards().push(disCard);
					} else if (isSelfMo) {
						if (val > 100) {
							// 大的12分
							huxi = 12;
						} else {
							// 小的3分
							huxi = 9;
						}
						action = PHZAction.TI;
					} else {
						action = PHZAction.PAO;
						paoHu = true;
						if (val > 100) {
							// 碰大的6分
							huxi = 9;
						} else {
							// 小的3分
							huxi = 6;
						}
						var cards = index3.getPaohzValMap()[val];
						// cards.remove(disCard);
						lack.changeHuxi(huxi);
						lack.addPhzHuCards(action, this.toPhzCardIds(cards), huxi);
						// handCardBean.getOperateCards().add(disCard);
					}
				} else {
					//直接手上有4张
					action = PHZAction.TI;
					if (val > 100) {
						// 大的6分
						huxi = 12;
					} else {
						// 小的3分
						huxi = 9;
					}
					lack.setNeedDui(true);
				}

				if (!paoHu) {
					lack.changeHuxi(huxi);
					var cards = index3.getPaohzValMap()[val];
					if (!isPaoHu) {
						this.remove(cards, disCard);
					}
					lack.addPhzHuCards(action, this.toPhzCardIds(cards), huxi);
				}

			}
		}
		// 需要对子才能胡牌
		if (lack.isNeedDui()) {
			var duiziList = arr.getDuizis();
			var lackList = [];

			for (var key in duiziList) {
				var list = duiziList[key];
				var copy = ArrayUtil.clone(handCardBean.getOperateCards());
				// List<PaohzCard> list = valEntry.getValue();
				if (!this.containsAll(copy,list)) {
					continue;
				}
				var i = 0;
				var duizi = [];
				for (var key1 in list) {
					var phz = list[key1];
					i++;
					duizi.push(phz.c);
					this.remove(copy,phz);
					if (i >= 2) {
						break;
					}
				}
				var lackCopy = new PaohuziHuLack(0);
				lackCopy.setSelfMo(isSelfMo);
				lackCopy.setCheckCard(disCard);
				lackCopy.changeHuxi(lack.getHuxi());
				if (lack.getPhzHuCards() != null) {
					lackCopy.setPhzHuCards(ArrayUtil.clone(lack.getPhzHuCards()));
				}
				lackCopy.addPhzHuCards(0, duizi, 0);
				//cc.log("copy::"+JSON.stringify(copy));
				//cc.log("lackCopy::"+JSON.stringify(lackCopy));
				var hu = this.chaipai(lackCopy, copy);
				if (hu) {
					lackCopy.setHu(hu);
					lackList.push(lackCopy);
				}

			}
			if (lackList.length > 0) {
				var maxHuxi = 0;
				var maxHuxiLack = null;
				for (var key in lackList) {
					var copy = lackList[key];
					if (maxHuxi == 0 || copy.getHuxi() > maxHuxi) {
						maxHuxi = copy.getHuxi();
						maxHuxiLack = copy;
					}
				}
				return maxHuxiLack;

			}

		} else {
			//cc.log("handCardBean.getOperateCards()========="+JSON.stringify(handCardBean.getOperateCards()));
			var hu = this.chaipai(lack, handCardBean.getOperateCards());
			lack.setHu(hu);
		}
		return lack;
	},

	/**
	 * 将array组合成用delimiter分隔的字符串
	 * @return String
	 */
	explodePhz: function(str, delimiter) {
		//var list = [];
		//if (!str)
		//	return list;
		//String strArray[] = str.split(delimiter);
        //
		//for (String val : strArray) {
		//	PaohzCard phz = null;
		//	if (val.startsWith("mj")) {
		//		phz = PaohzCard.valueOf(PaohzCard.class, val);
		//	} else {
		//		phz = PaohzCard.getPaohzCard((Integer.valueOf(val)));
		//	}
		//	list.add(phz);
		//}
		//return list;
	},

	/**
	 * 将array组合成用delimiter分隔的字符串
	 *
	 * @param array
	 * @param delimiter
	 * @return String
	 */
	implodePhz: function(array, delimiter) {
		//if (array == null) {
		//	return "";
		//}
		//StringBuilder sb = new StringBuilder("");
		//for (PaohzCard i : array) {
		//	sb.append(i.getId());
		//	sb.append(delimiter);
		//}
		//if (sb.length() > 0) {
		//	sb.delete(sb.length() - 1, sb.length());
		//}
		//return sb.toString();
	}
})

