import React, { Component, Fragment } from 'react';

import {
  Divider,
  Empty,
  notification,
  Skeleton,
  Steps,
  Result,
  Button,
} from 'antd';
import { fetch } from '@helper/fetch';
import { KTP, DataDiri, ChooseTunnel, Question, Thank } from './Dynamic';
const { Step } = Steps;

class ContainerFIM21 extends Component {

  state = {
    step: -1,
    stepReal: -1,
    dataUser: {},
    isLoading: false,
  }

  toggleLoading = (value) => {
    this.setState({ isLoading: value })
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
        <Step title="KTP" description="Data identitas formal" />
        <Step title="Data Diri" description="Isian data diri calon peserta" />
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
        this.setState({ step: -2 })
      }

      const data = response.data.data || {}

      this.setState({ step: data.step, stepReal: data.step })

    } catch (error) {
      console.log("error: ", error);
      
      this.setState({ step: -2 })
    }
  }

  fetchDataProfile = async () => {
    const { cookieLogin } = this.props;

    this.toggleLoading(true)

    try {
      const response = await fetch({
        url: '/auth/get-profile',
        method: 'post',
        headers: {
          'Authorization': `Bearer ${cookieLogin}`
        },
      })
  
      const status = (response.data.status || false)
  
      if (!status) {
        this.setState({
          dataUser: {},
          step: -2
        })
      }

      this.setState({
        dataUser: response.data.data || {}
      })

      this.toggleLoading(false)
  
    } catch (error) {
      console.log("error: ", error)
      this.setState({
        dataUser: {},
        step: -2
      })

      this.toggleLoading(false)
    }
  }

  componentDidMount = async () => {

    this.refetchData()

  }

  refetchData = () => {
    this.fetchDataProfile();
    this.fetchSession();
  }

  renderContent = () => {
    const { step, dataUser, isLoading } = this.state;
    const { cookieLogin } = this.props;

    if (isLoading) {
      return <Skeleton active />
    }

    if (step === -1) {
      return <Skeleton active />
    } else if (step === 0 || step === null) {
      return <KTP refetchStep={this.refetchData} />
    } else if (step === 1) {
      return <KTP refetchStep={this.refetchData} />
    } else if (step === 2) {
      return <DataDiri refetchStep={this.refetchData} cookieLogin={cookieLogin} dataUser={dataUser} />
    } else if (step === 3) {
      return <ChooseTunnel refetchStep={this.refetchData} cookieLogin={cookieLogin} dataUser={dataUser} />
    } else if (step === 4) {
      return <Question refetchStep={this.refetchData} cookieLogin={cookieLogin} dataUser={dataUser} />
    } else if (step === 5) {
      return <Thank refetchStep={this.refetchData} cookieLogin={cookieLogin} dataUser={dataUser} onChangeStep={this.onChangeStep} />
    }

    return <Empty />
  }

  render() {
    const { step } = this.state;

    return (<Fragment>
      {step < 5 && this.renderStepBar()}
      {this.renderContent()}
    </Fragment>)
  }
}

export default ContainerFIM21;