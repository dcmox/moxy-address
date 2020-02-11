# moxy-address

Parse a US Postal Address

## Usage

```typescript
const MoxyAddress = require('moxy-address')
const address = MoxyAddress.parse(
	'1135 Mountain View Dr, APT #5, Olympia WA, 98510',
)
```

Result:

```json
{
	"city": "Olympia",
	"company": "",
	"name": "",
	"state": "WA",
	"street1": "1135 Mountain View Dr",
	"street2": "APT #5",
	"zip": "98510"
}
```

```typescript
const MoxyAddress = require('moxy-address')
const address = MoxyAddress.format(
	'John Doe, 1135 Mountain View Dr, APT #5, Olympia WA, 98510',
)
```

Result:

```
John Doe
1135 Mountain View Dr
APT #5
Olympia WA, 98510
```
