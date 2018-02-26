'use strict';
/*
 * Javascript implementation of Elliptic curve Diffie-Hellman key exchange over Curve25519
 *
 * Copyright (c) 2017, Bubelich Mykola
 * https://bubelich.com
 *
 * (｡◕‿‿◕｡)
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met, 0x
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * Inspired by TeetNacl
 *
 * More information
 * https://github.com/CryptoEsel/js-x25519
 *
 * Project
 * CryptoEsel - https://cryptoesel.com
 *
 * References
 * TweetNaCl 20140427 - http://tweetnacl.cr.yp.to/
 * TweetNaCl.js v0.14.5 - https://github.com/dchest/tweetnacl-js
 *
 */


export class X25519 {
    private _X25519_ZERO = new Float64Array([0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000]);
    private _X25519_ONE = new Float64Array([0x0001, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000]);
    private _X25519_NINE = new Uint8Array(32);
    private _X25519_121665 = new Float64Array([0xDB41, 0x0001, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000]);

    constructor() {
        this._X25519_NINE[0] = 9;
    }

    /**
     * Generate and return public key as Uint8Array[32] array
     *
     * @param {Uint8Array} secret
     * @return {Uint8Array}
     */
    getPublic(secret: Uint8Array): any {
        //if (secret.byteLength !== 32) {
        //    throw new Error('Secret wrong length, should be 32 bytes.');
        //}

        var p = new Uint8Array(secret);
        this._clamp(p);

        return this._scalarMul(p, this._X25519_NINE);
    }
    

    /**
     * Generate shared key from secret and public key
     * Length is 32 bytes for every key
     *
     * @param {Uint8Array} secretKey
     * @param {Uint8Array} publicKey
     * @return {Uint8Array}
     */
    getSharedKey(secretKey: Uint8Array, publicKey: Uint8Array): any {
        //if (secretKey.byteLength !== 32 || publicKey.byteLength !== 32) {
        //    throw new Error('Secret key or public key wrong length, should be 32 bytes.');
        //}

        var p = new Uint8Array(secretKey);
        this._clamp(p);

        return this._scalarMul(p, publicKey);
    }
    

    /**
     *  Addition
     *
     * @param {Float64Array} result
     * @param {Float64Array} augent
     * @param {Float64Array} addend
     * @private
     */
    private _add(result: Float64Array, augent: Float64Array, addend: Float64Array) {
        for (var i = 0; i < 16; i++) {
            result[i] = augent[i] + addend[i] | 0;
        }
    }

    

    /**
     * Subtraction
     *
     * @param {Float64Array} result
     * @param {Float64Array} minuend
     * @param {Float64Array} subtrahend
     * @private
     */
    private _sub(result: Float64Array, minuend: Float64Array, subtrahend: Float64Array) {
        for (var i = 0; i < 16; i++) {
            result[i] = minuend[i] - subtrahend[i] | 0;
        }
    }    

    /**
     *  Multiplication
     *
     * @param {Float64Array} result
     * @param {Float64Array} multiplier
     * @param {Float64Array} multiplicand
     * @private
     */
    private _mul(result: Float64Array, multiplier: Float64Array, multiplicand: Float64Array) {
        var i = 0;
        var j = 0;
        var carry = new Float64Array(31);

        for (i = 0; i < 16; i++) {
            for (j = 0; j < 16; j++) {
                carry[i + j] += multiplier[i] * multiplicand[j];
            }
        }

        /** mul 2 x 19 **/
        for (i = 0; i < 15; i++) {
            carry[i] += 38 * carry[i + 16];
        }

        this._car25519(carry);
        this._car25519(carry);

        /** copy results **/
        this._copy(result, carry);
    }    

    /**
     * Compute values^2
     *
     * @param {Float64Array} result
     * @param {Float64Array} values
     * @private
     */
    private _sqr(result: Float64Array, values:Float64Array) {
        this._mul(result, values, values);
    }
    

    /**
     * Core scalar multiplies for curve 25519
     *
     * @param {Uint8Array} multiplier; 32 bytes array
     * @param {Uint8Array} multiplicand; 32 bytes array
     * @private
     */
    private _scalarMul(multiplier: Uint8Array, multiplicand: Uint8Array): Float64Array {
        var carry = new Float64Array(80);

        var a = new Float64Array(this._X25519_ONE);
        var b = new Float64Array(this._X25519_ZERO);
        var c = new Float64Array(this._X25519_ZERO);
        var d = new Float64Array(this._X25519_ONE);
        var e = new Float64Array(this._X25519_ZERO);
        var f = new Float64Array(this._X25519_ZERO);

        var z = new Uint8Array(multiplier);

        var r = 0;

        this._unpack(carry, multiplicand);

        // copy carry to b //
        this._copy(b, carry);

        for (var i = 254; i >= 0; --i) {
            r = z[i >>> 3] >>> (i & 7) & 1;

            this._sel25519(a, b, r);
            this._sel25519(c, d, r);

            this._add(e, a, c);
            this._sub(a, a, c);

            this._add(c, b, d);
            this._sub(b, b, d);

            this._sqr(d, e);
            this._sqr(f, a);

            this._mul(a, c, a);
            this._mul(c, b, e);

            this._add(e, a, c);
            this._sub(a, a, c);

            this._sqr(b, a);
            this._sub(c, d, f);

            this._mul(a, c, this._X25519_121665);
            this._add(a, a, d);

            this._mul(c, c, a);
            this._mul(a, d, f);
            this._mul(d, b, carry);

            this._sqr(b, e);

            this._sel25519(a, b, r);
            this._sel25519(c, d, r);
        }

        for (var _i = 0; _i < 16; _i++) {
            carry[_i + 16] = a[_i];
            carry[_i + 32] = c[_i];
            carry[_i + 48] = b[_i];
            carry[_i + 64] = d[_i];
        }

        var x32 = carry.subarray(32);
        var x16 = carry.subarray(16);

        this._inv25519(x32, x32);
        this._mul(x16, x16, x32);

        var result = new Float64Array(32);

        this._pack(result, x16);

        return result;
    }
    
    /**
     *
     * @param {Float64Array} result
     * @param {Float64Array} values
     * @private
     */
    private _inv25519(result: Float64Array, values: Float64Array) {
        var carry = new Float64Array(16);

        // copy values to carry //
        this._copy(carry, values);

        // compute //
        for (var i = 253; i >= 0; i--) {
            this._sqr(carry, carry);
            if (i !== 2 && i !== 4) {
                this._mul(carry, carry, values);
            }
        }

        // copy carry to results //
        this._copy(result, carry);
    }
    

    /**
     *
     * @param {Float64Array} result
     * @param {Float64Array} q
     * @param {Number} b
     * @private
     */
    private _sel25519(result:Float64Array, q: Float64Array, b: number) {
        var tmp = 0;
        var carry = ~(b - 1);

        // compute //
        for (var i = 0; i < 16; i++) {
            tmp = carry & (result[i] ^ q[i]);
            result[i] ^= tmp;
            q[i] ^= tmp;
        }
    }
    

    /**
     *
     * @param {Float64Array} values
     * @private
     */
    private _car25519(values: Float64Array) {
        var carry = 0;

        for (var i = 0; i < 16; i++) {
            values[i] += 65536;
            carry = Math.floor(values[i] / 65536);
            values[(i + 1) * (i < 15 ? 1 : 0)] += carry - 1 + 37 * (carry - 1) * (i === 15 ? 1 : 0);
            values[i] -= carry * 65536;
        }
    }

    /**
     * Upack 1x32 -> 8x16 bytes arrays
     *
     * @param {Float64Array} result
     * @param {Uint8Array} values
     * @private
     */
    private _unpack(result: Float64Array, values: Uint8Array) {
        for (var i = 0; i < 16; i++) {
            result[i] = values[2 * i] + (values[2 * i + 1] << 8);
        }
    }

    /**
     * Pack from 8x16 -> 1x32 bytes array
     *
     * @param {Float64Array} result
     * @param {Float64Array} values
     * @private
     */
    private _pack(result: Float64Array, values: Float64Array) {
        var m = new Float64Array(16);
        var tmp = new Float64Array(16);
        var i = 0;
        var carry = 0;

        // copy //
        this._copy(tmp, values);

        this._car25519(tmp);
        this._car25519(tmp);
        this._car25519(tmp);

        for (var j = 0; j < 2; j++) {
            m[0] = tmp[0] - 0xFFED;

            for (i = 1; i < 15; i++) {
                m[i] = tmp[i] - 0xFFFF - (m[i - 1] >> 16 & 1);
                m[i - 1] &= 0xFFFF;
            }

            m[15] = tmp[15] - 0x7FFF - (m[14] >> 16 & 1);
            carry = m[15] >> 16 & 1;
            m[14] &= 0xFFFF;

            this._sel25519(tmp, m, 1 - carry);
        }

        for (i = 0; i < 16; i++) {
            result[2 * i] = tmp[i] & 0xFF;
            result[2 * i + 1] = tmp[i] >> 8;
        }
    }

    /**
     * Copy source to destination
     * Warning! length not checked!
     *
     * @param {Float64Array} destination
     * @param {Float64Array} source
     * @private
     */
    private _copy(destination: Float64Array, source: Float64Array) {
        var len = source.length;
        for (var i = 0; i < len; i++) {
            destination[i] = source[i];
        }
    }

    /**
     * Curve 25516 clamp input seed bytes
     *
     * @param {Uint8Array} bytes
     * @private
     */
    private _clamp(bytes: Uint8Array) {
        bytes[0] = bytes[0] & 0xF8;
        bytes[31] = bytes[31] & 0x7F | 0x40;
    }
}