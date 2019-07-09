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
import DataDiri from './DataDiri';
import ChooseTunnel from './ChooseTunnel';
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

    if (index === 0) {
      this.openNotificationWithIcon('error', 'Anda Tidak bisa ubah KTP')
    } else if (index >= stepReal) {
      this.openNotificationWithIcon('error', 'Anda Tidak boleh melompat tahapan')
    } else {
      this.setState({ step: index + 1 })
    }

  }

  renderStepBar = () => {
    const { step } = this.state;

    return (
      <Steps current={step === 0 ? step : step - 1} onChange={this.onChangeStep}>
        <Step title="KTP" description="Wording KTP" />
        <Step title="Data Diri" description="Wording Data Diri" />
        <Step title="Pilih Jalur" description="Silahkan Pilih Jalur Anda" />
        <Step title="Isi Formulir Jalur" description="Silahkan Isi Jalur Anda" />
      </Steps>
    )
  }

  fetchSession = async () => {
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

  componentDidMount = async () => {

    this.fetchSession();

  }

  renderContent = () => {
    const { step } = this.state;
    const { dataUser, cookieLogin } = this.props;

    console.log("step: ", step)

    if (step === -1) {
      return <Skeleton active />
    } else if (step === 0) {
      return <KTP refetchStep={this.fetchSession} />
    } else if (step === 1) {
      return <KTP refetchStep={this.fetchSession} />
    } else if (step === 2) {
      return <DataDiri refetchStep={this.fetchSession} cookieLogin={cookieLogin} dataUser={dataUser} />
    } else if (step === 3) {
      return <ChooseTunnel refetchStep={this.fetchSession} cookieLogin={cookieLogin} dataUser={dataUser} />
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