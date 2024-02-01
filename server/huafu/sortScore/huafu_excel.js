const Excel = require('exceljs');
const _ = require('lodash');
const fs = require('fs');

const excelSort = async function(src,dst){
    let newList = [];
    const newClass = ['七年级01班','七年级02班','七年级03班','七年级04班','七年级05班','七年级06班'];
    const workbook = new Excel.Workbook();
    // 读取excel
    await workbook.xlsx.readFile(src);
    workbook.eachSheet(function(worksheet, sheetId) {
        worksheet.eachRow((row, rowNumber) => {
            if (sheetId === 1) {
                // 从第四行开始
                if (rowNumber >= 4) {
                    const tmpObj = {}
                    row.eachCell((cell, colNumber)=>{
                        // colNumber 4班级 5姓名 34总分 35总分排名 36校排名
                        let value = cell.value;
                        if (colNumber === 4) {
                            if (Array.isArray(value.richText) && value.richText) {
                                value = value.richText.map(el => el.text).join('')
                            }
                            Object.assign(tmpObj, { className: value, isZSC: newClass.includes(value) })
                        } else if (colNumber === 5) {
                            Object.assign(tmpObj, { studentName: value })
                        } else if (colNumber === 34) {
                            Object.assign(tmpObj, { totalScore: value })
                        } else if (colNumber === 36) {
                            Object.assign(tmpObj, { schoolRank: value })
                        }
                    });
                    newList.push(tmpObj)
                }
            }
        })
    });


    const to10 = { key: '前10', '五山': 0, '知识城': 0 }
    const to50 = { key: '前11-50', '五山': 0, '知识城': 0 }
    const to100 = { key: '前51-100', '五山': 0, '知识城': 0 }
    const to200 = { key: '101-200', '五山': 0, '知识城': 0 }
    const to300 = { key: '201-300', '五山': 0, '知识城': 0 }
    const to400 = { key: '301-400', '五山': 0, '知识城': 0 }
    const to500 = { key: '401-500', '五山': 0, '知识城': 0 }
    const to600 = { key: '501-600', '五山': 0, '知识城': 0 }
    const to700 = { key: '601-700', '五山': 0, '知识城': 0 }

    Object.assign(to10, { '七年级01班':0, '七年级02班':0, '七年级03班':0,'七年级04班':0, '七年级05班':0, '七年级06班':0,'七年级1班':0, '七年级2班':0, '七年级3班':0,'七年级4班':0, '七年级5班':0, '七年级6班':0,'七年级7班':0, '七年级8班':0, '七年级9班':0, '七年级10班':0, '七年级11班':0, '七年级12班':0 })
    Object.assign(to50, { '七年级01班':0, '七年级02班':0, '七年级03班':0,'七年级04班':0, '七年级05班':0, '七年级06班':0,'七年级1班':0, '七年级2班':0, '七年级3班':0,'七年级4班':0, '七年级5班':0, '七年级6班':0,'七年级7班':0, '七年级8班':0, '七年级9班':0, '七年级10班':0, '七年级11班':0, '七年级12班':0 })
    Object.assign(to100, { '七年级01班':0, '七年级02班':0, '七年级03班':0,'七年级04班':0, '七年级05班':0, '七年级06班':0,'七年级1班':0, '七年级2班':0, '七年级3班':0,'七年级4班':0, '七年级5班':0, '七年级6班':0,'七年级7班':0, '七年级8班':0, '七年级9班':0, '七年级10班':0, '七年级11班':0, '七年级12班':0 })
    Object.assign(to200, { '七年级01班':0, '七年级02班':0, '七年级03班':0,'七年级04班':0, '七年级05班':0, '七年级06班':0,'七年级1班':0, '七年级2班':0, '七年级3班':0,'七年级4班':0, '七年级5班':0, '七年级6班':0,'七年级7班':0, '七年级8班':0, '七年级9班':0, '七年级10班':0, '七年级11班':0, '七年级12班':0 })
    Object.assign(to300, { '七年级01班':0, '七年级02班':0, '七年级03班':0,'七年级04班':0, '七年级05班':0, '七年级06班':0,'七年级1班':0, '七年级2班':0, '七年级3班':0,'七年级4班':0, '七年级5班':0, '七年级6班':0,'七年级7班':0, '七年级8班':0, '七年级9班':0, '七年级10班':0, '七年级11班':0, '七年级12班':0 })
    Object.assign(to400, { '七年级01班':0, '七年级02班':0, '七年级03班':0,'七年级04班':0, '七年级05班':0, '七年级06班':0,'七年级1班':0, '七年级2班':0, '七年级3班':0,'七年级4班':0, '七年级5班':0, '七年级6班':0,'七年级7班':0, '七年级8班':0, '七年级9班':0, '七年级10班':0, '七年级11班':0, '七年级12班':0 })
    Object.assign(to500, { '七年级01班':0, '七年级02班':0, '七年级03班':0,'七年级04班':0, '七年级05班':0, '七年级06班':0,'七年级1班':0, '七年级2班':0, '七年级3班':0,'七年级4班':0, '七年级5班':0, '七年级6班':0,'七年级7班':0, '七年级8班':0, '七年级9班':0, '七年级10班':0, '七年级11班':0, '七年级12班':0 })
    Object.assign(to600, { '七年级01班':0, '七年级02班':0, '七年级03班':0,'七年级04班':0, '七年级05班':0, '七年级06班':0,'七年级1班':0, '七年级2班':0, '七年级3班':0,'七年级4班':0, '七年级5班':0, '七年级6班':0,'七年级7班':0, '七年级8班':0, '七年级9班':0, '七年级10班':0, '七年级11班':0, '七年级12班':0 })
    Object.assign(to700, { '七年级01班':0, '七年级02班':0, '七年级03班':0,'七年级04班':0, '七年级05班':0, '七年级06班':0,'七年级1班':0, '七年级2班':0, '七年级3班':0,'七年级4班':0, '七年级5班':0, '七年级6班':0,'七年级7班':0, '七年级8班':0, '七年级9班':0, '七年级10班':0, '七年级11班':0, '七年级12班':0 })

    newList.forEach(el => {
        if (/^[0-9]*$/.test(el.schoolRank)) {
            if (el.schoolRank <= 10) {
                if (newClass.includes(el.className)) {
                    to10['知识城'] += 1;
                } else {
                    to10['五山'] += 1;
                }
                to10[el.className] += 1;
            } else if (el.schoolRank <= 50) {
                if (newClass.includes(el.className)) {
                    to50['知识城'] += 1;
                } else {
                    to50['五山'] += 1;
                }
                to50[el.className] += 1;
            } else if (el.schoolRank <= 100) {
                if (newClass.includes(el.className)) {
                    to100['知识城'] += 1;
                } else {
                    to100['五山'] += 1;
                }
                to100[el.className] += 1;
            } else if (el.schoolRank <= 200) {
                if (newClass.includes(el.className)) {
                    to200['知识城'] += 1;
                } else {
                    to200['五山'] += 1;
                }
                to200[el.className] += 1;
            } else if (el.schoolRank <= 300) {
                if (newClass.includes(el.className)) {
                    to300['知识城'] += 1;
                } else {
                    to300['五山'] += 1;
                }
                to300[el.className] += 1;
            } else if (el.schoolRank <= 400) {
                if (newClass.includes(el.className)) {
                    to400['知识城'] += 1;
                } else {
                    to400['五山'] += 1;
                }
                to400[el.className] += 1;
            } else if (el.schoolRank <= 500) {
                if (newClass.includes(el.className)) {
                    to500['知识城'] += 1;
                } else {
                    to500['五山'] += 1;
                }
                to500[el.className] += 1;
            } else if (el.schoolRank <= 600) {
                if (newClass.includes(el.className)) {
                    to600['知识城'] += 1;
                } else {
                    to600['五山'] += 1;
                }
                to600[el.className] += 1;
            } else {
                if (newClass.includes(el.className)) {
                    to700['知识城'] += 1;
                } else {
                    to700['五山'] += 1;
                }
                to700[el.className] += 1;
            }
        }
    })

    const result = [to10, to50, to100, to200, to300, to400, to500, to600, to700]
    const sum = to10['五山'] + to10['知识城'] +
    to50['五山'] + to50['知识城'] +
    to100['五山'] + to100['知识城'] +
    to200['五山'] + to200['知识城'] +
    to300['五山'] + to300['知识城'] +
    to400['五山'] + to400['知识城'] +
    to500['五山'] + to500['知识城'] +
    to600['五山'] + to600['知识城'] +
    to700['五山'] + to700['知识城'];

    console.log('知识城:', to10['知识城'] +
    to50['知识城'] +
    to100['知识城'] +
    to200['知识城'] +
    to300['知识城'] +
    to400['知识城'] +
    to500['知识城'] +
    to600['知识城'] +
    to700['知识城'])

    console.log('result====', sum)

    fs.writeFile('data_huafu.json', JSON.stringify(result), (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });

}

excelSort('./scores.xlsx');

