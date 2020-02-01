interface IAddress {
    name: string,
    company: string,
    street1: string,
    street2: string,
    city: string,
    state: string,
    zip: string
}

const parse = (address: string) => {
    let addr: IAddress = {
        city: '',
        company: '',
        name: '',
        state: '',
        street1: '',
        street2: '',
        zip: '',
    }

    const order: string[] = ['name', 'company', 'street1', 'street2', 'cityStateZip']
    const street2prefixes: string[] = ['SUITE', 'APT', 'STE', 'POB', 'PO', 'PO BOX', 'UNIT', 'BLDG', 'ROOM']
    const street1postfixes: string[] = ['N', 'E', 'S', 'W', 'NE', 'NW', 'SE',
        'SW', 'DR', 'RD', 'DRIVE', 'ROAD', 'LN', 'LANE', 'ST', 'STREET', 'AVE', 'AVENUE']

    address = address.replace(/\./g, '').replace(/  /g, '')
    if (address.indexOf('\n') === -1) {
        if (address.indexOf(',') > -1) { // break on comma if available
            const parts: string[] = address.split(',')
            if (parts.length === 2) {
                addr = Object.assign(addr, parseCityStateZip(parts[1]))
                addr.street1 = parts[0]
            } else {
                if (parts[parts.length - 1].trim().indexOf(' ') === -1) {
                    parts[parts.length - 2] += parts.pop()
                }
                address = parts.map((p) => p.trim()).join('\n')
            }
        } else {
            let rest
            if (address.match(/[0-9]{5}/g)) {
                const words = address.split(' ')
                addr = Object.assign(addr, parseCityStateZip(words.slice(-3).join(' ')))
                rest = words.slice(0, words.length - 3)
            } else {
                rest = address.split(' ')
            }
            
            let s2p: number = 0
            rest.some((aw: string, index: number) => {
                if (street2prefixes.indexOf(aw.toUpperCase()) > -1) {
                    s2p = index
                    return true
                }
            })
            if (s2p) {
                let p: number = 0
                for (let i = 0; i < s2p; i++) {
                    if (rest[i].match(/[0-9]/g)) { break }
                    p++
                }
                if (p) { addr.name = rest.slice(0, p).join(' ') }
                addr.street1 = rest.slice(p, s2p).join(' ')
                addr.street2 = rest.slice(s2p).join(' ')
            } else {
                let s1p: number = 0
                rest.some((aw: string, index: number) => {
                    if (street1postfixes.indexOf(aw.toUpperCase()) > -1) {
                        s1p = index
                        return true
                    }
                })
                if (s1p) {
                    let p: number = 0
                    for (let i = 0; i < s1p; i++) {
                        if (rest[i].match(/[0-9]/g)) { break }
                        p++
                    }
                    if (p) { addr.name = rest.slice(0, p).join(' ') }
                    addr.street1 = rest.slice(p, s1p + 1).join(' ')
                    addr.street2 = rest.slice(s1p + 1).join(' ')
                }
            }
        }
    }
    if (address.indexOf('\n') > -1) {
        const parts = address.split('\n')
        if (parts.length === 3) {
            // Street, Street2, City/State/Zip
            // Name, Street, City/State/Zip
            if (parts[0].match(/[0-9]/g)) {
                addr.street1 = parts[0]
                addr.street2 = parts[1]
                addr = Object.assign(addr, parseCityStateZip(parts[2]))
            } else {
                addr.name = parts[0]
                addr.street1 = parts[1]
                addr = Object.assign(addr, parseCityStateZip(parts[2]))
            }
        } else if (parts.length === 4 || parts.length === 5) {
            let p: number = 0
            if (!parts[p].match(/[0-9]/g)) { addr.name = parts[p++].trim() }
            if (!parts[p].match(/[0-9]/g)) { addr.company = parts[p++].trim() }
            p = parts.length - 3
            if (p === 1) { order.shift() }

            while (parts[p]) {
                if (order[p] === 'cityStateZip') {
                    addr = Object.assign(addr, parseCityStateZip(parts[p++]))
                } else {
                    console.log(order[p], parts[p])
                    addr[order[p]] = parts[p++]
                }
            }
        }
    }
    return addr
}

export const format = (address: string, format: boolean = false) => {
    const addr: IAddress = parse(address)
    console.log(addr)
    return format
    ? `${addr.name}\n${addr.company}\n${addr.street1}\n${addr.street2}\n${addr.city}, ${addr.state} ${addr.zip}`
        .replace(/\n\n/g, '\n').replace(/[^0-9a-z \n\-]/gi, '').trim().toUpperCase()
    : `${addr.name}\n${addr.company}\n${addr.street1}\n${addr.street2}\n${addr.city}, ${addr.state} ${addr.zip}`
        .replace(/\n\n/g, '\n').trim()
}

const parseCityStateZip = (line: string) => {
    const parts = line.split(' ')
    if (parts.length === 3) {
        return {
            city: parts[0],
            state: parts[1],
            zip: parts[2],
        }
    } else {
        const zip = parts.pop()
        const state = parts.pop()
        const city = parts.join(' ').trim()
        return {
            city,
            state,
            zip,
        }
    }
}

export class MoxyAddress {
    public static parseCityStateZip = (line: string) => parseCityStateZip(line)
    public static format = (address: string, strictFormat: boolean = false) => format(address, strictFormat)
    public static parse = (address: string) => parse(address)
}

export default MoxyAddress

console.log(MoxyAddress.parse('123 Main St. APT 3'))