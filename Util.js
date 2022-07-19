

// Created in order to preserve dbs fnc after it becomes D.

'use strict';

const { Discord, Util } = require('discord.js');
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const isObject = d => typeof d === 'object' && d !== null;

/**
 * Options for splitting a message.
 * @typedef {Object} SplitOptions
 * @property {number} [maxLength=2000] Maximum character length per message piece
 * @property {string|string[]|RegExp|RegExp[]} [char='\n'] Character(s) or Regex(es) to split the message with,
 * an array can be used to split multiple times
 * @property {string} [prepend=''] Text to prepend to every piece except the first
 * @property {string} [append=''] Text to append to every piece except the last
 */
/**
 * Splits a string into multiple chunks at a designated character that do not exceed a specific length.
 * @param {string} text Content to split
 * @param {SplitOptions} [options] Options controlling the behavior of the split
 * @returns {string[]}
 */

class Splitter extends null {

  static splitMessage(text, { maxLength = 2_000, char = '\n', prepend = '', append = '' } = {}) {
    text = Util.verifyString(text);
    if (text.length <= maxLength) return [text];
    let splitText = [text];
    if (Array.isArray(char)) {
      while (char.length > 0 && splitText.some(elem => elem.length > maxLength)) {
        const currentChar = char.shift();
        if (currentChar instanceof RegExp) {
          splitText = splitText.flatMap(chunk => chunk.match(currentChar));
        } else {
          splitText = splitText.flatMap(chunk => chunk.split(currentChar));
        }
      }
    } else {
      splitText = text.split(char);
    }
    if (splitText.some(elem => elem.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
    const messages = [];
    let msg = '';
    for (const chunk of splitText) {
      if (msg && (msg + char + chunk + append).length > maxLength) {
        messages.push(msg + append);
        msg = prepend;
      }
      msg += (msg && msg !== prepend ? char : '') + chunk;
    }
    return messages.concat(msg).filter(m => m);
  }
}

module.exports = Splitter;
