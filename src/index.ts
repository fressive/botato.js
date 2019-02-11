// Requirements
import * as ionjs from '@ionjs/core'


// Setup the framework
ionjs.init({
    receivePort: 8080,
    sendURL: 'http://localhost:5700',
    operators: [1004121460],
    self: 3318691441,
    prefixes: ["> "],
    middlewareTimeout: 20000 // fuck network
})

import './plugins/wahtani'

ionjs.start()