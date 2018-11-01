## 2.0.0 (November 1, 2018)

* Breaking Change: Removed Broker namespace from main interface.  You have to now directly import required methods.
  - Good: `import * as Broker from "@bluemarblepayroll/object-system";``
  - Good: `import { assign, make, message, register, reset } from "@bluemarblepayroll/object-system";``
  - Bad: `import { Broker } from "@bluemarblepayroll/object-system";``
