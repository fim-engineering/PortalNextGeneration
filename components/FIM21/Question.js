import React, { Component, Fragment } from 'react';
import {
  Skeleton,
} from 'antd';
import { fetch } from '@helper/fetch';

class Question extends Component {

  state = {
    isLoadQ: false,
    dataQuestion: [],
  }

  componentDidMount = () => {
    this.fetchQuestion()

  }

  toggleLoadQ = () => {
    this.setState(prevState => ({ isLoadQ: !prevState.isLoadQ }))
  }

  setErrorData = () => {
    this.setState({ dataQuestion: [0] })
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
          "tunnelId": dataUser.tunnelId
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

    console.log("question: ", question)

    return <Fragment key={question.id}>
      <div>{question.question}</div>
      <br />
    </Fragment>
  }

  renderContent = () => {
    const { dataQuestion, answers } = this.state;
    console.log("dataQuestion: ", dataQuestion)
    console.log("answers: ", answers)

    return <Fragment>
      <h1>Jalur kamuu</h1>
      {dataQuestion.length > 0 && dataQuestion.map(this.renderQuestion)}
    </Fragment>
  }

  render() {
    const { isLoadQ } = this.state;

    return (<Fragment>
      {isLoadQ ? <Skeleton active /> : this.renderContent()}
    </Fragment>)
  }
}

export default Question;