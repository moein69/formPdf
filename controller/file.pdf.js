"use strict";
const fs = require('fs');
// const http = require('http');
// const querystring = require('querystring');
const axios = require('axios');
const express = require("express");
const app = express();
var path = require('path')

const pdfcrowd = require("pdfcrowd");

var result;
var client ;
var callbacks;



const htmlToPdf = (req, res) => {
  (async () => {
    const number = req.params.number;



    // create the API client instance
    client = new pdfcrowd.HtmlToPdfClient("demo", "ce544b6ea52a5621fb9d55f8b542d14d");

    // configure the callback to send a file in the HTTP response
     callbacks = pdfcrowd.sendGenericHttpResponse(
      res, "application/pdf", number + '.pdf', "attachment");

    // configure the callback to send an error in the HTTP response
    callbacks.error = function (errMessage, statusCode) {
      res.set('Content-Type', 'text/plain');
      res.status(statusCode || 400);
      res.send(errMessage);
    }


    fs.readFile('public/form.html', 'utf8', function (err, dataHtml) {
      if (err) {
        return console.log(err);
      }
      result = dataHtml;

      getInfoProfile();
      getInfoAll();

      



    });




    
 

    



  })();

}

module.exports = {
  htmlToPdf,
};




function getInfoProfile() {

  axios.get('http://preop-nican.ir/api/v1/patient/1234')
    .then(function (response) {



      result = result.replace('_name_c1', response.data['data'][0]['name']);
      result = result.replace('_family_c2', response.data['data'][0]['fname']);
      result = result.replace('_name_f_c3', response.data['data'][0]['fatherName']);
      result = result.replace('_age_c4', response.data['data'][0]['age']);
      result = result.replace('_sex_c9', response.data['data'][0]['sex']);
      result = result.replace('_Drname_c10', response.data['data'][0]['attendingPhysician']);
      result = result.replace('_number_c6', response.data['data'][0]['unitNo']);
      result = result.replace('_date_c7', response.data['data'][0]['fatherName']);
      result = result.replace('_watch_c8', response.data['data'][0]['fatherName']);
      result = result.replace('_ward_c5', response.data['data'][0]['ward']);
      result = result.replace('b_Diagnosis', response.data['data'][0]['probableDiagnosis']);

      result = result.replace('b_candidate', response.data['data'][0]['candidate']);

      result = result.replace('b_radio_candidate', response.data['data'][0]['descriptionCandidate']);
      //   fs.writeFile('www/form.html', result, 'utf8', function (err) {
      //    if (err) return console.log(err);
      // }); 



    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

}


function getInfoAll() {

  axios.get('http://preop-nican.ir/api/v1/Allinfo/1234')
    .then(function (response) {


      var jsonCol2 = JSON.parse(response.data['data'][0]['colSubjectOfConsultationJosn']);
      var jsonCol3 = JSON.parse(response.data['data'][0]['colObservationsJosn']);
      var jsonCol4 = JSON.parse(response.data['data'][0]['colobservationsOtherJosn']);
      var jsonCol5 = JSON.parse(response.data['data'][0]['colPharmaceuticalHistoryJosn']);
      var jsonCol6 = JSON.parse(response.data['data'][0]['colAboutJosn']);
      var jsonCol7 = JSON.parse(response.data['data'][0]['colFinalOpinionJosn']);

      // console.log(jsonCol4[0]['SIM'][0]['input'][0]['root']);


      for (let i = 0; i < jsonCol3[0]['SIM'].length; i++) {
        switch (jsonCol3[0]['SIM'][i]['input'][0]['root']) {
          case 'Dm':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_dm', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_dm', "");
            }

            break;

          case 'HTN':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_HTN', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_HTN', "");
            }
            break;

          case 'IHD':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_IHD', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_IHD', "");
            }
            break;
          // case 'VHD':
          //   result = result.replace('_VHD', jsonCol3[0]['SIM'][i]['input'][0]['input']);

          //   break;
          case 'Anemia':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Anemia', jsonCol3[0]['SIM'][i]['input'][0]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][1]['input']);
            } else {
              result = result.replace('_Anemia', "");
            }
            break;
          case 'Hypothyroidis':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Hypothyroidism', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Hypothyroidism', "");
            }
            break;
          case 'Hyperthyroidism':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Hyperthyroidism', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Hyperthyroidism', "");
            }
            break;
          case 'ICU Admission':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_ICU_Admission', jsonCol3[0]['SIM'][i]['input'][0]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][1]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][2]['input']);
            } else {
              result = result.replace('_ICU_Admission', "");
            }
            break;
          case 'CCU Admission':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_CCU_Admission', jsonCol3[0]['SIM'][i]['input'][0]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][1]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][2]['input']);
            } else {
              result = result.replace('_CCU_Admission', "");
            }
            break;
          // case 'Cough':
          //   result = result.replace('_cough', jsonCol3[0]['SIM'][i]['input'][0]['input']);

          //   break;
          // case 'Dyspnea':
          //   result = result.replace('_Dyspnea', jsonCol3[0]['SIM'][i]['input'][0]['input']);

          //   break;
          case 'Asthma':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Asthma', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Asthma', "");
            }
            break;
          case 'COPD':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_COPD', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_COPD', "");
            }
            break;
          case 'Recent URTI':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_URTI', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_URTI', "");
            }
            break;
          // case 'Snoring':
          //   result = result.replace('_Snoring', jsonCol3[0]['SIM'][i]['input'][0]['input']);

          //   break;
          // case 'Sleep Apnea':
          //   result = result.replace('_Apnea', jsonCol3[0]['SIM'][i]['input'][0]['input']);

          //   break;



          case 'GERD':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_GERD', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_GERD', "");
            }
            break;
          case 'Liver Disease':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Liver', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Liver', "");
            }
            break;
          case 'Seizure':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Seizure', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Seizure', "");
            }
            break;
          // case 'CVA':
          //   result = result.replace('_CVA', jsonCol3[0]['SIM'][i]['input'][0]['input']);

          //   break;

          case 'Migraine':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Migraine', jsonCol3[0]['SIM'][i]['input'][0]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][1]['input']);
            } else {
              result = result.replace('_Migraine', "");
            }
            break;
          // case 'Renal Problem':
          //   result = result.replace('_Renal_Problem', jsonCol3[0]['SIM'][i]['input'][0]['input']);

          //   break;
          case 'Dialysis':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Dialysis', jsonCol3[0]['SIM'][i]['input'][0]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][1]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][2]['input']);
            } else {
              result = result.replace('_Dialysis', "");
            }
            break;
          case 'Bleeding Disorder':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_bleeding', jsonCol3[0]['SIM'][i]['input'][0]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][1]['input']);
            } else {
              result = result.replace('_bleeding', "");
            }
            break;
          case 'Radiotherapy':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Radiotherapy', jsonCol3[0]['SIM'][i]['input'][0]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][1]['input']);
            } else {
              result = result.replace('_Radiotherapy', "");
            }
            break;
          case 'Chemotherapy':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Chemotherapy', jsonCol3[0]['SIM'][i]['input'][0]['input'] + " . " + jsonCol3[0]['SIM'][i]['input'][1]['input']);
            } else {
              result = result.replace('_Chemotherapy', "");
            }
            break;
          case 'Pregnancy':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Pregnancy', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Pregnancy', "");
            }
            break;
          case 'Artificial Denture':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Denture', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Denture', "");
            }
            break;
          case 'Loose teeth':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_Loose_teeth', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Loose_teeth', "");
            }
            break;
          case 'RA':
            if (jsonCol3[0]['SIM'][i]['status']) {
              result = result.replace('_RA', jsonCol3[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_RA', "");
            }
            break;



        }
      }

      for (let i = 0; i < jsonCol3[0]['SDM'].length; i++) {

        switch (jsonCol3[0]['SDM'][i]['input']['root']) {
          case 'Cough':
            if (jsonCol3[0]['SDM'][i]['status']) {
              var text = jsonCol3[0]['SDM'][i]['input']['input'];
              text += " . " + jsonCol3[0]['SDM'][i]['txt'][0]['titleEn'];
              result = result.replace('_cough', text);
            } else {
              result = result.replace('_cough', "");
            }
            break;
          case 'Dyspnea':
            if (jsonCol3[0]['SDM'][i]['status']) {
              var text = jsonCol3[0]['SDM'][i]['input']['input'];
              text += " . " + jsonCol3[0]['SDM'][i]['txt'][0]['titleEn'];
              result = result.replace('_Depression', text);
            } else {
              result = result.replace('_Depression', "");
            }
            break;
        }
      }

      for (let i = 0; i < jsonCol3[0]['SCM'].length; i++) {

        switch (jsonCol3[0]['SCM'][i]['input']['root']) {
          case 'VHD':
            if (jsonCol3[0]['SCM'][i]['status']) {
              var text = jsonCol3[0]['SCM'][i]['input']['input'];
              for (let j = 0; j < jsonCol3[0]['SCM'][i]['check'].length; j++) {
                if (jsonCol3[0]['SCM'][i]['check'][j]['status'] == true) {
                  text += " . " + jsonCol3[0]['SCM'][i]['check'][j]['titleEn'];
                }
              }
              result = result.replace('_VHD', text);
            } else {
              result = result.replace('_VHD', "");
            }
            break;
          case 'Renal Problem':

            if (jsonCol3[0]['SCM'][i]['status']) {
              var text = jsonCol3[0]['SCM'][i]['input']['input'];
              for (let j = 0; j < jsonCol3[0]['SCM'][i]['check'].length; j++) {
                if (jsonCol3[0]['SCM'][i]['check'][j]['status'] == true) {
                  text += " . " + jsonCol3[0]['SCM'][i]['check'][j]['titleEn'];
                }
              }
              result = result.replace('_Renal_Problem', text);
            } else {
              result = result.replace('_Renal_Problem', "");
            }
            break;
          case 'CVA':
            if (jsonCol3[0]['SCM'][i]['status']) {
              var text = jsonCol3[0]['SCM'][i]['input']['input'];
              for (let j = 0; j < jsonCol3[0]['SCM'][i]['check'].length; j++) {
                if (jsonCol3[0]['SCM'][i]['check'][j]['status'] == true) {
                  text += " . " + jsonCol3[0]['SCM'][i]['check'][j]['titleEn'];
                }
              }
              result = result.replace('_CVA', text);
            } else {
              result = result.replace('_CVA', "");
            }
            break;
        }
      }

      for (let i = 0; i < jsonCol4[0]['SIM'].length; i++) {
        switch (jsonCol4[0]['SIM'][i]['input'][0]['root']) {
          case 'Smoking':
            if (jsonCol4[0]['SIM'][i]['status']) {
              result = result.replace('_Smoking', jsonCol4[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Smoking', "");
            }

            break;
          case 'Alcohol':
            if (jsonCol4[0]['SIM'][i]['status']) {
              result = result.replace('_alcohol', jsonCol4[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_alcohol', "");
            }

            break;
          case 'Depression':
            if (jsonCol4[0]['SIM'][i]['status']) {
              result = result.replace('_Depression', jsonCol4[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Depression', "");
            }


            break;
          case 'Drug Allergy':
            if (jsonCol4[0]['SIM'][i]['status']) {
              result = result.replace('_Allergy', jsonCol4[0]['SIM'][i]['input'][0]['input'] + " . " + jsonCol4[0]['SIM'][i]['input'][1]['input']);
            } else {
              result = result.replace('_Allergy', "");
            }
            break;
          case 'Food Allergy':
            if (jsonCol4[0]['SIM'][i]['status']) {
              result = result.replace('_Food', jsonCol4[0]['SIM'][i]['input'][0]['input']);
            } else {
              result = result.replace('_Food', "");
            }
            break;
        }
      }

      if (jsonCol4[0]['SCIM'][0]['input'][0]['root'] == "Opium") {
        if (jsonCol4[0]['SCIM'][0]['status'] == true) {
          var text = jsonCol4[0]['SCIM'][0]['input'][0]['input'] + " . " + jsonCol4[0]['SCIM'][0]['input'][1]['input'] + " . " + jsonCol4[0]['SCIM'][0]['input'][2]['input'];
          if (jsonCol4[0]['SCIM'][0]['check'][0]['status'] == true) {
            text += jsonCol4[0]['SCIM'][0]['check'][0]['titleEn'];
          } else if (jsonCol4[0]['SCIM'][0]['check'][1]['status'] == true) {
            text += jsonCol4[0]['SCIM'][0]['check'][1]['titleEn'];
          } else if (jsonCol4[0]['SCIM'][0]['check'][2]['status'] == true) {
            text += jsonCol4[0]['SCIM'][0]['check'][2]['titleEn'];
          }
          result = result.replace('_Opium', text);
        } else {
          result = result.replace('_Opium', "")
        }

      }




      result = result.replace('_BMI', jsonCol6[0]['input'][0]['input']);
      result = result.replace('_H', jsonCol6[0]['input'][1]['input']);
      result = result.replace('_BW', jsonCol6[0]['input'][2]['input']);
      result = result.replace('_bbChildren', jsonCol6[0]['input'][3]['input']);
      result = result.replace('_bbDevelopmental', jsonCol6[0]['input'][4]['input']);

      result = result.replace('a_bbHR', jsonCol6[0]['input'][7]['input']);
      result = result.replace('_RR', jsonCol6[0]['input'][8]['input']);
      result = result.replace('_Neck_Movement', jsonCol6[0]['input'][9]['input']);
      result = result.replace('_Dentation', jsonCol6[0]['input'][10]['input']);
      result = result.replace('_bbHeart_Sound', jsonCol6[0]['input'][11]['input']);
      result = result.replace('_Lung_Sound', jsonCol6[0]['input'][12]['input']);
      result = result.replace('_GCS', jsonCol6[0]['input'][13]['input']);
      result = result.replace('_Paraclinic', jsonCol6[0]['input'][14]['input']);
      result = result.replace('_bbASA', jsonCol6[0]['input'][15]['input']);


      if (jsonCol7[0]['CM'][1]['status']) {
        result = result.replace('_c2', "*");
      } else {
        result = result.replace('_c2', "-");
      }

      if (jsonCol7[0]['CM'][2]['status']) {
        result = result.replace('_c3', "*");
      } else {
        result = result.replace('_c3', "-");
      }

      if (jsonCol7[0]['CM'][4]['status']) {
        result = result.replace('_c5', " * " + jsonCol7[0]['IM'][0]['input'] + " واحد ");
      } else {
        result = result.replace('_c5', "-");
      }

      if (jsonCol7[0]['CM'][5]['status']) {
        result = result.replace('_c6', "*");
      } else {
        result = result.replace('_c6', "-");
      }

      if (jsonCol7[0]['CM'][6]['status']) {
        result = result.replace('_c7', "*");
      } else {
        result = result.replace('_c7', "-");
      }

      if (jsonCol7[0]['CM'][9]['status']) {
        result = result.replace('_c10', "*");
      } else {
        result = result.replace('_c10', "-");
      }


      result = result.replace('Other_Cases', jsonCol7[0]['IM'][1]['input']);









      // result = result.replace('_BMI',jsonCol6[0]['input'][0]['input']);
      // result = result.replace('_BMI',jsonCol6[0]['input'][0]['input']);
      // result = result.replace('_BMI',jsonCol6[0]['input'][0]['input']);



      //   result = result.replace('_family_c2',response.data['data'][0]['fname']); 



      client.convertString(result, callbacks);


    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

}