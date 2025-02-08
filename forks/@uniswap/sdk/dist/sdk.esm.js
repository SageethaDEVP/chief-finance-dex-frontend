import JSBI from 'jsbi'
export { default as JSBI } from 'jsbi'
import { Token, Currency, Fraction, TokenAmount, CurrencyAmount, Price, Route, Percent, Pair } from '@bidelity/sdk'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'
import { getAddress, getCreate2Address } from '@ethersproject/address'
import { keccak256, pack } from '@ethersproject/solidity'
import { Contract } from '@ethersproject/contracts'
import { getNetwork } from '@ethersproject/networks'
import { getDefaultProvider } from '@ethersproject/providers'
import IUniswapV2Pair from '@uniswap/v2-core/build/IUniswapV2Pair.json'

var _SOLIDITY_TYPE_MAXIMA
var ChainId
;(function (ChainId) {
  ChainId[(ChainId['MAINNET'] = 1)] = 'MAINNET'
  ChainId[(ChainId['SEPOLIA'] = 11155111)] = 'SEPOLIA'
  ChainId[(ChainId['BINANCETEST'] = 97)] = 'BINANCETEST'
  ChainId[(ChainId['AMOY'] = 80002)] = 'AMOY'
  ChainId[(ChainId['ARBITRUM'] = 421614)] = 'ARBITRUM'
  ChainId[(ChainId['FANTOM'] = 4002)] = 'FANTOM'
  ChainId[(ChainId['AVALANCE'] = 43113)] = 'AVALANCE'
  ChainId[(ChainId['OPTIMISM'] = 11155420)] = 'OPTIMISM'
  ChainId[(ChainId['LINEA'] = 59141)] = 'LINEA'
  ChainId[(ChainId['CELO'] = 44787)] = 'CELO'
  ChainId[(ChainId['BASE'] = 84532)] = 'BASE'
  ChainId[(ChainId['BLAST'] = 168587773)] = 'BLAST'
  ChainId[(ChainId['AURORA'] = 1313161555)] = 'AURORA'
  ChainId[(ChainId['SCROLL'] = 534351)] = 'SCROLL'
  ChainId[(ChainId['MOONBASE'] = 1287)] = 'MOONBASE'
})(ChainId || (ChainId = {}))

var TradeType
;(function (TradeType) {
  TradeType[(TradeType['EXACT_INPUT'] = 0)] = 'EXACT_INPUT'
  TradeType[(TradeType['EXACT_OUTPUT'] = 1)] = 'EXACT_OUTPUT'
})(TradeType || (TradeType = {}))

var Rounding
;(function (Rounding) {
  Rounding[(Rounding['ROUND_DOWN'] = 0)] = 'ROUND_DOWN'
  Rounding[(Rounding['ROUND_HALF_UP'] = 1)] = 'ROUND_HALF_UP'
  Rounding[(Rounding['ROUND_UP'] = 2)] = 'ROUND_UP'
})(Rounding || (Rounding = {}))

const FACTORY_CONTRACT_SECONDARY_ADDRESS = process.env.REACT_APP_FACTORY_SECONDARY_ADDRESS
const INIT_CODE_HASH_M_NET = process.env.REACT_APP_INIT_CODE_HASH_UNISWAP

var FACTORY_ADDRESS = FACTORY_CONTRACT_SECONDARY_ADDRESS
var INIT_CODE_HASH = INIT_CODE_HASH_M_NET
var MINIMUM_LIQUIDITY = /*#__PURE__*/ JSBI.BigInt(1000) // exports for internal consumption

var ZERO = /*#__PURE__*/ JSBI.BigInt(0)
var ONE = /*#__PURE__*/ JSBI.BigInt(1)
var TWO = /*#__PURE__*/ JSBI.BigInt(2)
var THREE = /*#__PURE__*/ JSBI.BigInt(3)
var FIVE = /*#__PURE__*/ JSBI.BigInt(5)
var _997 = /*#__PURE__*/ JSBI.BigInt(997)
var _1000 = /*#__PURE__*/ JSBI.BigInt(1000)
var SolidityType
;(function (SolidityType) {
  SolidityType['uint8'] = 'uint8'
  SolidityType['uint256'] = 'uint256'
})(SolidityType || (SolidityType = {}))

var SOLIDITY_TYPE_MAXIMA =
  ((_SOLIDITY_TYPE_MAXIMA = {}),
  (_SOLIDITY_TYPE_MAXIMA[SolidityType.uint8] = /*#__PURE__*/ JSBI.BigInt('0xff')),
  (_SOLIDITY_TYPE_MAXIMA[SolidityType.uint256] = /*#__PURE__*/ JSBI.BigInt(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  )),
  _SOLIDITY_TYPE_MAXIMA)

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }

      return target
    }

  return _extends.apply(this, arguments)
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype)
  subClass.prototype.constructor = subClass
  subClass.__proto__ = superClass
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
      }
  return _getPrototypeOf(o)
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p
      return o
    }

  return _setPrototypeOf(o, p)
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false
  if (Reflect.construct.sham) return false
  if (typeof Proxy === 'function') return true

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}))
    return true
  } catch (e) {
    return false
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null]
      a.push.apply(a, args)
      var Constructor = Function.bind.apply(Parent, a)
      var instance = new Constructor()
      if (Class) _setPrototypeOf(instance, Class.prototype)
      return instance
    }
  }

  return _construct.apply(null, arguments)
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf('[native code]') !== -1
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === 'function' ? new Map() : undefined

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class

    if (typeof Class !== 'function') {
      throw new TypeError('Super expression must either be null or a function')
    }

    if (typeof _cache !== 'undefined') {
      if (_cache.has(Class)) return _cache.get(Class)

      _cache.set(Class, Wrapper)
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor)
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true,
      },
    })
    return _setPrototypeOf(Wrapper, Class)
  }

  return _wrapNativeSuper(Class)
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
  }

  return self
}

// see https://stackoverflow.com/a/41102306
var CAN_SET_PROTOTYPE = 'setPrototypeOf' in Object
/**
 * Indicates that the pair has insufficient reserves for a desired output amount. I.e. the amount of output cannot be
 * obtained by sending any amount of input.
 */

var InsufficientReservesError = /*#__PURE__*/ (function (_Error) {
  _inheritsLoose(InsufficientReservesError, _Error)

  function InsufficientReservesError() {
    var _this

    _this = _Error.call(this) || this
    _this.isInsufficientReservesError = true
    _this.name = _this.constructor.name
    if (CAN_SET_PROTOTYPE)
      Object.setPrototypeOf(
        _assertThisInitialized(_this),
        (this instanceof InsufficientReservesError ? this.constructor : void 0).prototype
      )
    return _this
  }

  return InsufficientReservesError
})(/*#__PURE__*/ _wrapNativeSuper(Error))
/**
 * Indicates that the input amount is too small to produce any amount of output. I.e. the amount of input sent is less
 * than the price of a single unit of output after fees.
 */

var InsufficientInputAmountError = /*#__PURE__*/ (function (_Error2) {
  _inheritsLoose(InsufficientInputAmountError, _Error2)

  function InsufficientInputAmountError() {
    var _this2

    _this2 = _Error2.call(this) || this
    _this2.isInsufficientInputAmountError = true
    _this2.name = _this2.constructor.name
    if (CAN_SET_PROTOTYPE)
      Object.setPrototypeOf(
        _assertThisInitialized(_this2),
        (this instanceof InsufficientInputAmountError ? this.constructor : void 0).prototype
      )
    return _this2
  }

  return InsufficientInputAmountError
})(/*#__PURE__*/ _wrapNativeSuper(Error))

var _WETH
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */

/**
 * Compares two currencies for equality
 */

function currencyEquals(currencyA, currencyB) {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}
var WETH =
  ((_WETH = {}),
  (_WETH[ChainId.MAINNET] = /*#__PURE__*/ new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  )),
  (_WETH[ChainId.SEPOLIA] = /*#__PURE__*/ new Token(
    ChainId.SEPOLIA,
    '0xCa3949080ce2c1134dbc0BEf36F0cB49f44B918D',
    18,
    'WETH',
    'Wrapped Ether'
  )),
  (_WETH[ChainId.BINANCETEST] = /*#__PURE__*/ new Token(
    ChainId.BINANCETEST,
    '0x1D330e82FE5742704a40e1ADbbED3e22c3250921',
    18,
    'WBNB',
    'Wrapped BNB'
  )),
  (_WETH[ChainId.AMOY] = /*#__PURE__*/ new Token(
    ChainId.AMOY,
    '0x01805a841ece00cf680996bF4B4e21746C68Fd4e',
    18,
    'WMATIC',
    'Wrapped MATIC'
  )),
  (_WETH[ChainId.ARBITRUM] = /*#__PURE__*/ new Token(
    ChainId.ARBITRUM,
    '0xa1012ee0bee96dcbc08267fc35e6b06e64e4ac45',
    18,
    'WARB',
    'Wrapped ARB'
  )),
  (_WETH[ChainId.FANTOM] = /*#__PURE__*/ new Token(
    ChainId.FANTOM,
    '0xa1012EE0BEE96dcbC08267Fc35E6B06E64E4AC45',
    18,
    'WFTM',
    'Wrapped FTM'
  )),
  (_WETH[ChainId.AVALANCE] = /*#__PURE__*/ new Token(
    ChainId.AVALANCE,
    '0xF05d5519A45C6D877B7D86B8bA89A6Af0F875360',
    18,
    'WAVAX',
    'Wrapped AVAX'
  )),
  (_WETH[ChainId.OPTIMISM] = /*#__PURE__*/ new Token(
    ChainId.OPTIMISM,
    '0x01805a841ece00cf680996bF4B4e21746C68Fd4e',
    18,
    'WOPT',
    'Wrapped OPT'
  )),
  (_WETH[ChainId.LINEA] = /*#__PURE__*/ new Token(
    ChainId.LINEA,
    '0x2B8Aa9Bc15870A79DEf1cD4A3182287B08AcE30A',
    18,
    'WLINEAETH',
    'Wrapped ETH'
  )),
  (_WETH[ChainId.CELO] = /*#__PURE__*/ new Token(
    ChainId.CELO,
    '0xF771707F18751a644B4066d6818cbe11B96Ea9a3',
    18,
    'WCELO',
    'Wrapped CELO'
  )),
  (_WETH[ChainId.BASE] = /*#__PURE__*/ new Token(
    ChainId.BASE,
    '0x40b250Dc7c789F3f8f4CdEf2cE369421869eA380',
    18,
    'WETHER',
    'Wrapped ETH'
  )),
  (_WETH[ChainId.BLAST] = /*#__PURE__*/ new Token(
    ChainId.BLAST,
    '0xC8481648F5Ff2Fe46027a4E5B49165A55DE106Fd',
    18,
    'WETHER',
    'Wrapped ETH'
  )),
  (_WETH[ChainId.AURORA] = /*#__PURE__*/ new Token(
    ChainId.AURORA,
    '0xa19Ab77b849d4b2D137b0D0d148b4566183557Bc',
    18,
    'WETHER',
    'Wrapped ETH'
  )),
  (_WETH[ChainId.SCROLL] = /*#__PURE__*/ new Token(
    ChainId.SCROLL,
    '0xC8481648F5Ff2Fe46027a4E5B49165A55DE106Fd',
    18,
    'WETHER',
    'Wrapped ETH'
  )),
  (_WETH[ChainId.MOONBASE] = /*#__PURE__*/ new Token(
    ChainId.MOONBASE,
    '0xa1012EE0BEE96dcbC08267Fc35E6B06E64E4AC45',
    18,
    'WDEV',
    'Wrapped DEV'
  )),
  _WETH)

function validateSolidityTypeInstance(value, solidityType) {
  !JSBI.greaterThanOrEqual(value, ZERO)
    ? process.env.NODE_ENV !== 'production'
      ? invariant(false, value + ' is not a ' + solidityType + '.')
      : invariant(false)
    : void 0
  !JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType])
    ? process.env.NODE_ENV !== 'production'
      ? invariant(false, value + ' is not a ' + solidityType + '.')
      : invariant(false)
    : void 0
} // warns if addresses are not checksummed

function validateAndParseAddress(address) {
  try {
    var checksummedAddress = getAddress(address)
    process.env.NODE_ENV !== 'production'
      ? warning(address === checksummedAddress, address + ' is not checksummed.')
      : void 0
    return checksummedAddress
  } catch (error) {
    process.env.NODE_ENV !== 'production' ? invariant(false, address + ' is not a valid address.') : invariant(false)
  }
}
function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof JSBI
    ? bigintIsh
    : typeof bigintIsh === 'bigint'
    ? JSBI.BigInt(bigintIsh.toString())
    : JSBI.BigInt(bigintIsh)
} // mock the on-chain sqrt function

function sqrt(y) {
  validateSolidityTypeInstance(y, SolidityType.uint256)
  var z = ZERO
  var x

  if (JSBI.greaterThan(y, THREE)) {
    z = y
    x = JSBI.add(JSBI.divide(y, TWO), ONE)

    while (JSBI.lessThan(x, z)) {
      z = x
      x = JSBI.divide(JSBI.add(JSBI.divide(y, x), x), TWO)
    }
  } else if (JSBI.notEqual(y, ZERO)) {
    z = ONE
  }

  return z
} // given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item

function sortedInsert(items, add, maxSize, comparator) {
  !(maxSize > 0)
    ? process.env.NODE_ENV !== 'production'
      ? invariant(false, 'MAX_SIZE_ZERO')
      : invariant(false)
    : void 0 // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize

  !(items.length <= maxSize)
    ? process.env.NODE_ENV !== 'production'
      ? invariant(false, 'ITEMS_SIZE')
      : invariant(false)
    : void 0 // short circuit first item add

  if (items.length === 0) {
    items.push(add)
    return null
  } else {
    var isFull = items.length === maxSize // short circuit if full and the additional item does not come before the last item

    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add
    }

    var lo = 0,
      hi = items.length

    while (lo < hi) {
      var mid = (lo + hi) >>> 1

      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1
      } else {
        hi = mid
      }
    }

    items.splice(lo, 0, add)
    return isFull ? items.pop() : null
  }
}

/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */

var ETHER = Currency.ETHER

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */

function computePriceImpact(midPrice, inputAmount, outputAmount) {
  var exactQuote = midPrice.raw.multiply(inputAmount.raw) // calculate slippage := (exactQuote - outputAmount) / exactQuote

  var slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote)
  return new Percent(slippage.numerator, slippage.denominator)
} // comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first

function inputOutputComparator(a, b) {
  // must have same input and output token for comparison
  !currencyEquals(a.inputAmount.currency, b.inputAmount.currency)
    ? process.env.NODE_ENV !== 'production'
      ? invariant(false, 'INPUT_CURRENCY')
      : invariant(false)
    : void 0
  !currencyEquals(a.outputAmount.currency, b.outputAmount.currency)
    ? process.env.NODE_ENV !== 'production'
      ? invariant(false, 'OUTPUT_CURRENCY')
      : invariant(false)
    : void 0

  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0
    } // trade A requires less input than trade B, so A should come first

    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1
    } else {
      return 1
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1
    } else {
      return -1
    }
  }
} // extension of the input output comparator that also considers other dimensions of the trade in ranking them

function tradeComparator(a, b) {
  var ioComp = inputOutputComparator(a, b)

  if (ioComp !== 0) {
    return ioComp
  } // consider lowest slippage next, since these are less likely to fail

  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1
  } // finally consider the number of hops since each hop costs gas

  return a.route.path.length - b.route.path.length
}
/**
 * Given a currency amount and a chain ID, returns the equivalent representation as the token amount.
 * In other words, if the currency is ETHER, returns the WETH token amount for the given chain. Otherwise, returns
 * the input currency amount.
 */

function wrappedAmount(currencyAmount, chainId) {
  if (currencyAmount instanceof TokenAmount) return currencyAmount
  if (currencyAmount.currency === ETHER) return new TokenAmount(WETH[chainId], currencyAmount.raw)
  process.env.NODE_ENV !== 'production' ? invariant(false, 'CURRENCY') : invariant(false)
}

function wrappedCurrency(currency, chainId) {
  if (currency instanceof Token) return currency
  if (currency === ETHER) return WETH[chainId]
  process.env.NODE_ENV !== 'production' ? invariant(false, 'CURRENCY') : invariant(false)
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */

var Trade = /*#__PURE__*/ (function () {
  function Trade(route, amount, tradeType) {
    var amounts = new Array(route.path.length)
    var nextPairs = new Array(route.pairs.length)

    if (tradeType === TradeType.EXACT_INPUT) {
      !currencyEquals(amount.currency, route.input)
        ? process.env.NODE_ENV !== 'production'
          ? invariant(false, 'INPUT')
          : invariant(false)
        : void 0
      amounts[0] = wrappedAmount(amount, route.chainId)

      for (var i = 0; i < route.path.length - 1; i++) {
        var pair = route.pairs[i]

        var _pair$getOutputAmount = pair.getOutputAmount(amounts[i]),
          outputAmount = _pair$getOutputAmount[0],
          nextPair = _pair$getOutputAmount[1]

        amounts[i + 1] = outputAmount
        nextPairs[i] = nextPair
      }
    } else {
      !currencyEquals(amount.currency, route.output)
        ? process.env.NODE_ENV !== 'production'
          ? invariant(false, 'OUTPUT')
          : invariant(false)
        : void 0
      amounts[amounts.length - 1] = wrappedAmount(amount, route.chainId)

      for (var _i = route.path.length - 1; _i > 0; _i--) {
        var _pair = route.pairs[_i - 1]

        var _pair$getInputAmount = _pair.getInputAmount(amounts[_i]),
          inputAmount = _pair$getInputAmount[0],
          _nextPair = _pair$getInputAmount[1]

        amounts[_i - 1] = inputAmount
        nextPairs[_i - 1] = _nextPair
      }
    }

    this.route = route
    this.tradeType = tradeType
    this.inputAmount =
      tradeType === TradeType.EXACT_INPUT
        ? amount
        : route.input === ETHER
        ? CurrencyAmount.ether(amounts[0].raw)
        : amounts[0]
    this.outputAmount =
      tradeType === TradeType.EXACT_OUTPUT
        ? amount
        : route.output === ETHER
        ? CurrencyAmount.ether(amounts[amounts.length - 1].raw)
        : amounts[amounts.length - 1]
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.raw,
      this.outputAmount.raw
    )
    this.nextMidPrice = Price.fromRoute(new Route(nextPairs, route.input))
    this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount)
  }
  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */

  Trade.exactIn = function exactIn(route, amountIn) {
    return new Trade(route, amountIn, TradeType.EXACT_INPUT)
  }
  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */

  Trade.exactOut = function exactOut(route, amountOut) {
    return new Trade(route, amountOut, TradeType.EXACT_OUTPUT)
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */

  var _proto = Trade.prototype

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'SLIPPAGE_TOLERANCE')
        : invariant(false)
      : void 0

    if (this.tradeType === TradeType.EXACT_OUTPUT) {
      return this.outputAmount
    } else {
      var slippageAdjustedAmountOut = new Fraction(ONE)
        .add(slippageTolerance)
        .invert()
        .multiply(this.outputAmount.raw).quotient
      return this.outputAmount instanceof TokenAmount
        ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut)
        : CurrencyAmount.ether(slippageAdjustedAmountOut)
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */

  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'SLIPPAGE_TOLERANCE')
        : invariant(false)
      : void 0

    if (this.tradeType === TradeType.EXACT_INPUT) {
      return this.inputAmount
    } else {
      var slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient
      return this.inputAmount instanceof TokenAmount
        ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn)
        : CurrencyAmount.ether(slippageAdjustedAmountIn)
    }
  }
  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */

  Trade.bestTradeExactIn = function bestTradeExactIn(
    pairs,
    currencyAmountIn,
    currencyOut,
    _temp, // used in recursion.
    currentPairs,
    originalAmountIn,
    bestTrades
  ) {
    var _ref = _temp === void 0 ? {} : _temp,
      _ref$maxNumResults = _ref.maxNumResults,
      maxNumResults = _ref$maxNumResults === void 0 ? 3 : _ref$maxNumResults,
      _ref$maxHops = _ref.maxHops,
      maxHops = _ref$maxHops === void 0 ? 3 : _ref$maxHops

    if (currentPairs === void 0) {
      currentPairs = []
    }

    if (originalAmountIn === void 0) {
      originalAmountIn = currencyAmountIn
    }

    if (bestTrades === void 0) {
      bestTrades = []
    }

    !(pairs.length > 0)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'PAIRS')
        : invariant(false)
      : void 0
    !(maxHops > 0) ? (process.env.NODE_ENV !== 'production' ? invariant(false, 'MAX_HOPS') : invariant(false)) : void 0
    !(originalAmountIn === currencyAmountIn || currentPairs.length > 0)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'INVALID_RECURSION')
        : invariant(false)
      : void 0
    var chainId =
      currencyAmountIn instanceof TokenAmount
        ? currencyAmountIn.token.chainId
        : currencyOut instanceof Token
        ? currencyOut.chainId
        : undefined
    !(chainId !== undefined)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'CHAIN_ID')
        : invariant(false)
      : void 0
    var amountIn = wrappedAmount(currencyAmountIn, chainId)
    var tokenOut = wrappedCurrency(currencyOut, chainId)

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i] // pair irrelevant

      if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token)) continue
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue
      var amountOut = void 0

      try {
        var _pair$getOutputAmount2 = pair.getOutputAmount(amountIn)

        amountOut = _pair$getOutputAmount2[0]
      } catch (error) {
        // input too low
        if (error.isInsufficientInputAmountError) {
          continue
        }

        throw error
      } // we have arrived at the output token, so this is the final trade of one of the paths

      if (amountOut.token.equals(tokenOut)) {
        sortedInsert(
          bestTrades,
          new Trade(
            new Route([].concat(currentPairs, [pair]), originalAmountIn.currency, currencyOut),
            originalAmountIn,
            TradeType.EXACT_INPUT
          ),
          maxNumResults,
          tradeComparator
        )
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length)) // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops

        Trade.bestTradeExactIn(
          pairsExcludingThisPair,
          amountOut,
          currencyOut,
          {
            maxNumResults: maxNumResults,
            maxHops: maxHops - 1,
          },
          [].concat(currentPairs, [pair]),
          originalAmountIn,
          bestTrades
        )
      }
    }

    return bestTrades
  }
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */

  Trade.bestTradeExactOut = function bestTradeExactOut(
    pairs,
    currencyIn,
    currencyAmountOut,
    _temp2, // used in recursion.
    currentPairs,
    originalAmountOut,
    bestTrades
  ) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$maxNumResults = _ref2.maxNumResults,
      maxNumResults = _ref2$maxNumResults === void 0 ? 3 : _ref2$maxNumResults,
      _ref2$maxHops = _ref2.maxHops,
      maxHops = _ref2$maxHops === void 0 ? 3 : _ref2$maxHops

    if (currentPairs === void 0) {
      currentPairs = []
    }

    if (originalAmountOut === void 0) {
      originalAmountOut = currencyAmountOut
    }

    if (bestTrades === void 0) {
      bestTrades = []
    }

    !(pairs.length > 0)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'PAIRS')
        : invariant(false)
      : void 0
    !(maxHops > 0) ? (process.env.NODE_ENV !== 'production' ? invariant(false, 'MAX_HOPS') : invariant(false)) : void 0
    !(originalAmountOut === currencyAmountOut || currentPairs.length > 0)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'INVALID_RECURSION')
        : invariant(false)
      : void 0
    var chainId =
      currencyAmountOut instanceof TokenAmount
        ? currencyAmountOut.token.chainId
        : currencyIn instanceof Token
        ? currencyIn.chainId
        : undefined
    !(chainId !== undefined)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'CHAIN_ID')
        : invariant(false)
      : void 0
    var amountOut = wrappedAmount(currencyAmountOut, chainId)
    var tokenIn = wrappedCurrency(currencyIn, chainId)

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i] // pair irrelevant

      if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token)) continue
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue
      var amountIn = void 0

      try {
        var _pair$getInputAmount2 = pair.getInputAmount(amountOut)

        amountIn = _pair$getInputAmount2[0]
      } catch (error) {
        // not enough liquidity in this pair
        if (error.isInsufficientReservesError) {
          continue
        }

        throw error
      } // we have arrived at the input token, so this is the first trade of one of the paths

      if (amountIn.token.equals(tokenIn)) {
        sortedInsert(
          bestTrades,
          new Trade(
            new Route([pair].concat(currentPairs), currencyIn, originalAmountOut.currency),
            originalAmountOut,
            TradeType.EXACT_OUTPUT
          ),
          maxNumResults,
          tradeComparator
        )
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length)) // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops

        Trade.bestTradeExactOut(
          pairsExcludingThisPair,
          currencyIn,
          amountIn,
          {
            maxNumResults: maxNumResults,
            maxHops: maxHops - 1,
          },
          [pair].concat(currentPairs),
          originalAmountOut,
          bestTrades
        )
      }
    }

    return bestTrades
  }

  return Trade
})()

var PAIR_ADDRESS_CACHE = {}
var UniPair = /*#__PURE__*/ (function (_Pair) {
  _inheritsLoose(UniPair, _Pair)

  function UniPair(tokenAmountA, tokenAmountB) {
    var _this

    _this = _Pair.call(this, tokenAmountA, tokenAmountB) || this
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    _this.liquidityToken = new Token(
      tokenAmounts[0].token.chainId,
      UniPair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token),
      18,
      'UNI-V2',
      'Uniswap V2'
    )
    _this.tokenAmounts = tokenAmounts
    return _this
  }

  UniPair.getAddress = function getAddress(tokenA, tokenB) {
    var _PAIR_ADDRESS_CACHE, _PAIR_ADDRESS_CACHE$t

    var tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

    if (
      ((_PAIR_ADDRESS_CACHE = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE === void 0
        ? void 0
        : (_PAIR_ADDRESS_CACHE$t = _PAIR_ADDRESS_CACHE[tokens[0].address]) === null || _PAIR_ADDRESS_CACHE$t === void 0
        ? void 0
        : _PAIR_ADDRESS_CACHE$t[tokens[1].address]) === undefined
    ) {
      var _PAIR_ADDRESS_CACHE2, _extends2, _extends3

      PAIR_ADDRESS_CACHE = _extends(
        _extends({}, PAIR_ADDRESS_CACHE),
        {},
        ((_extends3 = {}),
        (_extends3[tokens[0].address] = _extends(
          _extends(
            {},
            (_PAIR_ADDRESS_CACHE2 = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE2 === void 0
              ? void 0
              : _PAIR_ADDRESS_CACHE2[tokens[0].address]
          ),
          {},
          ((_extends2 = {}),
          (_extends2[tokens[1].address] = getCreate2Address(
            FACTORY_ADDRESS,
            keccak256(['bytes'], [pack(['address', 'address'], [tokens[0].address, tokens[1].address])]),
            INIT_CODE_HASH
          )),
          _extends2)
        )),
        _extends3)
      )
    }

    return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address]
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */

  var _proto = UniPair.prototype

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  } // @ts-ignore

  _proto.getOutputAmount = function getOutputAmount(inputAmount) {
    !this.involvesToken(inputAmount.token)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError()
    }

    var inputReserve = this.reserveOf(inputAmount.token)
    var outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)
    var inputAmountWithFee = JSBI.multiply(inputAmount.raw, _997)
    var numerator = JSBI.multiply(inputAmountWithFee, outputReserve.raw)
    var denominator = JSBI.add(JSBI.multiply(inputReserve.raw, _1000), inputAmountWithFee)
    var outputAmount = new TokenAmount(
      inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator)
    )

    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError()
    }

    return [outputAmount, new UniPair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  } // @ts-ignore

  _proto.getInputAmount = function getInputAmount(outputAmount) {
    !this.involvesToken(outputAmount.token)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0

    if (
      JSBI.equal(this.reserve0.raw, ZERO) ||
      JSBI.equal(this.reserve1.raw, ZERO) ||
      JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)
    ) {
      throw new InsufficientReservesError()
    }

    var outputReserve = this.reserveOf(outputAmount.token)
    var inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)
    var numerator = JSBI.multiply(JSBI.multiply(inputReserve.raw, outputAmount.raw), _1000)
    var denominator = JSBI.multiply(JSBI.subtract(outputReserve.raw, outputAmount.raw), _997)
    var inputAmount = new TokenAmount(
      outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), ONE)
    )
    return [inputAmount, new UniPair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  _proto.getLiquidityMinted = function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    !totalSupply.token.equals(this.liquidityToken)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'LIQUIDITY')
        : invariant(false)
      : void 0
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    !(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1))
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0
    var liquidity

    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY)
    } else {
      var amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw)
      var amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw)
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1
    }

    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError()
    }

    return new TokenAmount(this.liquidityToken, liquidity)
  }

  _proto.getLiquidityValue = function getLiquidityValue(token, totalSupply, liquidity, feeOn, kLast) {
    if (feeOn === void 0) {
      feeOn = false
    }

    !this.involvesToken(token)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOKEN')
        : invariant(false)
      : void 0
    !totalSupply.token.equals(this.liquidityToken)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'TOTAL_SUPPLY')
        : invariant(false)
      : void 0
    !liquidity.token.equals(this.liquidityToken)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'LIQUIDITY')
        : invariant(false)
      : void 0
    !JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'LIQUIDITY')
        : invariant(false)
      : void 0
    var totalSupplyAdjusted

    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      !!!kLast ? (process.env.NODE_ENV !== 'production' ? invariant(false, 'K_LAST') : invariant(false)) : void 0
      var kLastParsed = parseBigintIsh(kLast)

      if (!JSBI.equal(kLastParsed, ZERO)) {
        var rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw))
        var rootKLast = sqrt(kLastParsed)

        if (JSBI.greaterThan(rootK, rootKLast)) {
          var numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast))
          var denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast)
          var feeLiquidity = JSBI.divide(numerator, denominator)
          totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity))
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return new TokenAmount(
      token,
      JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw)
    )
  }

  _createClass(UniPair, [
    {
      key: 'chainId',
      get: function get() {
        return this.token0.chainId
      },
    },
    {
      key: 'token0',
      get: function get() {
        return this.tokenAmounts[0].token
      },
    },
    {
      key: 'token1',
      get: function get() {
        return this.tokenAmounts[1].token
      },
    },
    {
      key: 'reserve0',
      get: function get() {
        return this.tokenAmounts[0]
      },
    },
    {
      key: 'reserve1',
      get: function get() {
        return this.tokenAmounts[1]
      },
    },
  ])

  return UniPair
})(Pair)

function toHex(currencyAmount) {
  return '0x' + currencyAmount.raw.toString(16)
}

var ZERO_HEX = '0x0'
/**
 * Represents the Uniswap V2 Router, and has static methods for helping execute trades.
 */

var Router = /*#__PURE__*/ (function () {
  /**
   * Cannot be constructed.
   */
  function Router() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */

  Router.swapCallParameters = function swapCallParameters(trade, options) {
    var etherIn = trade.inputAmount.currency === ETHER
    var etherOut = trade.outputAmount.currency === ETHER // the router does not support both ether in and out

    !!(etherIn && etherOut)
      ? process.env.NODE_ENV !== 'production'
        ? invariant(false, 'ETHER_IN_OUT')
        : invariant(false)
      : void 0
    !(options.ttl > 0) ? (process.env.NODE_ENV !== 'production' ? invariant(false, 'TTL') : invariant(false)) : void 0
    var to = validateAndParseAddress(options.recipient)
    var amountIn = toHex(trade.maximumAmountIn(options.allowedSlippage))
    var amountOut = toHex(trade.minimumAmountOut(options.allowedSlippage))
    var path = trade.route.path.map(function (token) {
      return token.address
    })
    var deadline = '0x' + (Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16)
    var useFeeOnTransfer = Boolean(options.feeOnTransfer)
    var methodName
    var args
    var value

    switch (trade.tradeType) {
      case TradeType.EXACT_INPUT:
        if (etherIn) {
          methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens' // (uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountOut, path, to, deadline]
          value = amountIn
        } else if (etherOut) {
          methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH' // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountIn, amountOut, path, to, deadline]
          value = ZERO_HEX
        } else {
          methodName = useFeeOnTransfer
            ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
            : 'swapExactTokensForTokens' // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountIn, amountOut, path, to, deadline]
          value = ZERO_HEX
        }

        break

      case TradeType.EXACT_OUTPUT:
        !!useFeeOnTransfer
          ? process.env.NODE_ENV !== 'production'
            ? invariant(false, 'EXACT_OUT_FOT')
            : invariant(false)
          : void 0

        if (etherIn) {
          methodName = 'swapETHForExactTokens' // (uint amountOut, address[] calldata path, address to, uint deadline)

          args = [amountOut, path, to, deadline]
          value = amountIn
        } else if (etherOut) {
          methodName = 'swapTokensForExactETH' // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

          args = [amountOut, amountIn, path, to, deadline]
          value = ZERO_HEX
        } else {
          methodName = 'swapTokensForExactTokens' // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

          args = [amountOut, amountIn, path, to, deadline]
          value = ZERO_HEX
        }

        break
    }

    return {
      methodName: methodName,
      args: args,
      value: value,
    }
  }

  return Router
})()

var ERC20 = [
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

var _TOKEN_DECIMALS_CACHE
var TOKEN_DECIMALS_CACHE =
  ((_TOKEN_DECIMALS_CACHE = {}),
  (_TOKEN_DECIMALS_CACHE[ChainId.MAINNET] = {
    '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': 9, // DGD
  }),
  _TOKEN_DECIMALS_CACHE)
/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */

var Fetcher = /*#__PURE__*/ (function () {
  /**
   * Cannot be constructed.
   */
  function Fetcher() {}
  /**
   * Fetch information for a given token on the given chain, using the given ethers provider.
   * @param chainId chain of the token
   * @param address address of the token on the chain
   * @param provider provider used to fetch the token
   * @param symbol optional symbol of the token
   * @param name optional name of the token
   */

  Fetcher.fetchTokenData = function fetchTokenData(chainId, address, provider, symbol, name) {
    try {
      var _TOKEN_DECIMALS_CACHE2, _TOKEN_DECIMALS_CACHE3

      var _temp3 = function _temp3(parsedDecimals) {
        return new Token(chainId, address, parsedDecimals, symbol, name)
      }

      if (provider === undefined) provider = getDefaultProvider(getNetwork(chainId))

      var _temp4 =
        typeof ((_TOKEN_DECIMALS_CACHE2 = TOKEN_DECIMALS_CACHE) === null || _TOKEN_DECIMALS_CACHE2 === void 0
          ? void 0
          : (_TOKEN_DECIMALS_CACHE3 = _TOKEN_DECIMALS_CACHE2[chainId]) === null || _TOKEN_DECIMALS_CACHE3 === void 0
          ? void 0
          : _TOKEN_DECIMALS_CACHE3[address]) === 'number'

      return Promise.resolve(
        _temp4
          ? _temp3(TOKEN_DECIMALS_CACHE[chainId][address])
          : Promise.resolve(
              new Contract(address, ERC20, provider).decimals().then(function (decimals) {
                var _TOKEN_DECIMALS_CACHE4, _extends2, _extends3

                TOKEN_DECIMALS_CACHE = _extends(
                  _extends({}, TOKEN_DECIMALS_CACHE),
                  {},
                  ((_extends3 = {}),
                  (_extends3[chainId] = _extends(
                    _extends(
                      {},
                      (_TOKEN_DECIMALS_CACHE4 = TOKEN_DECIMALS_CACHE) === null || _TOKEN_DECIMALS_CACHE4 === void 0
                        ? void 0
                        : _TOKEN_DECIMALS_CACHE4[chainId]
                    ),
                    {},
                    ((_extends2 = {}), (_extends2[address] = decimals), _extends2)
                  )),
                  _extends3)
                )
                return decimals
              })
            ).then(_temp3)
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }
  /**
   * Fetches information about a pair and constructs a pair from the given two tokens.
   * @param tokenA first token
   * @param tokenB second token
   * @param provider the provider to use to fetch the data
   */

  Fetcher.fetchPairData = function fetchPairData(tokenA, tokenB, provider) {
    try {
      if (provider === undefined) provider = getDefaultProvider(getNetwork(tokenA.chainId))
      !(tokenA.chainId === tokenB.chainId)
        ? process.env.NODE_ENV !== 'production'
          ? invariant(false, 'CHAIN_ID')
          : invariant(false)
        : void 0
      var address = Pair.getAddress(tokenA, tokenB)
      return Promise.resolve(new Contract(address, IUniswapV2Pair.abi, provider).getReserves()).then(function (_ref) {
        var reserves0 = _ref[0],
          reserves1 = _ref[1]
        var balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0]
        return new Pair(new TokenAmount(tokenA, balances[0]), new TokenAmount(tokenB, balances[1]))
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return Fetcher
})()

export {
  ChainId,
  ETHER,
  FACTORY_ADDRESS,
  Fetcher,
  INIT_CODE_HASH,
  InsufficientInputAmountError,
  InsufficientReservesError,
  MINIMUM_LIQUIDITY,
  Rounding,
  Router,
  Trade,
  TradeType,
  UniPair,
  WETH,
  currencyEquals,
  inputOutputComparator,
  tradeComparator,
}
//# sourceMappingURL=sdk.esm.js.map
