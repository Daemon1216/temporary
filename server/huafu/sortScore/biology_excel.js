const Excel = require('exceljs');
const _ = require('lodash');
const fs = require('fs');

function divMethod(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

function accMul(arg1, arg2) { 
    let m = 0 
    let s1 = arg1.toString() 
    let s2 = arg2.toString() 
    try { 
        m += s1.split('.')[1] ? s1.split('.')[1].length : '' 
    } catch (e) {} 
    try { 
        m += s2.split('.')[1] ? s2.split('.')[1].length : '' 
    } catch (e) {} 
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m) 
} 

const excelSort = async function(src,dst){
    let keys=[];
    let newList = [];
    const workbook = new Excel.Workbook();
    // 读取excel
    await workbook.xlsx.readFile(src);

    workbook.eachSheet(function(worksheet, sheetId) {
        console.log('sheetId', sheetId)
        if (sheetId === 1) {
            worksheet.eachRow((row, rowNumber) => {
                let obj = {};
                if (rowNumber >= 3) {
                    row.eachCell((cell, colNumber)=>{
                        if (colNumber >= 6 && colNumber <= 37) {
                            let value = cell.value;
                            if (Array.isArray(value.richText) && value.richText) {
                                value = value.richText.map(el => el.text).join('')
                            }

                            if(rowNumber == 3) {
                                keys.push(value);
                            } else {
                                obj[keys[colNumber-6]]=value; // 下标
                            }
                        }
                    });
                    if (Object.values(obj).length) {
                        newList.push(obj)
                    }
                }
            })
        }
    });

    console.log('keys', keys);
    const groupByQ = {}
    const checkList = [];
    keys.forEach(key => {
        newList.forEach(row => {

            if (!groupByQ[key]) {
                groupByQ[key] = {};
            }

            // 过滤异常数据
            if (/^[A-Za-z]+$/.test(row[key])) {

                let answerList = [];
                if (row[key].length === 1) {
                    // 判断是单选
                    answerList = [row[key]]
                } else {
                    answerList = row[key].split('')
                }

                answerList.forEach(ans => {

                    if (!checkList.includes(ans)) {
                        checkList.push(ans);
                    }

                    if (groupByQ[key][ans]) {
                        groupByQ[key][ans] = groupByQ[key][ans] + 1; // 统计数据
                    } else {
                        groupByQ[key][ans] = 1;
                    }
                })
            }
        })
    })

    console.log('==', checkList)

    for (let key in groupByQ) {
        let ansObj = groupByQ[key]

        for (let ansKey in ansObj) {
            // ansObj[`rate${ansKey}`] = parseFloat((ansObj[ansKey] / 200).toFixed(2))
            ansObj[`rate${ansKey}`] = accMul(divMethod(ansObj[ansKey], 200), 100) + '%'
        }
    }

    const outWorkbook = new Excel.stream.xlsx.WorkbookWriter({
        filename: dst
    });
    const worksheet = outWorkbook.addWorksheet('统计'); // 40

    let addedKeys = keys.reduce((arr, b) => [...arr, b, `${b}占比`], []);

    const newKeys = ['选项'].concat(addedKeys);
    const outkeys = newKeys.map(item=> ({ header: item, key: item, width: 12 }));
    worksheet.columns = outkeys;

    let outputList = [];

    checkList.forEach((ansKey) => {
        const rowObj = {
            '选项': ansKey,
        }

        for (let qKey in groupByQ) {
            if (groupByQ[qKey]) {


                if (groupByQ[qKey][ansKey]) {
                    rowObj[qKey] = `${groupByQ[qKey][ansKey]}`
                    rowObj[`${qKey}占比`] = `${groupByQ[qKey][`rate${ansKey}`]}`
                } else {
                    rowObj[qKey] = ''
                }

            }
        }

        outputList.push(rowObj)

        worksheet.addRow(rowObj).commit();
    })
    outWorkbook.commit();

    fs.writeFile('data_biology.json', JSON.stringify(outputList), (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });
}

excelSort('./selectAnalysis.xlsx', './成绩统计v1.xlsx');

