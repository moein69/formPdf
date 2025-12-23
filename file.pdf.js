"use strict";
const puppeteer = require('puppeteer');
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
var shamsi = require('shamsi-date-converter');

var result;
var number;
var sex;
var age;
var candidate;
var fnameUser;

const htmlToPdf = (req, res) => {
  (async () => {
    result = "";
    number = "";



    number = req.params.number;




    fs.readFile('public/form.html', 'utf8', function (err, dataHtml) {
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

//   const browser = await puppeteer.launch({
//   executablePath: '/usr/bin/chromium',
//   headless: true,
//   args: [
//     '--no-sandbox',
//     '--disable-setuid-sandbox',
//   ],
// });

// const browser = await puppeteer.launch({
//   headless: "new",
//   args: [
//     "--no-sandbox",
//     "--disable-setuid-sandbox",
//     "--disable-dev-shm-usage",
//     "--disable-gpu",
//   ],
// });
  const page = await browser.newPage()

  // 2. Create PDF from static HTML
  var resultNew = toEnDigit(stringResult);

  await page.setContent(resultNew);
  await page.emulateMediaType('screen');
  const pdf = await page.pdf({ path: 'html.pdf', format: 'A4', margin: { top: '30px', right: '20px', bottom: '20px', left: '20px' }, });


  // Return generated pdf in response
  res.setHeader('Content-Disposition', 'attachment; filename= ' + fnameUser + '.pdf');
  // res.contentType("application/pdf");
  res.status(200).send(pdf);


  await browser.close()




}



function getInfoProfile(res) {
  var url = 'https://m.preop-nican.ir/api/v1/patient/' + number.toString();
  axios.get(url)
    .then(function (response) {

      // console.log(dateISTISO = new Date(response.data['data'][0]['createdAt']).toISOString());
      // var datetime = moment(response.data['data'][0]['createdAt']).format('YYYY/MM/DD');
      // console.log(datetime);
      var y = moment(response.data['data'][0]['createdAt']).format('YYYY');
      var m = moment(response.data['data'][0]['createdAt']).format('MM');
      var d = moment(response.data['data'][0]['createdAt']).format('DD');
      const ja = shamsi.gregorianToJalali(parseInt(y), parseInt(m), parseInt(d));
      var startdate = moment(response.data['data'][0]['createdAt']);
      var returned_endate = moment(startdate).add(210, 'minutes');
      const time = moment(returned_endate).format("hh:mm");

      fnameUser = response.data['data'][0]['nationalCode'];



      sex = response.data['data'][0]['sex'];
      age = response.data['data'][0]['age'];
      candidate = response.data['data'][0]['descriptionCandidate'];
      result = result.replace('_name_c1', response.data['data'][0]['name']);
      result = result.replace('_family_c2', response.data['data'][0]['fname']);
      result = result.replace('_name_f_c3', response.data['data'][0]['fatherName']);
      result = result.replace('_age_c4', age);
      result = result.replace('_sex_c9', sex);
      result = result.replace('_Drname_c10', response.data['data'][0]['attendingPhysician']);
      result = result.replace('_number_c6', response.data['data'][0]['unitNo']);
      result = result.replace('_date_c7', ja);
      result = result.replace('_watch_c8', time);
      result = result.replace('_ward_c5', response.data['data'][0]['DateOfSurgery']);
      result = result.replace('b_Diagnosis', response.data['data'][0]['probableDiagnosis']);

      result = result.replace('b_candidate', response.data['data'][0]['candidate']);

      result = result.replace('b_radio_candidate', candidate);
      //   fs.writeFile('www/form.html', result, 'utf8', function (err) {
      //    if (err) return console.log(err);
      // }); 




      if (response.data['data'][0]['attendingPhysician'] == "") {
        result = result.replace('_dr_Signature', "مهر و امضای پزشک معالج");
      } else {
        result = result.replace('_dr_Signature', " پزشک معالج " + response.data['data'][0]['attendingPhysician']);
      }


      getInfoAll(res);



    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

}


function getInfoAll(res) {
  var url = 'https://m.preop-nican.ir/api/v1/Allinfo/' + number.toString();
  axios.get(url)
    .then(function (response) {


      if (response.data['data'][0]['colSubjectOfConsultationJosn'] == "") {
        var jsonCol2 = "";
      } else {
        var jsonCol2 = JSON.parse(response.data['data'][0]['colSubjectOfConsultationJosn']);
      }

      if (response.data['data'][0]['colObservationsJosn'] == "") {
        var jsonCol3 = "";
      } else {
        var jsonCol3 = JSON.parse(response.data['data'][0]['colObservationsJosn']);
      }

      if (response.data['data'][0]['colobservationsOtherJosn'] == "") {
        var jsonCol4 = "";
      } else {
        var jsonCol4 = JSON.parse(response.data['data'][0]['colobservationsOtherJosn']);
      }

      if (response.data['data'][0]['colPharmaceuticalHistoryJosn'] == "") {
        var jsonCol5 = "";
      } else {
        var jsonCol5 = response.data['data'][0]['colPharmaceuticalHistoryJosn'];
        // var jsonCol5 = JSON.parse(response.data['data'][0]['colPharmaceuticalHistoryJosn']);
      }

      if (response.data['data'][0]['colAboutJosn'] == "") {
        var jsonCol6 = "";
      } else {
        var jsonCol6 = JSON.parse(response.data['data'][0]['colAboutJosn']);
      }

      if (response.data['data'][0]['colFinalOpinionJosn'] == "") {
        var jsonCol7 = "";
      } else {
        var jsonCol7 = JSON.parse(response.data['data'][0]['colFinalOpinionJosn']);
      }

      if (response.data['data'][0]['colLabResultsJosn'] == "") {
        var jsonCol8 = "";
      } else {
        var jsonCol8 = JSON.parse(response.data['data'][0]['colLabResultsJosn']);
      }


      if (response.data['data'][0]['colSecondObservationsJosn'] == "") {
        var jsonCol9 = "";
      } else {
        var jsonCol9 = JSON.parse(response.data['data'][0]['colSecondObservationsJosn']);
      }

      if (response.data['data'][0]['colSecondObservationsOtherJosn'] == "") {
        var jsonCol10 = "";
      } else {
        var jsonCol10 = JSON.parse(response.data['data'][0]['colSecondObservationsOtherJosn']);
      }

      var signature = response.data['data'][0]['doctorID']['signature'];
      number = 0;
      var _C_multi_p1 = "";
      var descDr = '';









      var ga = "";
      var sa = "";
      if (jsonCol2 != "") {
        for (let i = 0; i < jsonCol2.length; i++) {
          if (jsonCol2[i]['root'] == 'G.A') {
            if (jsonCol2[i]['status'] == true) {
              var test = " با عارضه ";
              for (let j = 0; j < jsonCol2[i]['check'].length; j++) {
                if (jsonCol2[i]['check'][j]['status']) {
                  test = test + " " + jsonCol2[0]['check'][j]['titleEn'];

                }
              }
              if (test == " با عارضه ") {
                test = "بدون عارضه";
              }
              var position = jsonCol2[i]['input'][0]['input'].search(/Surgery/i);
              if (position == -1) {
                ga = ga + ' جراحی ' + jsonCol2[i]['input'][0]['input'] + "  " + jsonCol2[i]['input'][1]['input'] + " به روش بیهوشی عمومی " + test + ' | ';
              } else {
                ga = ga + jsonCol2[i]['input'][0]['input'] + "  " + jsonCol2[i]['input'][1]['input'] + " به روش بیهوشی عمومی " + test + ' | ';
              }

            }
          } else if (jsonCol2[i]['root'] == 'Sedation') {
            if (jsonCol2[i]['status'] == true) {
              var test = " با عارضه ";
              for (let j = 0; j < jsonCol2[i]['check'].length; j++) {
                if (jsonCol2[i]['check'][j]['status']) {
                  test = test + " " + jsonCol2[0]['check'][j]['titleEn'];

                }
              }
              if (test == " با عارضه ") {
                test = "بدون عارضه";
              }
              var position = jsonCol2[i]['input'][0]['input'].search(/Surgery/i);
              if (position == -1) {
                ga = ga + ' جراحی ' + jsonCol2[i]['input'][0]['input'] + "  " + jsonCol2[i]['input'][1]['input'] + " به روش Sedation " + test + ' | ';
              } else {
                ga = ga + jsonCol2[i]['input'][0]['input'] + "  " + jsonCol2[i]['input'][1]['input'] + " به روش Sedation " + test + ' | ';
              }

            }

          } else {
            if (jsonCol2[i]['status'] == true) {
              var test2 = " با عارضه ";
              for (let j = 0; j < jsonCol2[i]['check'].length; j++) {
                if (jsonCol2[i]['check'][j]['status']) {
                  test2 = test2 + " " + jsonCol2[i]['check'][j]['titleEn'];

                }
              }
              if (test2 == " با عارضه ") {
                test2 = "بدون عارضه";
              }
              if (jsonCol2[i]['root'] == 'SA') {
                var position = jsonCol2[i]['input'][0]['input'].search(/Surgery/i);
                if (position == -1) {
                  sa = sa + ' جراحی ' + jsonCol2[i]['input'][0]['input'] + "  " + jsonCol2[i]['input'][1]['input'] + " به روش بیهوشی نخاعی " + test2 + ' | ';
                } else {
                  sa = sa + jsonCol2[i]['input'][0]['input'] + "  " + jsonCol2[i]['input'][1]['input'] + " به روش بیهوشی نخاعی " + test2 + ' | ';
                }

              } else if (jsonCol2[i]['root'] == 'LA') {
                var position = jsonCol2[i]['input'][0]['input'].search(/Surgery/i);
                if (position == -1) {
                  sa = sa + ' جراحی ' + jsonCol2[i]['input'][0]['input'] + "  " + jsonCol2[i]['input'][1]['input'] + " به روش بی حسی موضعی " + test2 + ' | ';
                } else {
                  sa = sa + jsonCol2[i]['input'][0]['input'] + "  " + jsonCol2[i]['input'][1]['input'] + " به روش بی حسی موضعی " + test2 + ' | ';
                }

              } else {
                var position = jsonCol2[i]['input'][0]['input'].search(/Surgery/i);
                if (position == -1) {
                  sa = sa + ' جراحی ' + jsonCol2[i]['input'][0]['input'] + "  " + jsonCol2[i]['input'][1]['input'] + " به روش اپیدورال " + test2 + ' | ';
                } else {
                  sa = sa + jsonCol2[i]['input'][0]['input'] + "  " + jsonCol2[i]['input'][1]['input'] + " به روش اپیدورال " + test2 + ' | ';
                }

              }


            }

          }


        }
        result = result.replace('_G.A', ga);
        result = result.replace('_Sa_Ep_La', sa);
      } else {
        result = result.replace('_G.A', "«بیمار سابقه جراحی و بیهوشی قبلی ندارد»");
        result = result.replace('_Sa_Ep_La', "");
      }



      if (jsonCol3 != "") {
        var _center_Desc = "";
        var _desc_icu_ccu = "";
        var textDescAll = [];
        for (let i = 0; i < jsonCol3[0]['SDIM'].length; i++) {
          if (jsonCol3[0]['SDIM'][i]['status']) {

            var txt = "";
            // var textDesc = [];
            var textCheck = [];
            txt = jsonCol3[0]['SDIM'][i]['root'];

            // for (let j = 0; j < jsonCol3[0]['SDIM'][i]['input'].length; j++) {
            //   textDesc.push(jsonCol3[0]['SDIM'][i]['input'][j]['input']);
            // }
            // for (let j = 0; j < jsonCol3[0]['SDIM'][i]['txt'].length; j++) {
            //   if (jsonCol3[0]['SDIM'][i]['txt'][j]['titleEn'] != "لطفا انتخاب کنید") {
            //     textDesc.push(jsonCol3[0]['SDIM'][i]['txt'][j]['titleEn']);
            //   }
            // }
            for (let j = 0; j < jsonCol3[0]['SDIM'][i]['check'].length; j++) {
              if (jsonCol3[0]['SDIM'][i]['check'][j]['status'] == true) {
                textCheck.push(jsonCol3[0]['SDIM'][i]['check'][j]['titleEn']);
              }
            }


            // var desc = textDesc.filter(Boolean).join(" , ");
            if (textCheck.length == 0) {
              if(jsonCol3[0]['SDIM'][i]['root'] == "Anemia"){
                textDescAll.push(txt + "(" + jsonCol3[0]['SDIM'][i]['input'][0]['input'] + ")");
              }else{
                textDescAll.push(txt);
              }
              
            } else {
              textDescAll.push(txt + "(" + textCheck + ")");
            }



          }
        }

        if (jsonCol3[0]['input'] != null) {
          for (let i = 0; i < jsonCol3[0]['input'].length; i++) {
            textDescAll.push(jsonCol3[0]['input'][i]['root']);
          }
        }



        var t = textDescAll.filter(Boolean).join(" / ");
        if (textDescAll.length == 0) {
          _center_Desc = "«بیمار سابقه بیماری ندارد» ";
        } else if (textDescAll.length == 1) {
          _center_Desc = " سابقه بیماری " + textDescAll + " دارد ";
        } else {
          _center_Desc = " سابقه بیماری های " + t + " دارد ";
        }

      

        result = result.replace('_center_desc', _center_Desc + " <br> ");
      } else {
        result = result.replace('_center_desc', "");

      }


      if (jsonCol10 != "") {
        var textDescAll = [];
        var textDesc = [];
        for (let i = 0; i < jsonCol10[0]['SDIM'].length; i++) {

          if (jsonCol10[0]['SDIM'][i]['status']) {
            if (jsonCol10[0]['SDIM'][i]['root'] == "Drug Allergy") {
              var txtDrug = "";
              var textAllergy = [];
              for (let j = 0; j < jsonCol10[0]['SDIM'][i]['input'].length; j++) {
                txtDrug = jsonCol10[0]['SDIM'][i]['input'][j]['input'];
                // textDesc.push(jsonCol10[0]['SDIM'][i]['input'][j]['input']);
              }

              for (let j = 0; j < jsonCol10[0]['SDIM'][i]['check'].length; j++) {
                if (jsonCol10[0]['SDIM'][i]['check'][j]['status'] == true) {
                  textAllergy.push(jsonCol10[0]['SDIM'][i]['check'][j]['titleEn']);
                }
              }

              textDescAll.push("سابقه حساسیت به دارو " + txtDrug + " ( " + textAllergy + " ) " + " دارد ");
            } else if (jsonCol10[0]['SDIM'][i]['root'] == "Food Allergy") {
              var txtFood = "";
              var textAllergy = [];

              for (let j = 0; j < jsonCol10[0]['SDIM'][i]['txt'].length; j++) {
                if (jsonCol10[0]['SDIM'][i]['txt'][j]['titleEn'] != "لطفا انتخاب کنید") {
                  txtFood = jsonCol10[0]['SDIM'][i]['txt'][j]['titleEn'];
                }
              }

              for (let j = 0; j < jsonCol10[0]['SDIM'][i]['check'].length; j++) {
                if (jsonCol10[0]['SDIM'][i]['check'][j]['status'] == true) {
                  textAllergy.push(jsonCol10[0]['SDIM'][i]['check'][j]['titleEn']);
                }
              }

              textDescAll.push("سابقه حساسیت به غذای " + txtFood + " ( " + textAllergy + " ) " + " دارد ");
            } else {
              textDesc.push(jsonCol10[0]['SDIM'][i]['root']);
            }


          }
        }

        if (textDesc.length != 0) {
          var desc = textDesc.filter(Boolean).join(" , ");
          result = result.replace('_center3_desc_3', " سابقه " + desc + " دارد " + " <br> ");
        } else {
          result = result.replace('_center3_desc_3', "");
        }



        if (textDescAll.length == 0) {
          result = result.replace('_center2_desc_2', "");
        } else {
          result = result.replace('_center2_desc_2', textDescAll.filter(Boolean).join(" / ") + " <br> ");
        }



      } else {
        result = result.replace('_center2_desc_2', "");
        result = result.replace('_center3_desc_3', "");

      }




      if (jsonCol4 != "") {
        var _center_Desc = "";
        var textDescAll = [];
        var textDesc = [];
        for (let i = 0; i < jsonCol4[0]['SDIM'].length; i++) {

          if (jsonCol4[0]['SDIM'][i]['status']) {


            if (jsonCol4[0]['SDIM'][i]['root'] == "Smoking") {
              var numberSmok = (parseInt(jsonCol4[0]['SDIM'][i]['input'][0]['input']) * 52) / 20;
              textDescAll.push("سابقه مصرف سیگار " + " ( " + numberSmok + "pack/year" + " ) " + " دارد ");
            } else if (jsonCol4[0]['SDIM'][i]['root'] == "Opium") {
              if (jsonCol4[0]['SDIM'][i]['txt'][0]['titleEn'] != "لطفا انتخاب کنید") {
                textDescAll.push("سابقه مصرف opium " + " ( " + jsonCol4[0]['SDIM'][i]['txt'][0]['titleEn'] + " ) " + " دارد ");
              }
            } else {
              textDesc.push(jsonCol4[0]['SDIM'][i]['root']);
            }


          }
        }

        if (textDesc.length != 0) {
          var desc = textDesc.filter(Boolean).join(" , ");
          textDescAll.push(" سابقه مصرف  " + desc + " دارد ");
        }



        if (textDescAll.length == 0) {
          result = result.replace('_center4_desc_4', "");
        } else {
          result = result.replace('_center4_desc_4', textDescAll.filter(Boolean).join(" / ") + " <br> ");
        }



      } else {
        result = result.replace('_center4_desc_4', "");

      }




      // if (jsonCol4 != "") {


      //   for (let i = 0; i < jsonCol4[0]['SDIM'].length; i++) {

      //     if (jsonCol4[0]['SDIM'][i]['status']) {
      //       var textDesc = [];
      //       if (jsonCol4[0]['SDIM'][i]['root'] != "Smoking") {
      //         for (let j = 0; j < jsonCol4[0]['SDIM'][i]['input'].length; j++) {
      //           textDesc.push(jsonCol4[0]['SDIM'][i]['input'][j]['input']);
      //         }
      //       } else {
      //         for (let j = 0; j < jsonCol4[0]['SDIM'][i]['input'].length; j++) {
      //           var number = (parseInt(jsonCol4[0]['SDIM'][i]['input'][j]['input']) * 52) / 20;
      //           textDesc.push(number);
      //         }

      //       }


      //       for (let j = 0; j < jsonCol4[0]['SDIM'][i]['txt'].length; j++) {
      //         if (jsonCol4[0]['SDIM'][i]['txt'][j]['titleEn'] != "لطفا انتخاب کنید" && jsonCol4[0]['SDIM'][i]['txt'][j]['titleEn'] != "سایر مواد غذایی") {
      //           textDesc.push(jsonCol4[0]['SDIM'][i]['txt'][j]['titleEn']);
      //         }
      //       }
      //       if (jsonCol4[0]['SDIM'][i]['root'] != "Drug Allergy" && jsonCol4[0]['SDIM'][i]['root'] != "Food Allergy") {
      //         for (let j = 0; j < jsonCol4[0]['SDIM'][i]['check'].length; j++) {
      //           if (jsonCol4[0]['SDIM'][i]['check'][j]['status'] == true) {
      //             textDesc.push(jsonCol4[0]['SDIM'][i]['check'][j]['titleEn']);
      //           }
      //         }
      //       } else {
      //         var ms = " با علانم ";
      //         for (let j = 0; j < jsonCol4[0]['SDIM'][i]['check'].length; j++) {
      //           if (jsonCol4[0]['SDIM'][i]['check'][j]['status'] == true) {
      //             ms = ms + jsonCol4[0]['SDIM'][i]['check'][j]['titleEn'] + " ";

      //           }
      //         }
      //         if (ms != " با علانم ") {
      //           textDesc.push(ms);
      //         }

      //       }

      //       var allDesc = textDesc.filter(Boolean).join(" . ");
      //       _center_Desc = _center_Desc + '<div class="inline-list"> <span class="variable">' + jsonCol4[0]['SDIM'][i]['root'] + ":" + '</span> <span class="value">' + allDesc + '</span> </div>';
      //     }

      //   }

      // }


      // _center_Desc = _center_Desc + _desc_icu_ccu;
      // result = result.replace('_center_desc', _center_Desc);
      // console.log(jsonCol9[0]['SDIM'][2]['input'][0]['titlePr']);

      if (jsonCol9 != "") {

        if (age < 5) {
          result = result.replace('_bbChildren', jsonCol9[0]['input'][3]['input'] + " : For Children: Infancy Problem ");
        } else {
          result = result.replace('_bbChildren', '');
        }

        result = result.replace('_BMI', jsonCol9[0]['input'][0]['input']);
        result = result.replace('_H', jsonCol9[0]['input'][1]['input']);
        result = result.replace('_BW', jsonCol9[0]['input'][2]['input']);

        result = result.replace('_GCS', jsonCol9[0]['SDIM'][2]['txt'][0]['titleEn']);

        if (jsonCol9[0]['input'][4]['input'] != "") {
          result = result.replace('_bbDevelopmental', jsonCol9[0]['input'][4]['input'] + ' : Developmental Problem - ');
        } else {
          result = result.replace('_bbDevelopmental', "");



        }


      } else {

        result = result.replace('_bbChildren', "[For Children: Infancy Problem ");

        result = result.replace('_bbDevelopmental', "");

        result = result.replace('_BMI', "");
        result = result.replace('_H', "");
        result = result.replace('_BW', "");

        result = result.replace('_GCS', "");

      }



      if (jsonCol6 != "") {

        result = result.replace('_BP', jsonCol6[0]['input'][1]['input'] + " / " + jsonCol6[0]['input'][0]['input']);

        result = result.replace('a_bbHR', jsonCol6[0]['input'][2]['input']);
        result = result.replace('_RR', jsonCol6[0]['input'][3]['input']);

        // result = result.replace('_bbHeart_Sound', jsonCol6[0]['input'][9]['input']);
        // result = result.replace('_Lung_Sound', jsonCol6[0]['input'][10]['input']);




        result = result.replace('_bF_C', jsonCol6[0]['dropdown'][0]['titleEn']);
        result = result.replace('_Mallampati', jsonCol6[0]['dropdown'][1]['titleEn']);
        result = result.replace('_ULBT', jsonCol6[0]['dropdown'][2]['titleEn']);
        result = result.replace('_TMD', jsonCol6[0]['dropdown'][3]['titleEn']);

        result = result.replace('_Mouth_Opening', jsonCol6[0]['dropdown'][4]['titleEn']);
        result = result.replace('_Dentation', jsonCol6[0]['dropdown'][5]['titleEn']);
        result = result.replace('_Neck_Movement', jsonCol6[0]['dropdown'][6]['titleEn']);

        result = result.replace('_Lung_Sound', jsonCol6[0]['dropdown'][7]['titleEn']);
        result = result.replace('_bbHeart_Sound', jsonCol6[0]['dropdown'][8]['titleEn']);


        result = result.replace('_bbASA', jsonCol6[0]['dropdown'][9]['titleEn']);
      } else {




        result = result.replace('_BP', "");



        result = result.replace('a_bbHR', "");
        result = result.replace('_RR', "");
        result = result.replace('_Neck_Movement', "");
        result = result.replace('_Dentation', "");
        result = result.replace('_bbHeart_Sound', "");
        result = result.replace('_Lung_Sound', "");
        result = result.replace('_GCS', "");
        result = result.replace('_Paraclinic', "");
        result = result.replace('_bbASA', "");


        result = result.replace('_bF_C', "");
        result = result.replace('_Mallampati', "");
        result = result.replace('_ULBT', "");
        result = result.replace('_TMD', "");

        result = result.replace('_Mouth_Opening', "");
        result = result.replace('_Dentation', "");
      }

      if (jsonCol5 == "Op1") {
        result = result.replace('_bbOrders', "«بیمار داروی خاصی به صورت مداوم استفاده نمیکند»");
        result = result.replace('_mes_al_', "right");


        // var drug = "";
        // for (let i = 0; i < jsonCol5.length; i++) {
        //   if (i == 2) {
        //     drug = drug + '<br/>';
        //   }

        //   drug = drug + " [ " + jsonCol5[i]['DrugForm'] + " | " + jsonCol5[i]['DrugName'] + " | " + jsonCol5[i]['DrugDose'] + " | " + jsonCol5[i]['DrugConsumptionTime'] + " ] ";
        // }
        // result = result.replace('_mes_al_', "left");
        // result = result.replace('_bbOrders', drug);
      } else if (jsonCol5 == "Op2") {
        result = result.replace('_bbOrders', "«مصرف داروهای بیمار مطابق با برگه تلفیق دارویی می باشد»");
        result = result.replace('_mes_al_', "right");

      } else {
        result = result.replace('_bbOrders', "");
      }


      result = result.replace('b_radio_candidate', candidate);


      if (jsonCol7 != "") {

        for (let i = 0; i < jsonCol7[0]['CM'].length; i++) {
          if (jsonCol7[0]['CM'][i]['status']) {
            number++;
            switch (jsonCol7[0]['CM'][i]['root']) {
              case 'c1':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable"> ${number} - رضایت آگاهانه بیهوشی از بیمار اخذ گردید</span> </div></div>`;
                break;
              case 'c2':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - رضایت پرخطر</span> </div></div>`;
                break;
              case 'c3':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - رزرو تخت ICU به دلیل شرایط زمینه ای</span> </div></div>`;
                break;
              case 'c4':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - رزرو تخت ICU به دلیل نوع جراحی</span> </div></div>`;
                break;
              case 'c5':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable" style="direction:ltr;text-align: left;">${number} -  رزرو  ${jsonCol7[0]['IM'][0]['input']} واحد  Pack cell </span> </div></div>`;

                break;
              case 'c6':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable" style="direction:ltr;text-align: left;">${number} -  رزرو  ${jsonCol7[0]['IM'][1]['input']} واحد Whole blood</span> </div></div>`;

                break;
              case 'c7':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable" style="direction:ltr;text-align: left;">${number} -  رزرو  ${jsonCol7[0]['IM'][2]['input']} واحد FFP</span> </div></div>`;

                break;
              case 'c8':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable" style="direction:ltr;text-align: left;">${number} -  رزرو ${jsonCol7[0]['IM'][3]['input']} واحد Platelets Concentrate </span> </div></div>`;

                break;
              case 'c9':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - مشاوره قلب</span> </div></div>`;
                break;
              case 'c10':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - مشاوره داخلی</span> </div></div>`;
                break;
              case 'c11':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - مشاوره ریه</span> </div></div>`;
                break;
              case 'c12':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - مشاوره نورولوژی</span> </div></div>`;
                break;
              case 'c13':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - مشاوره مجدد بیهوشی پس از انجام موارد فوق</span> </div></div>`;
                break;
              case 'c14':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - مشاوره غدد</span> </div></div>`;
                break;
              case 'c15':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - معاینه مجدد بیمار بلافاصله قبل از بیهوشی توسط متخصص محترم بیهوشی</span> </div></div>`;
                break;
              case 'c16':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - اخذ تایید عمل از متخصص اطفال</span> </div></div>`;
                break;
              case 'c17':
                _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - اخذ رضایت آگاهانه از والدین بیمار</span> </div></div>`;
                break;

                case 'c18':
                  _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - CXR </span> </div></div>`;
                  break;
                case 'c19':
                  _C_multi_p1 = _C_multi_p1 + `<div class="flex-container"> <div class="inline-list"> <span class="variable">${number} - ECG </span> </div></div>`;
                  break;

            }
          }


        }

        if (number != 0) {
          result = result.replace('_C_multi_p1', _C_multi_p1);
        } else {
          result = result.replace('_C_multi_p1', "");
        }




        if (jsonCol7[0]['IM'][4]['input'] != "") {
          number++;
          descDr = descDr + number + " - " + jsonCol7[0]['IM'][4]['input'] + " <br> ";
        }


      } else {
        result = result.replace('_c2', "");
        result = result.replace('_c3', "");
        result = result.replace('_c4', "");
        result = result.replace('_c5', "");
        result = result.replace('_c6', "");
        result = result.replace('_c7', "");
        result = result.replace('_c8', "");
        result = result.replace('_c9', "");
        result = result.replace('_c10', "");
        result = result.replace('_C_multi_p1', "");
      }


      number++;
      descDr = descDr + number + "" + ' - NPO Time به صورت عدم استفاده از مایعات تا دو ساعت،آبمیوه های پالپ دار تا ۴ ساعت،مواد غذایی جامد تا ۶ ساعت قبل از جراحی' + " <br> ";






      if (jsonCol3 != "") {

        for (let i = 0; i < jsonCol3[0]['desc'].length; i++) {
          if (jsonCol3[0]['desc'][i]['status']) {
            number++;
            descDr = descDr + number + " - " + jsonCol3[0]['desc'][i]['desc'] + " <br> ";
          }

        }

      }









      var _html_lab = "";
      var _Prior_Consultation = false;
      var _Paraclinic = false;
      var _Cardiologist_Consultation = false;
      var numberBGRH = 0;
      var numberAllLab = 0;
      if (jsonCol8 != "") {
        if (jsonCol8[0]['input'] != "") {
          for (let i = 0; i < jsonCol8[0]['input'].length; i++) {
            if (jsonCol8[0]['input'][i]['input'] != "") {
              if (jsonCol8[0]['input'][i]['root'] != "Cardiologist consultation") {
                if (jsonCol8[0]['input'][i]['root'] != "Paraclinic") {
                  if (jsonCol8[0]['input'][i]['root'] != "Prior Consultation") {
                    if (jsonCol8[0]['input'][i]['root'] == 'Others') {
                      _html_lab = _html_lab + '<div class="inline-list"> <span class="variable">' + jsonCol8[0]['input'][i]['root'] + ":" + '</span> <span class="value" style="direction:ltr;text-align: left;">' + jsonCol8[0]['input'][i]['input'] + '</span> </div>';
                    } else {
                      numberAllLab++;
                      if (jsonCol8[0]['input'][i]['root'] == "BG" || jsonCol8[0]['input'][i]['root'] == "RH") {
                        numberBGRH++;
                      }
                      _html_lab = _html_lab + '<div class="inline-list"> <span class="variable">' + jsonCol8[0]['input'][i]['root'] + ":" + '</span> <span class="value" style="direction:rtl;text-align: left;">' + jsonCol8[0]['input'][i]['input'] + '</span> </div>';
                    }

                  } else {
                    _Prior_Consultation = true;
                    if (jsonCol8[0]['input'][i]['input'] == "") {
                      result = result.replace('_Prior_Consultation', "");
                    } else {
                      result = result.replace('_Prior_Consultation', jsonCol8[0]['input'][i]['input']);
                    }

                  }
                } else {
                  _Paraclinic = true;
                  if (jsonCol8[0]['input'][i]['input'] == "") {
                    result = result.replace('_Paraclinic', "");
                  } else {
                    result = result.replace('_Paraclinic', jsonCol8[0]['input'][i]['input']);
                  }

                }
              } else {
                _Cardiologist_Consultation = true;
                if (jsonCol8[0]['input'][i]['input'] == "") {
                  result = result.replace('_Cardiologist_Consultation', "");
                } else {
                  result = result.replace('_Cardiologist_Consultation', jsonCol8[0]['input'][i]['input']);
                }
              }

            }

          }

          if (_Prior_Consultation == false) {
            result = result.replace('_Prior_Consultation', "");
          }
          if (_Paraclinic == false) {
            result = result.replace('_Paraclinic', "");
          }
          if (_Cardiologist_Consultation == false) {
            result = result.replace('_Cardiologist_Consultation', "");
          }

          if (_html_lab != "") {
            if (numberBGRH == 2 && numberAllLab == 2) {
              _html_lab = _html_lab + '<div class="inline-list" style="border-bottom: none;"><span class="value" style="direction:rtl;text-align: right; border-bottom: none; width: 100%;">«تمامی آزمایشات بیمار نرمال است»</span> </div>';
            }

            result = result.replace('_html_lab', _html_lab);
          } else {
            // var lab_empty = '<div class="inline-list" style="border-bottom: none;"><span class="value" style="direction:rtl;text-align: right; border-bottom: none; width: 100%;"></span> </div>';
            // lab_empty = lab_empty + '<div class="inline-list" style="border-bottom: none;"><span class="value" style="direction:rtl;text-align: right; border-bottom: none; width: 100%;"></span> </div>';
            var lab_empty = `<div class="inline-list" style="border-bottom: none;width: 285px;"><span class="value" style="direction:rtl; border-bottom: none; width: 100%; font-family: 'Noto Kufi Arabic', sans-serif;"></span> </div>
          <div class="inline-list" style="border-bottom: none;width: 285px;"><span class="value" style="direction:rtl; border-bottom: none; width: 100%; font-family: 'Noto Kufi Arabic', sans-serif;"></span> </div>
          <div class="inline-list" style="border-bottom: none;width: 285px;"><span class="value" style="direction:rtl; border-bottom: none; width: 100%; font-family: 'Noto Kufi Arabic', sans-serif;">«تمامی آزمایشات بیمار نرمال است»</span> </div>`;
            result = result.replace('_html_lab', lab_empty);
          }





        } else {
          result = result.replace('_html_lab', `<div class="inline-list" style="border-bottom: none;width: 285px;"><span class="value" style="direction:rtl; border-bottom: none; width: 100%; font-family: 'Noto Kufi Arabic', sans-serif;"></span> </div>
        <div class="inline-list" style="border-bottom: none;width: 285px;"><span class="value" style="direction:rtl; border-bottom: none; width: 100%; font-family: 'Noto Kufi Arabic', sans-serif;"></span> </div>
        <div class="inline-list" style="border-bottom: none;width: 285px;"><span class="value" style="direction:rtl; border-bottom: none; width: 100%; font-family: 'Noto Kufi Arabic', sans-serif;">«بیمار آزمایشات لازم را همراه نداشت»</span> </div>`);
          result = result.replace('_Paraclinic', "");
          result = result.replace('_Prior_Consultation', "");
          result = result.replace('_Cardiologist_Consultation', "");

        }
      } else {
        result = result.replace('_html_lab', "");
        result = result.replace('_Paraclinic', "");
        result = result.replace('_Prior_Consultation', "");
        result = result.replace('_Cardiologist_Consultation', "");
      }

      // var descLib = '';
      if (jsonCol8 != "") {
        var textDesc = [];
        for (let i = 0; i < jsonCol8[0]['desc'].length; i++) {
          if (jsonCol8[0]['desc'][i]['status']) {
            textDesc.push(jsonCol8[0]['desc'][i]['desc']);
          }
        }
        if (textDesc.length != 0) {
          number++;
          descDr = descDr + number + " - " + " لطفا آزمایشات :  " + textDesc.filter(Boolean).join(" , ") + " انجام گردد ";
          // result = result.replace('Other_Lib', descDr);
        }
      }

      result = result.replace('_dr_desc', descDr);


      result = result.replace('_picture_', signature);

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



