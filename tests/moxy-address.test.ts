import assert from 'assert'
const MoxyAddress = require('../moxy-address').MoxyAddress

describe('moxy-address test suite', () => {
    it('should produce the right address', () => {
        const tests = [
            {
                expected: {
                    city: 'New York',
                    company: '',
                    name: '',
                    state: 'NY',
                    street1: '123 Main St',
                    street2: '',
                    zip: '12345',
                },
                test: '123 Main St, New York NY 12345',
            },
            {
                expected: {
                    city: 'New York',
                    company: '',
                    name: 'John Doe',
                    state: 'NY',
                    street1: '123 Main St',
                    street2: 'APT 55',
                    zip: '12345',
                },
                test: 'John Doe, 123 Main St., APT 55, New York NY 12345',
            },
            {
                expected: {
                    city: 'Beverly Hills',
                    company: 'Sally\'s Market',
                    name: 'Sally Fisher',
                    state: 'CA',
                    street1: '911 Beverly Hills Road',
                    street2: 'SUITE 69',
                    zip: '90210',
                },
                test: 'Sally Fisher, Sally\'s Market, 911 Beverly Hills Road, SUITE 69, Beverly Hills CA 90210',
            },
            {
                expected: {
                    city: 'Beverly Hills',
                    company: 'Sally\'s Market',
                    name: 'Sally Fisher',
                    state: 'CA',
                    street1: '911 Beverly Hills Road',
                    street2: 'SUITE 69',
                    zip: '90210',
                },
                test: 'Sally Fisher\nSally\'s Market\n911 Beverly Hills Road\nSUITE 69\nBeverly Hills CA 90210',
            },
            {
                expected: {
                    city: 'Olympia',
                    company: '',
                    name: '',
                    state: 'WA',
                    street1: '1135 Mountain View Dr',
                    street2: 'APT #5',
                    zip: '98510',
                },
                test: '1135 Mountain View Dr, APT #5, Olympia WA, 98510',
            },
        ]

        tests.forEach((test) => {
            assert.deepEqual(MoxyAddress.parse(test.test), test.expected)
        })
    })
    it('should format the right address', () => {
        const tests = [
            {
                expected: '123 MAIN ST\nNEW YORK NY 12345',
                test: '123 Main St, New York NY 12345',
            },
            {
                expected: '123 MAIN ST\nNEW YORK NY 12345-5696',
                test: '123 Main St., New York NY 12345-5696',
            },
        ]
        tests.forEach((test) => {
            assert.deepEqual(MoxyAddress.format(test.test, true), test.expected)
        })
    })
})

// console.log(1, extractAddress('Daniel Moxon 815 Livingston St. NE Lacey WA 98516'))
// console.log(2, extractAddress('1135 Morraine View Dr APT #3 Madison WI 53719'))
// console.log(3, extractAddress('1135 Morraine View Dr, APT #3, Madison WI, 53719'))
// console.log(4, extractAddress(`1135 Morraine View Dr
// APT #3
// Madison WI 53719`))
// //Max 35 characters per line
// console.log(5, extractAddress(`Daniel Moxon
// Programming Designs
// 1135 Morraine View Dr
// APT #3
// Madison WI 53719`))

// console.log(formatAddress('Daniel Moxon 815 Livingston St. NE Lacey WA 98516'))
// console.log(formatAddress('Daniel Moxon 1135 Morraine View Dr APT #3 Madison WI 53719-5310', true))