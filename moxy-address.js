"use strict";
exports.__esModule = true;
var parse = function (address) {
    if (!address.length) {
        throw new Error('Invalid address string!');
    }
    var addr = {
        city: '',
        company: '',
        name: '',
        state: '',
        street1: '',
        street2: '',
        zip: ''
    };
    var order = ['name', 'company', 'street1', 'street2', 'cityStateZip'];
    var street2prefixes = ['SUITE', 'APT', 'STE', 'POB', 'PO', 'PO BOX', 'UNIT', 'BLDG', 'ROOM'];
    var street1postfixes = ['N', 'E', 'S', 'W', 'NE', 'NW', 'SE',
        'SW', 'DR', 'RD', 'DRIVE', 'ROAD', 'LN', 'LANE', 'ST', 'STREET', 'AVE',
        'AVENUE', 'CT', 'COURT', 'CIR', 'CIRCLE'];
    address = address.replace(/\./g, '').replace(/  /g, '');
    if (address.indexOf('\n') === -1) {
        if (address.indexOf(',') > -1) { // break on comma if available
            var parts = address.split(',');
            if (parts.length === 2) {
                addr = Object.assign(addr, parseCityStateZip(parts[1]));
                addr.street1 = parts[0];
            }
            else {
                if (parts[parts.length - 1].trim().indexOf(' ') === -1) {
                    parts[parts.length - 2] += parts.pop();
                }
                address = parts.map(function (p) { return p.trim(); }).join('\n');
            }
        }
        else {
            var rest = void 0;
            if (address.match(/[0-9]{5}/g)) {
                var words = address.split(' ');
                addr = Object.assign(addr, parseCityStateZip(words.slice(-3).join(' ')));
                rest = words.slice(0, words.length - 3);
            }
            else {
                rest = address.split(' ');
            }
            var s2p_1 = 0;
            rest.some(function (aw, index) {
                if (street2prefixes.indexOf(aw.toUpperCase()) > -1) {
                    s2p_1 = index;
                    return true;
                }
            });
            if (s2p_1) {
                var p = 0;
                for (var i = 0; i < s2p_1; i++) {
                    if (rest[i].match(/[0-9]/g)) {
                        break;
                    }
                    p++;
                }
                if (p) {
                    addr.name = rest.slice(0, p).join(' ');
                }
                addr.street1 = rest.slice(p, s2p_1).join(' ');
                addr.street2 = rest.slice(s2p_1).join(' ');
            }
            else {
                var s1p_1 = 0;
                rest.some(function (aw, index) {
                    if (street1postfixes.indexOf(aw.toUpperCase()) > -1) {
                        s1p_1 = index;
                        return true;
                    }
                });
                if (s1p_1) {
                    var p = 0;
                    for (var i = 0; i < s1p_1; i++) {
                        if (rest[i].match(/[0-9]/g)) {
                            break;
                        }
                        p++;
                    }
                    if (p) {
                        addr.name = rest.slice(0, p).join(' ');
                    }
                    addr.street1 = rest.slice(p, s1p_1 + 1).join(' ');
                    addr.street2 = rest.slice(s1p_1 + 1).join(' ');
                }
            }
        }
    }
    if (address.indexOf('\n') > -1) {
        var parts = address.split('\n');
        if (parts.length === 3) {
            // Street, Street2, City/State/Zip
            // Name, Street, City/State/Zip
            if (parts[0].match(/[0-9]/g)) {
                addr.street1 = parts[0];
                addr.street2 = parts[1];
                addr = Object.assign(addr, parseCityStateZip(parts[2]));
            }
            else {
                addr.name = parts[0];
                addr.street1 = parts[1];
                addr = Object.assign(addr, parseCityStateZip(parts[2]));
            }
        }
        else if (parts.length === 4 || parts.length === 5) {
            var p = 0;
            if (!parts[p].match(/[0-9]/g)) {
                addr.name = parts[p++].trim();
            }
            if (!parts[p].match(/[0-9]/g)) {
                addr.company = parts[p++].trim();
            }
            p = parts.length - 3;
            if (p === 1) {
                order.shift();
            }
            while (parts[p]) {
                if (order[p] === 'cityStateZip') {
                    addr = Object.assign(addr, parseCityStateZip(parts[p++]));
                }
                else {
                    addr[order[p]] = parts[p++];
                }
            }
        }
    }
    return addr;
};
exports.format = function (address, format) {
    if (format === void 0) { format = false; }
    var addr = parse(address);
    console.log(addr);
    return format
        ? (addr.name + "\n" + addr.company + "\n" + addr.street1 + "\n" + addr.street2 + "\n" + addr.city + ", " + addr.state + " " + addr.zip)
            .replace(/\n\n/g, '\n').replace(/[^0-9a-z \n\-]/gi, '').trim().toUpperCase()
        : (addr.name + "\n" + addr.company + "\n" + addr.street1 + "\n" + addr.street2 + "\n" + addr.city + ", " + addr.state + " " + addr.zip)
            .replace(/\n\n/g, '\n').trim();
};
var parseCityStateZip = function (line) {
    var parts = line.split(' ');
    if (parts.length === 3) {
        return {
            city: parts[0],
            state: parts[1],
            zip: parts[2]
        };
    }
    else {
        var zip = parts.pop();
        var state = parts.pop();
        var city = parts.join(' ').trim();
        return {
            city: city,
            state: state,
            zip: zip
        };
    }
};
var MoxyAddress = /** @class */ (function () {
    function MoxyAddress() {
    }
    MoxyAddress.parseCityStateZip = function (line) { return parseCityStateZip(line); };
    MoxyAddress.format = function (address, strictFormat) {
        if (strictFormat === void 0) { strictFormat = false; }
        return exports.format(address, strictFormat);
    };
    MoxyAddress.parse = function (address) { return parse(address); };
    return MoxyAddress;
}());
exports.MoxyAddress = MoxyAddress;
exports["default"] = MoxyAddress;
