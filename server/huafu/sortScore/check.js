const huafu = require('./data_huafu.json')
const three = require('./data_three.json')

const huafu_zsc = huafu.filter(el => el.isZSC)
const three_zsc = three.filter(el => el.isZSC)

for (let key in three_zsc) {
    const name = three_zsc[key].studentName
    if (huafu_zsc.find(el => el.studentName === name)) {
        continue
    } else {
        console.log(name)
    }
}