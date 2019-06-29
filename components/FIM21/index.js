import React, { Fragment, useState, useEffect } from 'react';
import { Steps, Divider } from 'antd';
import { fetch } from '@helper/fetch';
const { Step } = Steps;

function StepBar({ step, setStep }) {
  return (
    <Steps current={step} onChange={setStep}>
      <Step title="KTP" description="Wording KTP" />
      <Step title="Data Diri" description="Wording Data Diri" />
      <Step title="Pilih Jalur" description="Silahkan Pilih Jalur Anda" />
      <Step title="Isi Formulir Jalur" description="Silahkan Isi Jalur Anda" />
    </Steps>
  )
}

function ContainerFim21({ cookieLogin }) {

  const [step, setStep] = useState(0);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch({
          url: '/auth/checksession',
          method: 'post',
          data: {
            token: cookieLogin
          }
        })
  
        const status = (response.data.status || false)
  
        if (!status) {
          setStep(0)
        }
  
        setStep(response.data.data.step)
  
      } catch (error) {
        console.log("error: ", error);
        
        setStep(0)
      }
    };

    fetchData();
  }, [step])


  return (<Fragment>
    <StepBar step={step} setStep={setStep} />
  </Fragment>)
}

export default ContainerFim21;