require('./db/mongoose')
const Task = require('./models/task')
const User = require('./models/user')

// Task.findByIdAndDelete('5ead9c7d1f2ba241c0d71002').then(() => {
//     return Task.countDocuments({completed: false})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

// const updateAgeAndCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate(id, {age: age })
//     const count = await User.countDocuments({age})
//     return count
// }

// updateAgeAndCount('5eada2c8d6853e1c6c08e801', 21).then((count) => {
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async(id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments()
    return count
}
deleteTaskAndCount('5eadb52f4a7a105b682cea09').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})