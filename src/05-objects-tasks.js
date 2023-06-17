/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  Builder: class {
    constructor() {
      this.selectors = {};
      this.flags = {
        id: false,
        class: false,
        attr: false,
        pseudoClass: false,
        pseudoElement: false,
      };
      this.errText1 = 'Element, id and pseudo-element should not occur more then one time inside the selector';
      this.errText2 = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
    }

    element(value) {
      if (this.flags.id) {
        throw new Error(this.errText2);
      } else if (this.selectors.element) {
        throw new Error(this.errText1);
      } else {
        this.selectors.element = [value];
      }
      return this;
    }

    id(value) {
      if (this.flags.class) {
        throw new Error(this.errText2);
      } else if (this.selectors.id) {
        throw new Error(this.errText1);
      } else {
        this.flags.id = true;
        this.selectors.id = [`#${value}`];
      }
      return this;
    }

    class(value) {
      if (this.flags.attr) {
        throw new Error(this.errText2);
      } else if (this.selectors.class) {
        this.selectors.class.push(`.${value}`);
      } else {
        this.flags.id = true;
        this.flags.class = true;
        this.selectors.class = [`.${value}`];
      }
      return this;
    }

    attr(value) {
      if (this.flags.pseudoClass) {
        throw new Error(this.errText2);
      } else if (this.selectors.attr) {
        this.selectors.attr.push(`[${value}]`);
      } else {
        this.flags.id = true;
        this.flags.class = true;
        this.flags.attr = true;
        this.selectors.attr = [`[${value}]`];
      }
      return this;
    }

    pseudoClass(value) {
      if (this.flags.pseudoElement) {
        throw new Error(this.errText2);
      } else if (this.selectors.pseudoClass) {
        this.selectors.pseudoClass.push(`:${value}`);
      } else {
        this.flags.id = true;
        this.flags.class = true;
        this.flags.attr = true;
        this.flags.pseudoClass = true;
        this.selectors.pseudoClass = [`:${value}`];
      }
      return this;
    }

    pseudoElement(value) {
      if (this.selectors.pseudoElement) {
        throw new Error(this.errText1);
      } else {
        this.flags.id = true;
        this.flags.class = true;
        this.flags.attr = true;
        this.flags.pseudoClass = true;
        this.flags.pseudoElement = true;
        this.selectors.pseudoElement = [`::${value}`];
      }
      return this;
    }

    stringify() {
      const element = this.selectors.element ? this.selectors.element.join('') : '';
      const id = this.selectors.id ? this.selectors.id.join('') : '';
      const classes = this.selectors.class ? this.selectors.class.join('') : '';
      const attr = this.selectors.attr ? this.selectors.attr.join('') : '';
      const pseudoClass = this.selectors.pseudoClass ? this.selectors.pseudoClass.join('') : '';
      const pseudoElement = this.selectors.pseudoElement ? this.selectors.pseudoElement.join('') : '';
      return `${element}${id}${classes}${attr}${pseudoClass}${pseudoElement}`;
    }
  },

  element(value) {
    const b = new this.Builder();
    return b.element(value);
  },

  id(value) {
    const b = new this.Builder();
    return b.id(value);
  },

  class(value) {
    const b = new this.Builder();
    return b.class(value);
  },

  attr(value) {
    const b = new this.Builder();
    return b.attr(value);
  },

  pseudoClass(value) {
    const b = new this.Builder();
    return b.pseudoClass(value);
  },

  pseudoElement(value) {
    const b = new this.Builder();
    return b.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const s1 = selector1.stringify();
    const s2 = selector2.stringify();
    this.res = `${s1} ${combinator} ${s2}`;
    return this;
  },

  stringify() {
    return this.res;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
