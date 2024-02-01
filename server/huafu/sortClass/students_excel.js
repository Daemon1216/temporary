const Excel = require('exceljs');
const _ = require('lodash');

const excelSort = async function(src,dst){
    let keys=[];
    let newList = [];
    var sort1 = []; // 1~79
    var sort2 = []; // 80~213
    const workbook = new Excel.Workbook();
    // 读取excel
    await workbook.xlsx.readFile(src);

    workbook.eachSheet(function(worksheet, sheetId) {
        worksheet.eachRow((row, rowNumber) => {
            let obj={};
            if (rowNumber > 1) {
                row.eachCell((cell, colNumber)=>{
                    const value=cell.value;
                    if(rowNumber===2) {
                        keys.push(value);
                    } else {
                        obj[keys[colNumber-1]]=value; // 下标
                    }
                });
                if(rowNumber>2) {
                    if (sheetId === 1 || sheetId === 2) {
                        sort1.push(obj);
                    } else {
                        sort2.push(obj);
                    }
                }
            }
        })
    });

    var len1 = sort1.length;
    var len2 = sort2.length;
    
    let new1 = _.shuffle(sort1)
    let new2 = _.shuffle(sort2)
    
    for (let i = 0; i < len1; i++) {
        let tmpObj = new1[i];
        newList = newList.concat([tmpObj]);
    }
    for (let i = 0; i < len2; i++) {
        let tmpObj = new2[i];
        newList = newList.concat([tmpObj]);
    }

    const outWorkbook = new Excel.stream.xlsx.WorkbookWriter({
        filename: dst
    });
    const worksheet1 = outWorkbook.addWorksheet('1班（40人）'); // 40
    const worksheet2 = outWorkbook.addWorksheet('2班（39人）'); // 39
    const worksheet3 = outWorkbook.addWorksheet('3班（34人）'); // 34
    const worksheet4 = outWorkbook.addWorksheet('4班（34人）'); // 34
    const worksheet5 = outWorkbook.addWorksheet('5班（33人）'); // 33
    const worksheet6 = outWorkbook.addWorksheet('6班（33人）'); // 33

    const newKeys = Object.keys(newList[0]);
    newKeys.unshift('序号');
    const outkeys = newKeys.map(item=> ({ header: item, key: item, width: 12 }));
    worksheet1.columns = outkeys;
    worksheet2.columns = outkeys;
    worksheet3.columns = outkeys;
    worksheet4.columns = outkeys;
    worksheet5.columns = outkeys;
    worksheet6.columns = outkeys;

    newList.forEach((el, idx) => {
        if (idx < 40) {
            el['序号'] = idx + 1;
            worksheet1.addRow(el).commit();
        } else if (idx < 40 + 39) {
            el['序号'] = idx - 39;
            worksheet2.addRow(el).commit();
        } else if (idx < 40 + 39 + 34) {
            el['序号'] = idx - 39 - 39;
            worksheet3.addRow(el).commit();
        } else if (idx < 40 + 39 + 34 + 34) {
            el['序号'] = idx - 39 -39 -34;
            worksheet4.addRow(el).commit();
        } else if (idx < 40 + 39 + 34 + 34 + 33) {
            el['序号'] = idx - 39 -39 -34 - 34;
            worksheet5.addRow(el).commit();
        } else {
            el['序号'] = idx - 39 -39 -34 - 34 - 33;
            worksheet6.addRow(el).commit();
        }
    })
    outWorkbook.commit();
}

excelSort('./students.xlsx','./学生考试安排表v3.xlsx');

