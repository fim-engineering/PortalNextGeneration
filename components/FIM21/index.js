import React, { Component, Fragment } from 'react';

import {
  Divider,
  Empty,
  notification,
  Skeleton,
  Steps,
} from 'antd';
import { fetch } from '@helper/fetch';
import KTP from './KTP';
const { Step } = Steps;

class ContainerFIM21 extends Component {

  state = {
    step: -1,
    stepReal: -1,
  }

  openNotificationWithIcon = (type, message) => {
    notification[type]({
      message
    });
  };

  onChangeStep = (index) => {
    const { stepReal } = this.state;

    if (index < stepReal) {
      // this.setState({ step: index + 1 })
      this.openNotificationWithIcon('error', 'Anda Tidak bisa mengubah data kembali')
    } else {
      this.openNotificationWithIcon('error', 'Anda Tidak boleh melompat tahapan')
    }

  }

  renderStepBar = () => {
    const { step } = this.state;

    return (
      <Steps current={step - 1} onChange={this.onChangeStep}>
        <Step title="KTP" description="Wording KTP" />
        <Step title="Data Diri" description="Wording Data Diri" />
        <Step title="Pilih Jalur" description="Silahkan Pilih Jalur Anda" />
        <Step title="Isi Formulir Jalur" description="Silahkan Isi Jalur Anda" />
      </Steps>
    )
  }

  componentDidMount = async () => {
    const { cookieLogin } = this.props;

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
        this.setState({ step: 0 })
      }

      this.setState({ step: response.data.data.step, stepReal: response.data.data.step })

    } catch (error) {
      console.log("error: ", error);
      
      this.setState({ step: 0 })
    }

  }

  renderContent = () => {
    const { step } = this.state;

    if (step === -1) {
      return <Skeleton active />
    } else if (step === 1) {
      return <KTP />
    } else if (step === 2) {
      return <h1>step 2</h1>
    }

    return <Empty />
  }

  render() {
    const { step } = this.state;

    return (<Fragment>
      {this.renderStepBar()}
      {this.renderContent()}
    </Fragment>)
  }
}

export default ContainerFIM21;