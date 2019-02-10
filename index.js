const ionjs = require('@ionjs/core')

// Setup the framework
ionjs.init({
    receivePort: 8080,
    receiveSecret: '',
    sendURL: 'http://localhost:5700',
    sendToken: '',
    operators: [1004121460],
    self: 3318691441,
})

ionjs.useSession(ionjs.when.contain('potato')) (
    async function greet(ctx) {
        await ctx.question("potato?")
    }
)

ionjs.start()