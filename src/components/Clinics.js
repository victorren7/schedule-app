import { useEffect, useState } from 'react'
import axios from 'axios';
import moment from 'moment';


import './Clinics.css';

const Clinics = () => {

  const [appointments, setAppoitments] = useState([])
  const [authToken, setAuthTken] = useState('')
  const [clinics, setClinics] = useState([])
  // appointments in clinicA
  const [clinicA, setClinicA] = useState([])

  useEffect(() => {
    axios.post('api/login', {
      username:'victor',
      password: '123456'
    }).then((res) => setAuthTken(res.data.authToken))


    axios.get('/api/appointments', {
      headers: {
        Authorization: authToken
      }
    }
    ).then((res) => 
      setAppoitments(res.data.appointmentSlots
    ))

  
  }, [authToken])

  useEffect(() => {
    for (let index = 0; index < appointments.length; index++) {
      const element = appointments[index];

      console.log('element', element.clinicId)
      axios.get(`/api/clinics/${element.clinicId}`, {
        headers: {
          Authorization: authToken
        }
      }).then((res) => {
          setClinics(res.data)
          if (element.clinicId === 1 ) {
            setClinicA(clinicA => [...clinicA, element])
            
          }
      }).catch((err) => console.log(err))
      
    }
  }, [appointments, authToken])

  function formatUsPhone(phone) {

    const phoneTest = new RegExp(/^((\+1)|1)? ?\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})( ?(ext\.? ?|x)(\d*))?$/);

    phone = phone.trim();
    const results = phoneTest.exec(phone);
    if (results !== null && results.length > 8) {
      return "(" + results[3] + ") " + results[4] + "-" + results[5] + (typeof results[8] !== "undefined" ? " x" + results[8] : "");
    }
    else {
     return phone;
    }
  }

  // remove duplicates when page is updated
  const clinicAClean = Array.from(new Set(clinicA.map(a => a.id)))
  .map(id => {
    return clinicA.find(a => a.id === id)
  })
  
  console.log('clinicA', clinicAClean)

  console.log('appointments', appointments)
  
  return (
    <div>
      {clinics.length && clinics.length > 0 ?
        clinics.map(() => (
            // this is where we would map each clinic (clinicA and clinicB)
            console.log('multiple clinics')
      ))
      :
      <div className='clinicWrapper'>
        {console.log('clinics', clinics)}
        <div className='clinicInfo'>
          <span className='clinicName'>{clinics.name}</span>
          <span>{clinics.address}</span>
          <span>{clinics.city}, {clinics.state} {clinics.zipcode} </span>
        </div>
        {clinicAClean.map((item, i) => {
          return (
              <div className='providerWrap' key={i}>
                <div className='providerImage' />
                <div className='providerInfo'>
                  <span className='providerName'>{item.provider.name}, {item.provider.credentials}</span>
                  <span>{formatUsPhone(item.provider.phoneNumber)}</span>
                  <button className='timeButton' onClick={() => console.log('button is clicked')}>{moment(item.startTime).format('LT')}</button>
                </div>
              </div>
            )
        })}
      </div>
      }
    </div>
  )
}

export default Clinics