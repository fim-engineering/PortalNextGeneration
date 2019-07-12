import React, { Component, Fragment } from 'react';
import {
  Skeleton,
  Button,
  message
} from 'antd';
import { fetch } from '@helper/fetch';

class Question extends Component {

  state = {
    isLoadQ: false,
    dataQuestion: [],
    currentTunnel: '',
    isLoadTunnel: false,
  }

  componentDidMount = () => {
    this.fetchQuestion()

    this.props.dataUser.tunnelId && this.fetchList()
  }

  toggleLoadQ = () => {
    this.setState(prevState => ({ isLoadQ: !prevState.isLoadQ }))
  }

  toggleLoadTunnel = () => {
    this.setState(prevState => ({ isLoadTunnel: !prevState.isLoadTunnel }))
  }

  setCurrentTunnel = (value) => {
    this.setState({ currentTunnel: value })
  }

  setErrorData = () => {
    this.setState({ dataQuestion: [0] })
  }

  fetchList = async () => {
    const { dataUser, cookieLogin } = this.props;

    this.toggleLoadTunnel()

    try {
      const response = await fetch({
        url: '/tunnel/list',
        method: 'get',
        headers: {
          'Authorization': `Bearer ${cookieLogin}`
        },
      })

      const status = (response.data.status || false)

      if (!status) {
        message.error("Server Error")
        this.setCurrentTunnel('ERROR')
      } else {
        const responseData = response.data.data || []

        if (dataUser.tunnelId) {
          const findData = responseData.find(item => item.id === dataUser.tunnelId)
          findData && this.setCurrentTunnel(findData)
        }

      }

      this.toggleLoadTunnel()

    } catch (error) {
      message.error("Server Error")
      this.setCurrentTunnel('ERROR')
      this.toggleLoadTunnel()
    }
  }

  fetchQuestion = async () => {
    const { cookieLogin, dataUser } = this.props;

    console.log("dataUser: ", dataUser)

    this.toggleLoadQ()

    try {
      const response = await fetch({
        url: '/question/list',
        method: 'post',
        headers: {
          'Authorization': `Bearer ${cookieLogin}`
        },
        data: {
          "tunnelId": dataUser.tunnelId || 1
        }
      })

      const status = (response.data.status || false)

      if (status) {
        this.setState({ 
          dataQuestion: response.data.data,
          answers: response.data.data.map(item => {
            return {
              questionId: item.id,
              answer: JSON.parse(item.header)
            }
          })
        })
      } else {
        this.setErrorData()
      }

      this.toggleLoadQ()

    } catch (error) {
      this.setErrorData()
      this.toggleLoadQ()
    }

  }

  renderQuestion = (question) => {

    return <Fragment key={question.id}>
      <div>{question.question}</div>
      <br />
    </Fragment>
  }

  renderContent = () => {
    const { dataQuestion, answers, currentTunnel } = this.state;

    return <Fragment>
      <h1>Jalur kamu {currentTunnel.name}</h1>
      {dataQuestion.length > 0 && dataQuestion.map(this.renderQuestion)}
    </Fragment>
  }

  render() {
    const { isLoadQ } = this.state;
    const { dataUser, refetchStep } = this.props;

    if (!dataUser.tunnelId) {
      return <Fragment>
        <div>Anda Belum Milih Jalur</div>
        <div><Button onClick={() => { refetchStep() }} type="primary">Refresh</Button></div>
      </Fragment>
    }

    return (<Fragment>
      {isLoadQ ? <Skeleton active /> : this.renderContent()}
    </Fragment>)
  }
}

export default Question;