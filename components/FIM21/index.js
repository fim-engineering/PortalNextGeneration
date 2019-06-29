import React, { Fragment } from 'react';
import { Steps, Divider } from 'antd';
const { Step } = Steps;

function StepBar() {
  return (
    <Steps current={0} onChange={(props) => { console.log("props: ", props) }}>
      <Step title="KTP" description="Wording KTP" />
      <Step title="Data Diri" description="Wording Data Diri" />
      <Step title="Pilih Jalur" description="Silahkan Pilih Jalur Anda" />
      <Step title="Isi Formulir Jalur" description="Silahkan Isi Jalur Anda" />
    </Steps>
  )
}

function ContainerFim21() {
  return (<Fragment>
    <StepBar />
  </Fragment>)
}

export default ContainerFim21;