function execute(code, c, e) {
    // Is reflect supported
    function isReflectSupported() {
        if ("undefined" == typeof Reflect || !Reflect.construct) {
            return false;
        }
        if (Reflect.construct.sham) {
            return false;
        }
        if ("function" == typeof Proxy) {
            return true;
        }
        try {
            Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
            return !0;
        } catch (a) {
            return !1;
        }
    }

    // Reflect call
    // Args: (target: Function, argumentsList: ArrayLike<any>, newTarget?: Function | undefined)
    function call(a, c, e) {
        return (call = isReflectSupported() ?
                Reflect.construct :
                function (a, c, e) {
                    var b = [null];
                    b.push.apply(b, c);
                    var d = new(Function.bind.apply(a, b))();
                    e && setProto(d, e.prototype);
                    return d;
                })
            .apply(null, arguments);
    }

    // Set prototype
    // Args: object, proto
    function setProto(a, c) {
        return (setProto =
            Object.setPrototypeOf ||
            function (a, c) {
                a.__proto__ = c;
                return a;
            })(a, c);
    }

    // Spread iterable object
    // e.g. [..."hi"], [...new Set([1, 2 , 3])]
    function spread(a) {
        return (
            (function (a) {
                // Copies directly???
                if (Array.isArray(a)) {
                    for (var c = 0, e = new Array(a.length); c < a.length; c++) {
                        e[c] = a[c];
                    }
                    return e;
                }
            })(a) ||
            (function (a) {
                // If is iterable
                if (
                    Symbol.iterator in Object(a) ||
                    "[object Arguments]" === Object.prototype.toString.call(a)
                ) {
                    return Array.from(a);
                }
            })(a) ||
            (function () {
                throw new TypeError("Invalid attempt to spread non-iterable instance");
            })()
        );
    }

    for (var p = 0; p < 16; p++) {
        var magic = "" + code[p++] + code[p];
        magic = parseInt(magic, 16);
        w += String.fromCharCode(magic);
    }
    if ("HNOJ@?RC" != w) {
        throw new Error("error magic number " + w);
    }
    var n = [],
        strXorKey = 0,
        i = [],
        r = 0,
        _ = function (source, offset) {
            var e = source[offset],
                b = source[offset + 1],
                d = parseInt("" + e + b, 16); // Byte at (0..1)
            if (d >> 7 == 0) { // < 128
                return [1, d];
            }
            if (d >> 6 == 2) { // < 128
                var f = parseInt("" + source[offset + 2] + source[offset + 3], 16); // Byte at (2..3)
                d &= 63;
                return [2, (f = (d <<= 8) + f)];
            } else {
                var t = parseInt("" + source[offset + 2] + source[offset + 3], 16), // Byte at (2..3)
                    n = parseInt("" + source[offset + 4] + source[offset + 5], 16); // Byte at (4..5)
                d &= 63;
                return [3, (n = (d <<= 16) + (t <<= 8) + n)];
            }
        },
        vm_byte_parse = function (source, offset) {
            var e = parseInt("" + source[offset] + source[offset + 1], 16);
            return e > 127 ? -256 + e : e;
        },
        vm_short_parse = function (source, offset) {
            var e = parseInt("" + source[offset] + source[offset + 1] + source[offset + 2] + source[offset + 3], 16);
            return e > 32767 ? -65536 + e : e;
        },
        vm_number_parse = function (source, offset) {
            var e = parseInt(
                "" +
                source[offset] +
                source[offset + 1] +
                source[offset + 2] +
                source[offset + 3] +
                source[offset + 4] +
                source[offset + 5] +
                source[offset + 6] +
                source[offset + 7],
                16
            );
            return e > 2147483647 ? 0 + e : e;
        },
        vm_byte_parse_common = function (source, offset) {
            return parseInt("" + source[offset] + source[offset + 1], 16);
        },
        vm_short_parse_common = function (source, offset) {
            return parseInt("" + source[offset] + source[offset + 1] + source[offset + 2] + source[offset + 3], 16);
        },
        _global = _global || this || window;
    var g = 16;
    parseInt("" + code[g] + code[g + 1], 16); // 2 Dropped
    g += 8;
    strXorKey = 0;
    for (var m = 0; m < 4; m++) {
        var cursor = g + 2 * m;
        strXorKey +=
            (3 & parseInt("" + code[cursor] + code[cursor + 1], 16)) << (2 * m);
    }
    g += 24;
    var T = parseInt(
        "" +
        code[g] +
        code[g + 1] +
        code[g + 2] +
        code[g + 3] +
        code[g + 4] +
        code[g + 5] +
        code[g + 6] +
        code[g + 7],
        16
    );
    g += 8;
    var A = g;
    g += T;
    var O = vm_short_parse_common(code, g);
    O[1];
    g += 4;
    n = {
        p: [],
        q: [],
    };
    for (var I = 0; I < O; I++) {
        for (
            var M = _(code, g), R = (g += 2 * M[0]), j = n.p.length, P = 0; P < M[1]; P++
        ) {
            var U = _(code, R);
            n.p.push(U[1]);
            R += 2 * U[0];
        }
        g = R;
        n.q.push([j, n.p.length]);
    }
    var L = {
            2: 1,
            29: 1,
            30: 1,
            20: 1,
        },
        initialStorage = [],
        F = [];

    function initVMStorage(code, start, end) {
        for (var cur = start; cur < start + end;) {
            var d = vm_byte_parse_common(code, cur);
            initialStorage[cur] = d;
            cur += 2;
            switch (d) {
            case 72:
                F[cur] = vm_byte_parse(code, cur);
                cur += 2;
                break;
            case 5:
            case 6:
            case 70:
            case 22:
            case 23:
            case 37:
            case 73:
                F[cur] = vm_short_parse(code, cur);
                cur += 4;
                break;
            case 74:
                F[cur] = vm_number_parse(code, cur);
                cur += 8;
                break;
            case 11:
            case 12:
            case 24:
            case 26:
            case 27:
            case 31:
                F[cur] = vm_byte_parse_common(code, cur);
                cur += 2;
                break;
            case 10:
                F[cur] = vm_short_parse_common(code, cur);
                cur += 4;
                break;
            default:
                F[cur] = vm_short_parse_common(code, cur);
                cur += 4;
            }
        }
    }
    return runCode(code, A, T / 2, [], c, e);

    // Idk why but they divided end offset by 2
    function evaluate(code, start, e, b, f, instance, g, w) {
        if (!instance) {
            instance = this;
        }
        var p,
            y,
            m,
            insn_stack = [],
            cur = 0;
        g && (p = g);
        var mod,
            pointer,
            cur = start,
            end = cur + 2 * e;
        if (!w) {
            for (; cur < end;) {
                var I = parseInt("" + code[cur] + code[cur + 1], 16); // A byte
                cur += 2;
                var opcode = 3 & (mod = (13 * I) % 241);
                if (((mod >>= 2), opcode < 1)) {
                    opcode = 3 & mod;
                    if (((mod >>= 2), opcode < 1)) {
                        if ((opcode = mod) < 1) {
                            return [1, insn_stack[cur--]];
                        }
                        if (opcode < 5) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] * p;
                        } else if (opcode < 7) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] != p;
                        } else if (opcode < 14) {
                            y = insn_stack[cur--];
                            m = insn_stack[cur--];
                            (opcode = insn_stack[cur--])
                            .x === evaluate ?
                                opcode.y >= 1 ?
                                (insn_stack[++cur] = runCode(code, opcode.c, opcode.l, y, opcode.z, m, null, 1)) :
                                ((insn_stack[++cur] = runCode(code, opcode.c, opcode.l, y, opcode.z, m, null, 0)), opcode.y++) :
                                (insn_stack[++cur] = opcode.apply(m, y));
                        } else {
                            opcode < 16 &&
                                ((pointer = vm_short_parse(code, cur)),
                                    ((k = function c() {
                                            var e = arguments;
                                            return c.y > 0 ?
                                                runCode(code, c.c, c.l, e, c.z, this, null, 0) :
                                                (c.y++, runCode(code, c.c, c.l, e, c.z, this, null, 0));
                                        })
                                        .c = cur + 4),
                                    (k.l = pointer - 2),
                                    (k.x = evaluate),
                                    (k.y = 0),
                                    (k.z = f),
                                    (insn_stack[cur] = k),
                                    (cur += 2 * pointer - 2));
                        }
                    } else if (opcode < 2) {
                        (opcode = mod) > 8
                            ?
                            ((p = insn_stack[cur--]), (insn_stack[cur] = typeof p)) :
                            opcode > 4 ?
                            (insn_stack[(cur -= 1)] = insn_stack[cur][insn_stack[cur + 1]]) :
                            opcode > 2 &&
                            ((y = insn_stack[cur--]),
                                (opcode = insn_stack[cur])
                                .x === evaluate ?
                                opcode.y >= 1 ?
                                (insn_stack[cur] = runCode(code, opcode.c, opcode.l, [y], opcode.z, m, null, 1)) :
                                ((insn_stack[cur] = runCode(code, opcode.c, opcode.l, [y], opcode.z, m, null, 0)), opcode.y++) :
                                (insn_stack[cur] = opcode(y)));
                    } else if (opcode < 3) {
                        if ((opcode = mod) < 9) {
                            for (
                                p = insn_stack[cur--],
                                pointer = vm_short_parse_common(code, cur),
                                opcode = "",
                                P = n.q[pointer][0]; P < n.q[pointer][1]; P++
                            ) {
                                opcode += String.fromCharCode(strXorKey ^ n.p[P]);
                            }
                            cur += 4;
                            insn_stack[cur--][opcode] = p;
                        } else if (opcode < 13) {
                            throw insn_stack[cur--];
                        }
                    } else {
                        (opcode = mod) < 1
                            ?
                            (insn_stack[++cur] = null) :
                            opcode < 3 ?
                            ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] >= p)) :
                            opcode < 12 && (insn_stack[++cur] = void 0);
                    }
                } else if (opcode < 2) {
                    opcode = 3 & mod;
                    if (((mod >>= 2), opcode < 1)) {
                        if ((opcode = mod) < 5) {
                            pointer = vm_short_parse(code, cur);
                            try {
                                if (
                                    ((i[r][2] = 1),
                                        1 == (p = evaluate(code, cur + 4, pointer - 3, [], f, instance, null, 0))[0])
                                ) {
                                    return p;
                                }
                            } catch (c) {
                                if (
                                    i[r] &&
                                    i[r][1] &&
                                    1 == (p = evaluate(code, i[r][1][0], i[r][1][1], [], f, instance, c, 0))[0]
                                ) {
                                    return p;
                                }
                            } finally {
                                if (
                                    i[r] &&
                                    i[r][0] &&
                                    1 == (p = evaluate(code, i[r][0][0], i[r][0][1], [], f, instance, null, 0))[0]
                                ) {
                                    return p;
                                }
                                i[r] = 0;
                                r--;
                            }
                            cur += 2 * pointer - 2;
                        } else {
                            opcode < 7 ?
                                ((pointer = vm_byte_parse_common(code, cur)),
                                    (cur += 2),
                                    (insn_stack[(cur -= pointer)] =
                                        0 === pointer ?
                                        new insn_stack[cur]() // If no arg
                                        :
                                        call(insn_stack[cur], spread(insn_stack.slice(cur + 1, cur + pointer + 1))))) // else
                                :
                                opcode < 9 && ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] & p));
                        }
                    } else if (opcode < 2) {
                        if ((opcode = mod) > 12) {
                            insn_stack[++cur] = vm_byte_parse(code, cur);
                            cur += 2;
                        } else if (opcode > 10) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] << p;
                        } else if (opcode > 8) {
                            for (
                                pointer = vm_short_parse_common(code, cur), opcode = "", P = n.q[pointer][0]; P < n.q[pointer][1]; P++
                            ) {
                                opcode += String.fromCharCode(strXorKey ^ n.p[P]);
                            }
                            cur += 4;
                            insn_stack[cur] = insn_stack[cur][opcode];
                        } else {
                            opcode > 6 && ((y = insn_stack[cur--]), (p = delete insn_stack[cur--][y]));
                        }
                    } else if (opcode < 3) {
                        (opcode = mod) < 2
                            ?
                            (insn_stack[++cur] = p) :
                            opcode < 11 ?
                            ((p = insn_stack[(cur -= 2)][insn_stack[cur + 1]] = insn_stack[cur + 2]), cur--) :
                            opcode < 13 && ((p = insn_stack[cur]), (insn_stack[++cur] = p));
                    } else if ((opcode = mod) > 12) {
                        insn_stack[++cur] = instance;
                    } else if (opcode > 5) {
                        p = insn_stack[cur--];
                        insn_stack[cur] = insn_stack[cur] !== p;
                    } else if (opcode > 3) {
                        p = insn_stack[cur--];
                        insn_stack[cur] = insn_stack[cur] / p;
                    } else if (opcode > 1) {
                        if ((pointer = vm_short_parse(code, cur)) < 0) {
                            w = 1;
                            initVMStorage(code, start, 2 * e);
                            cur += 2 * pointer - 2;
                            break;
                        }
                        cur += 2 * pointer - 2;
                    } else {
                        opcode > -1 && (insn_stack[cur] = !insn_stack[cur]);
                    }
                } else if (opcode < 3) {
                    opcode = 3 & mod;
                    if (((mod >>= 2), opcode < 1)) {
                        (opcode = mod) > 13
                            ?
                            ((insn_stack[++cur] = vm_short_parse(code, cur)), (cur += 4)) :
                            opcode > 11 ?
                            ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] >> p)) :
                            opcode > 9 ?
                            ((pointer = vm_byte_parse_common(code, cur)),
                                (cur += 2),
                                (p = insn_stack[cur--]),
                                (f[pointer] = p)) :
                            opcode > 7 ?
                            ((pointer = vm_short_parse_common(code, cur)),
                                (cur += 4),
                                (y = cur + 1),
                                (insn_stack[(cur -= pointer - 1)] = pointer ? insn_stack.slice(cur, y) : [])) :
                            opcode > 0 && ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] > p));
                    } else if (opcode < 2) {
                        if ((opcode = mod) > 12) {
                            ((p = insn_stack[cur - 1]), (y = insn_stack[cur]), (insn_stack[++cur] = p), (insn_stack[++cur] = y))
                        } else {
                            if (opcode > 3) {
                                ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] == p))
                            } else {
                                if (opcode > 1) {
                                    ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] + p))
                                } else {
                                    opcode > -1 && (insn_stack[++cur] = _global);
                                }
                            }
                        }
                    } else if (opcode < 3) {
                        if ((opcode = mod) > 13) {
                            insn_stack[++cur] = !1;
                        } else if (opcode > 6) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] instanceof p;
                        } else if (opcode > 4) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] % p;
                        } else if (opcode > 2) {
                            if (insn_stack[cur--]) {
                                cur += 4;
                            } else {
                                if ((pointer = vm_short_parse(code, cur)) < 0) {
                                    w = 1;
                                    initVMStorage(code, start, 2 * e);
                                    cur += 2 * pointer - 2;
                                    break;
                                }
                                cur += 2 * pointer - 2;
                            }
                        } else if (opcode > 0) {
                            for (
                                pointer = vm_short_parse_common(code, cur), p = "", P = n.q[pointer][0]; P < n.q[pointer][1]; P++
                            ) {
                                p += String.fromCharCode(strXorKey ^ n.p[P]);
                            }
                            insn_stack[++cur] = p;
                            cur += 4;
                        }
                    } else {
                        (opcode = mod) > 7
                            ?
                            ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] | p)) :
                            opcode > 5 ?
                            ((pointer = vm_byte_parse_common(code, cur)),
                                (cur += 2),
                                (insn_stack[++cur] = f["$" + pointer])) :
                            opcode > 3 &&
                            ((pointer = vm_short_parse(code, cur)),
                                i[r][0] && (!i[r][2] ?
                                    (i[r][1] = [cur + 4, pointer - 3]) :
                                    (i[r++] = [0, [cur + 4, pointer - 3], 0])),
                                (cur += 2 * pointer - 2));
                    }
                } else {
                    opcode = 3 & mod;
                    if (((mod >>= 2), opcode > 2)) {
                        (opcode = mod) > 13
                            ?
                            ((insn_stack[++cur] = vm_number_parse(code, cur)), (cur += 8)) :
                            opcode > 11 ?
                            ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] >>> p)) :
                            opcode > 9 ?
                            (insn_stack[++cur] = !0) :
                            opcode > 7 ?
                            ((pointer = vm_byte_parse_common(code, cur)), (cur += 2), (insn_stack[cur] = insn_stack[cur][pointer])) :
                            opcode > 0 && ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] < p));
                    } else if (opcode > 1) {
                        (opcode = mod) > 10
                            ?
                            ((pointer = vm_short_parse(code, cur)),
                                (i[++r] = [
                                    [cur + 4, pointer - 3], 0, 0
                                ]),
                                (cur += 2 * pointer - 2)) :
                            opcode > 8 ?
                            ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] ^ p)) :
                            opcode > 6 && (p = insn_stack[cur--]);
                    } else if (opcode > 0) {
                        if ((opcode = mod) > 7) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] in p;
                        } else if (opcode > 5) {
                            insn_stack[cur] = ++insn_stack[cur];
                        } else if (opcode > 3) {
                            pointer = vm_byte_parse_common(code, cur);
                            cur += 2;
                            p = f[pointer];
                            insn_stack[++cur] = p;
                        } else if (opcode > 1) {
                            var R = 0,
                                j = insn_stack[cur].length,
                                U = insn_stack[cur];
                            insn_stack[++cur] = function () {
                                var a = R < j;
                                if (a) {
                                    var c = U[R++];
                                    insn_stack[++cur] = c;
                                }
                                insn_stack[++cur] = a;
                            };
                        }
                    } else if ((opcode = mod) > 13) {
                        p = insn_stack[cur];
                        insn_stack[cur] = insn_stack[cur - 1];
                        insn_stack[cur - 1] = p;
                    } else if (opcode > 4) {
                        p = insn_stack[cur--];
                        insn_stack[cur] = insn_stack[cur] === p;
                    } else if (opcode > 2) {
                        p = insn_stack[cur--];
                        insn_stack[cur] = insn_stack[cur] - p;
                    } else if (opcode > 0) {
                        for (
                            pointer = vm_short_parse_common(code, cur), opcode = "", P = n.q[pointer][0]; P < n.q[pointer][1]; P++
                        ) {
                            opcode += String.fromCharCode(strXorKey ^ n.p[P]);
                        }
                        opcode = +opcode;
                        cur += 4;
                        insn_stack[++cur] = opcode;
                    }
                }
            }
        } else {
            for (; cur < end;) {
                I = initialStorage[cur];
                cur += 2;
                opcode = 3 & (mod = (13 * I) % 241);
                if (((mod >>= 2), opcode > 2)) {
                    opcode = 3 & mod;
                    if (((mod >>= 2), opcode > 2)) {
                        if ((opcode = mod) < 2) {
                            ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] < p))
                        } else {
                            if (opcode < 9) {
                                ((pointer = F[cur]), (cur += 2), (insn_stack[cur] = insn_stack[cur][pointer]))
                            } else {
                                if (opcode < 11) {
                                    (insn_stack[++cur] = !0)
                                } else {
                                    if (opcode < 13) {
                                        ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] >>> p))
                                    } else {
                                        opcode < 15 && ((insn_stack[++cur] = F[cur]), (cur += 8));
                                    }
                                }
                            }
                        }
                    } else if (opcode > 1) {
                        (opcode = mod) < 6 ||
                            (opcode < 8 ?
                                (p = insn_stack[cur--]) :
                                opcode < 10 ?
                                ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] ^ p)) :
                                opcode < 12 &&
                                ((pointer = F[cur]),
                                    (i[++r] = [
                                        [cur + 4, pointer - 3], 0, 0
                                    ]),
                                    (cur += 2 * pointer - 2)));
                    } else if (opcode > 0) {
                        if ((opcode = mod) > 7) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] in p;
                        } else if (opcode > 5) {
                            insn_stack[cur] = ++insn_stack[cur];
                        } else if (opcode > 3) {
                            pointer = F[cur];
                            cur += 2;
                            p = f[pointer];
                            insn_stack[++cur] = p;
                        } else {
                            opcode > 1 &&
                                ((R = 0),
                                    (j = insn_stack[cur].length),
                                    (U = insn_stack[cur]),
                                    (insn_stack[++cur] = function () {
                                        var a = R < j;
                                        if (a) {
                                            var c = U[R++];
                                            insn_stack[++cur] = c;
                                        }
                                        insn_stack[++cur] = a;
                                    }));
                        }
                    } else if ((opcode = mod) < 2) {
                        for (pointer = F[cur], opcode = "", P = n.q[pointer][0]; P < n.q[pointer][1]; P++) {
                            opcode += String.fromCharCode(strXorKey ^ n.p[P]);
                        }
                        opcode = +opcode;
                        cur += 4;
                        insn_stack[++cur] = opcode;
                    } else {
                        if (opcode < 4) {
                            ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] - p))
                        } else {
                            if (opcode < 6) {
                                ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] === p))
                            } else {
                                opcode < 15 && ((p = insn_stack[cur]), (insn_stack[cur] = insn_stack[cur - 1]), (insn_stack[cur - 1] = p));
                            }
                        }
                    }
                } else if (opcode > 1) {
                    opcode = 3 & mod;
                    if (((mod >>= 2), opcode < 1)) {
                        (opcode = mod) > 13
                            ?
                            ((insn_stack[++cur] = F[cur]), (cur += 4)) :
                            opcode > 11 ?
                            ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] >> p)) :
                            opcode > 9 ?
                            ((pointer = F[cur]), (cur += 2), (p = insn_stack[cur--]), (f[pointer] = p)) :
                            opcode > 7 ?
                            ((pointer = F[cur]), (cur += 4), (y = cur + 1), (insn_stack[(cur -= pointer - 1)] = pointer ? insn_stack.slice(cur, y) : [])) :
                            opcode > 0 && ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] > p));
                    } else if (opcode < 2) {
                        if ((opcode = mod) < 1) {
                            (insn_stack[++cur] = _global)
                        } else {
                            if (opcode < 3) {
                                ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] + p))
                            } else {
                                if (opcode < 5) {
                                    ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] == p))
                                } else {
                                    opcode < 14 &&
                                        ((p = insn_stack[cur - 1]), (y = insn_stack[cur]), (insn_stack[++cur] = p), (insn_stack[++cur] = y));
                                }
                            }
                        }
                    } else if (opcode < 3) {
                        if ((opcode = mod) > 13) {
                            insn_stack[++cur] = !1;
                        } else if (opcode > 6) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] instanceof p;
                        } else if (opcode > 4) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] % p;
                        } else if (opcode > 2) {
                            insn_stack[cur--] ? (cur += 4) : (cur += 2 * (pointer = F[cur]) - 2);
                        } else if (opcode > 0) {
                            for (pointer = F[cur], p = "", P = n.q[pointer][0]; P < n.q[pointer][1]; P++) {
                                p += String.fromCharCode(strXorKey ^ n.p[P]);
                            }
                            insn_stack[++cur] = p;
                            cur += 4;
                        }
                    } else {
                        (opcode = mod) > 7
                            ?
                            ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] | p)) :
                            opcode > 5 ?
                            ((pointer = F[cur]), (cur += 2), (insn_stack[++cur] = f["$" + pointer])) :
                            opcode > 3 &&
                            ((pointer = F[cur]),
                                i[r][0] && !i[r][2] ?
                                (i[r][1] = [cur + 4, pointer - 3]) :
                                (i[r++] = [0, [cur + 4, pointer - 3], 0]),
                                (cur += 2 * pointer - 2));
                    }
                } else if (opcode > 0) {
                    opcode = 3 & mod;
                    if (((mod >>= 2), opcode < 1)) {
                        if ((opcode = mod) > 9) {} else if (opcode > 7) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] & p;
                        } else if (opcode > 5) {
                            pointer = F[cur];
                            cur += 2;
                            insn_stack[(cur -= pointer)] =
                                0 === pointer ?
                                new insn_stack[cur]() :
                                call(insn_stack[cur], spread(insn_stack.slice(cur + 1, cur + pointer + 1)));
                        } else if (opcode > 3) {
                            pointer = F[cur];
                            try {
                                if (
                                    ((i[r][2] = 1),
                                        1 == (p = evaluate(code, cur + 4, pointer - 3, [], f, instance, null, 0))[0])
                                ) {
                                    return p;
                                }
                            } catch (c) {
                                if (
                                    i[r] &&
                                    i[r][1] &&
                                    1 == (p = evaluate(code, i[r][1][0], i[r][1][1], [], f, instance, c, 0))[0]
                                ) {
                                    return p;
                                }
                            } finally {
                                if (
                                    i[r] &&
                                    i[r][0] &&
                                    1 == (p = evaluate(code, i[r][0][0], i[r][0][1], [], f, instance, null, 0))[0]
                                ) {
                                    return p;
                                }
                                i[r] = 0;
                                r--;
                            }
                            cur += 2 * pointer - 2;
                        }
                    } else if (opcode < 2) {
                        if ((opcode = mod) < 8) {
                            y = insn_stack[cur--];
                            p = delete insn_stack[cur--][y];
                        } else if (opcode < 10) {
                            for (pointer = F[cur], opcode = "", P = n.q[pointer][0]; P < n.q[pointer][1]; P++) {
                                opcode += String.fromCharCode(strXorKey ^ n.p[P]);
                            }
                            cur += 4;
                            insn_stack[cur] = insn_stack[cur][opcode];
                        } else {
                            opcode < 12 ?
                                ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] << p)) :
                                opcode < 14 && ((insn_stack[++cur] = F[cur]), (cur += 2));
                        }
                    } else {
                        if (opcode < 3) {
                            if ((opcode = mod) < 2) {
                                // COND
                                (insn_stack[++cur] = p)
                            } else {
                                if (opcode < 11) {
                                    ((p = insn_stack[(cur -= 2)][insn_stack[cur + 1]] = insn_stack[cur + 2]), cur--)
                                } else {
                                    opcode < 13 && ((p = insn_stack[cur]), (insn_stack[++cur] = p))
                                }
                            }
                        } else {
                            if ((opcode = mod) > 12) {
                                // COND
                                (insn_stack[++cur] = _)
                            } else {
                                if (opcode > 5) {
                                    ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] !== p))
                                } else {
                                    if (opcode > 3) {
                                        ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] / p))
                                    } else {
                                        if (opcode > 1) {
                                            (A += 2 * (argNum = F[A]) - 2)
                                        } else {
                                            opcode > -1 && (insn_stack[cur] = !insn_stack[cur]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    opcode = 3 & mod;
                    if (((mod >>= 2), opcode < 1)) {
                        if ((opcode = mod) < 1) {
                            return [1, insn_stack[cur--]];
                        }
                        if (opcode < 5) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] * p;
                        } else if (opcode < 7) {
                            p = insn_stack[cur--];
                            insn_stack[cur] = insn_stack[cur] != p;
                        } else if (opcode < 14) {
                            y = insn_stack[cur--];
                            m = insn_stack[cur--];
                            (opcode = insn_stack[cur--])
                            .x === evaluate ?
                                opcode.y >= 1 ?
                                (insn_stack[++cur] = runCode(code, opcode.c, opcode.l, y, opcode.z, m, null, 1)) :
                                ((insn_stack[++cur] = runCode(code, opcode.c, opcode.l, y, opcode.z, m, null, 0)), opcode.y++) :
                                (insn_stack[++cur] = opcode.apply(m, y));
                        } else if (opcode < 16) {
                            var k;
                            pointer = F[cur];
                            (k = function c() {
                                var e = arguments;
                                return c.y > 0 ?
                                    runCode(code, c.c, c.l, e, c.z, this, null, 0) :
                                    (c.y++, runCode(code, c.c, c.l, e, c.z, this, null, 0));
                            })
                            .c = cur + 4;
                            k.l = pointer - 2;
                            k.x = evaluate;
                            k.y = 0;
                            k.z = f;
                            insn_stack[cur] = k;
                            cur += 2 * pointer - 2;
                        }
                    } else if (opcode < 2) {
                        (opcode = mod) > 8
                            ?
                            ((p = insn_stack[cur--]), (insn_stack[cur] = typeof p)) :
                            opcode > 4 ?
                            (insn_stack[(cur -= 1)] = insn_stack[cur][insn_stack[cur + 1]]) :
                            opcode > 2 &&
                            ((y = insn_stack[cur--]),
                                (opcode = insn_stack[cur])
                                .x === evaluate ?
                                opcode.y >= 1 ?
                                (insn_stack[cur] = runCode(code, opcode.c, opcode.l, [y], opcode.z, m, null, 1)) :
                                ((insn_stack[cur] = runCode(code, opcode.c, opcode.l, [y], opcode.z, m, null, 0)), opcode.y++) :
                                (insn_stack[cur] = opcode(y)));
                    } else if (opcode < 3) {
                        if ((opcode = mod) < 9) {
                            for (
                                p = insn_stack[cur--], pointer = F[cur], opcode = "", P = n.q[pointer][0]; P < n.q[pointer][1]; P++
                            ) {
                                opcode += String.fromCharCode(strXorKey ^ n.p[P]);
                            }
                            cur += 4;
                            insn_stack[cur--][opcode] = p;
                        } else if (opcode < 13) {
                            throw insn_stack[cur--];
                        }
                    } else {
                        (opcode = mod) < 1
                            ?
                            (insn_stack[++cur] = null) :
                            opcode < 3 ?
                            ((p = insn_stack[cur--]), (insn_stack[cur] = insn_stack[cur] >= p)) :
                            opcode < 12 && (insn_stack[++cur] = void 0);
                    }
                }
            }
        }
        return [0, null];
    }

    function runCode(code, start, end, b, d, f, t, n) {
        var o, i;
        null == f && (f = this);
        d && !d.d && ((d.d = 0), (d.$0 = d), (d[1] = {}));
        var r = {},
            _ = (r.d = d ? d.d + 1 : 0);
        for (r["$" + _] = r, i = 0; i < _; i++) {
            r[(o = "$" + i)] = d[o];
        }
        for (i = 0, _ = r.length = b.length; i < _; i++) {
            r[i] = b[i];
        }
        n && !initialStorage[start] && initVMStorage(code, start, 2 * end);
        return initialStorage[start] ?
            evaluate(code, start, end, 0, r, f, null, 1)[1] :
            evaluate(code, start, end, 0, r, f, null, 0)[1];
    }
}
