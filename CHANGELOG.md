## 3.0.0 (February 7th, 2019)

Maintenance Update + 1 Breaking Change:

* Breaking Change: Removed override option (will now default to override = true for all cases)
* Addressed complexity issues (broke out registry/queue components)
* Added Badging

## 2.0.0 (November 1, 2018)

* Breaking Change: Removed Broker namespace from main interface.  You have to now directly import required methods.
  - Good: `import * as Broker from "@bluemarblepayroll/object-system";`
  - Good: `import { assign, make, message, register, reset } from "@bluemarblepayroll/object-system";`
  - Bad: `import { Broker } from "@bluemarblepayroll/object-system";`
