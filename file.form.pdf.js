"use strict";

const fs = require('fs');
const axios = require('axios');

var result;
var number;


const htmlToPdf = (req, res) => {
  (async () => {


    result = "";
    number = "";



    number = req.params.number;


    fs.readFile('public/user-form.html', 'utf8', function (err, dataHtml) {
      if (err) {
        return console.log(err);
      }
      result = dataHtml;


      getInfoProfile(res);


    });

  })();

}

module.exports = {
  htmlToPdf,
};

async function sendPdf(res, stringResult) {

    const browser = await puppeteer.launch(
    {
      args: ['--no-sandbox']
    }

  );

// const browser = await puppeteer.launch({
//   executablePath: '/usr/bin/chromium',
//   headless: true,
//   args: [
//     '--no-sandbox',
//     '--disable-setuid-sandbox',
//   ],
// });
  const page = await browser.newPage()

  // 2. Create PDF from static HTML
  var resultNew = toEnDigit(stringResult);

  await page.setContent(resultNew);
  await page.emulateMediaType('screen');
  const pdf = await page.pdf({ path: 'html.pdf', format: 'A4', margin: { top: '30px', right: '20px', bottom: '20px', left: '20px' }, });


  // Return generated pdf in response
  res.setHeader('Content-Disposition', 'attachment; filename= ' + number + '.pdf');
  // res.contentType("application/pdf");
  res.status(200).send(pdf);


  await browser.close()




}



function getInfoProfile(res) {

  var url = 'https://preop-nican.ir/api/v1/getInitialForm/' + number.toString();
  axios.get(url)
    .then(function (response) {


      // var array = JSON.parse("[" + response.data['data'][0]['BodyArr'] + "]");
      var array = response.data['data'][0]['BodyArr'].split(",")

      console.log(array);
  
  result = result.replace('_f1', array[2]);
  result = result.replace('_f2', array[3]);
  result = result.replace('_f3', array[4]);
  result = result.replace('_f4', array[5]);
  result = result.replace('_f5', array[6]);
  result = result.replace('_f6', array[7]);
  result = result.replace('_f7', array[8]);
  result = result.replace('_f8', array[9]);
  result = result.replace('_f9', array[10]);
  result = result.replace('_f10', array[13]);
  result = result.replace('_f11', array[14]);
  result = result.replace('_f12', array[15]);
  result = result.replace('_f13', array[16]);
  result = result.replace('_f14', array[17]);
  result = result.replace('_f15', array[18]);
  result = result.replace('_f16', array[19]);
  result = result.replace('_f17', array[20]);
  result = result.replace('_f18', array[21]);  
  result = result.replace('_f19', array[22]);
  result = result.replace('_f20', array[23]);
  result = result.replace('_f21', array[24]);
  if(array[8] == "مجرد"){
    result = result.replace('_f22', "");
    result = result.replace('_f23', "");
    result = result.replace('_t1', "");
    result = result.replace('_t2', "");
  }else{
    result = result.replace('_f22', array[25]);
    result = result.replace('_f23', array[26]);
    result = result.replace('_t1', "نام و نام خانوادگی همسر بیمار");
    result = result.replace('_t2', "کد ملی همسر بیمار");
  }
  result = result.replace('_f24', array[27]);
  result = result.replace('_f25', array[28]);
  result = result.replace('_f26', array[29]);
  result = result.replace('_f27', array[30]);
  result = result.replace('_f28', array[31]);

  sendPdf(res, result);


})
.catch(function (error) {
  // handle error
  console.log(error);
})
.finally(function () {
  // always executed
});

}

function toEnDigit(s) {
  return s.replace(/[\u0660-\u0669\u06f0-\u06f9]/g,    // Detect all Persian/Arabic Digit in range of their Unicode with a global RegEx character set
    function (a) { return a.charCodeAt(0) & 0xf }     // Remove the Unicode base(2) range that not match
  )
}



