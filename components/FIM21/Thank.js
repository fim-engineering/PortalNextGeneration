import react, { Component } from 'react';
import {
  Divider,
  Empty,
  notification,
  Skeleton,
  Steps,
  Result,
  Button,
} from 'antd';
import Router from 'next/router';
import { fetch } from '@helper/fetch';
import { sendPageview } from '@tracker';

class Thank extends Component {

  state = {
    isCanMultiple: false
  }

  componentDidMount = () => {
    this.fetchSummaryCheck()

    sendPageview({ pathName: '/thanks' })
  }

  fetchSummaryCheck = async () => {
    const { cookieLogin } = this.props;

    try {
      const response = await fetch({
        url: '/summary/check',
        method: 'post',
        headers: {
          'Authorization': `Bearer ${cookieLogin}`
        }
      })

      const status = (response.data.status || false)

      this.setState({ isCanMultiple: status })
      
    } catch (error) {
      
    }
  }

  render() {
    const { onChangeStep } = this.props
    const { isCanMultiple } = this.state

    let extraButton = [
      <Button onClick={() => { Router.push('/') }} type="primary" key="console">
        Kembali Ke Beranda
      </Button>
    ]

    if (isCanMultiple) {
      extraButton.push(
        <Button onClick={() => { onChangeStep(2) }} key="buy">Memilih Jalur Lain</Button>
      )
    }

    return (
      <Result
        status="success"
        title="Data Kamu sudah masuk, silahkan tunggu!"
        subTitle={isCanMultiple ? "untuk kamu alumni FIM 20, dapat memilih jalur Next Gen dan jalur Non Next Gen sekaligus, dengan total maksimal 2 jalur yang didaftarkan" : "Silahkan Menunggu Pengumuman"}
        extra={extraButton}
      />
    )
  }
}

export default Thank;