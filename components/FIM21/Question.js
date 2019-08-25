import React, { Component, Fragment } from 'react';
import {
  Skeleton,
  Button,
  message,
  Input,
  Modal,
} from 'antd';
import { fetch } from '@helper/fetch';
import { object } from 'prop-types';
import { debounce } from "debounce";
import { sendPageview } from '@tracker';

const { confirm } = Modal;

class Question extends Component {

  constructor(props) {
    super(props)

    this.saveAnswer = debounce(this._saveAnswer, 300)
  }

  state = {
    answers: [],
    isLoadButton: false,
    isLoadQ: false,
    dataQuestion: [],
    currentTunnel: '',
    isLoadTunnel: false,
  }

  componentDidMount = () => {
    this.fetchQuestion(this.fetchExistAnswer)

    this.props.dataUser.TunnelId && this.fetchList()

    sendPageview({ pathName: '/question' })
  }

  fetchExistAnswer = async () => {
    const { cookieLogin, dataUser } = this.props;
    const { answers } = this.state;

    try {
      const response = await fetch({
        url: '/answer/lists',
        method: 'post',
        headers: {
          'Authorization': `Bearer ${cookieLogin}`
        },
        data: {
          TunnelId: dataUser.TunnelId,
          ktpNumber: dataUser.Identity.ktpNumber,
        }
      })

      

      const status = (response.data.status || false)
      const data = response.data.data || []

      if (status && data.length > 0) {
        
        const newData = data.map(x => {
          return {
            QuestionId: x.QuestionId,
            answer: JSON.parse(x.answer)
          }
        })

        const newAnswer = answers.map(answer => {

          const findingData = newData.find(data => data.QuestionId === answer.QuestionId)
          if (findingData) {
            return findingData
          } else {
            return answer
          }

        })

        this.setState({ answers: newAnswer })
      }

    } catch (error) {
      
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { answers: prevAnswer } = prevState
    const { answers: currentAnswer } = this.state;

    if (currentAnswer.length > 0) {
      (JSON.stringify(prevAnswer) !== JSON.stringify(currentAnswer)) && this.saveAnswer()
    }

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

        if (dataUser.TunnelId) {
          const findData = responseData.find(item => item.id === dataUser.TunnelId)
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

  fetchQuestion = async (cb) => {
    const { cookieLogin, dataUser } = this.props;

    this.toggleLoadQ()

    try {
      const response = await fetch({
        url: '/question/list',
        method: 'post',
        headers: {
          'Authorization': `Bearer ${cookieLogin}`
        },
        data: {
          "TunnelId": dataUser.TunnelId || 1
        }
      })

      const status = (response.data.status || false)

      if (status) {
        this.setState({ 
          dataQuestion: response.data.data,
          answers: response.data.data.map(item => {
            return {
              QuestionId: item.id,
              answer: JSON.parse(item.header)
            }
          })
        }, () => { cb() })
      } else {
        this.setErrorData()
      }

      this.toggleLoadQ()

    } catch (error) {
      this.setErrorData()
      this.toggleLoadQ()
    }

  }

  handleChange = (event, id, header) => {
    event.preventDefault()
    const { value } = event.target;
    const { answers } = this.state;

    const newAnswer = answers.map(object => {
      if (object.QuestionId === id) {
        return {
          ...object,
          answer: {
            ...object.answer,
            [header[0]]: value
          }
        }
      }

      return object
    })

    this.setState({
      answers: newAnswer
    })

  }

  renderQuestion = (question) => {
    const { answers } = this.state;

    const headerQuestion = JSON.parse(question.header)
    const entriesQ = Object.entries(headerQuestion)

    const findAnswer = answers.find(answer => answer.QuestionId === question.id)

    return <Fragment key={question.id}>
      <h1 style={{ fontWeight: 'bold' }}>{question.headline}</h1>
      <div dangerouslySetInnerHTML={{ __html: question.question }} />
      <div dangerouslySetInnerHTML={{ __html: question.note }} />
      <div>
        {entriesQ.map((q, idx) => {
          return (<Fragment key={idx}>
            <div style={{ fontWeight: 'bold' }} >{q[0]}</div>
            <Input
              value={findAnswer.answer[q[0]]}
              onChange={(e) => { this.handleChange(e, question.id, q) }}
            />
          </Fragment>)
        })}
        {/*<Input
          onChange={(e) => { this.handleChange(e, question.id, headerQuestion) }}
        />*/}
      </div>
      <br />
    </Fragment>
  }

  renderContent = () => {
    const { dataQuestion, currentTunnel } = this.state;

    return <Fragment>
      <span>Jalur kamu </span>
      <h1 style={{ fontWeight: 'bold' }}>{currentTunnel.name}</h1>
      {dataQuestion.length > 0 && dataQuestion.map(this.renderQuestion)}
    </Fragment>
  }

  _saveAnswer = async () => {
    const { cookieLogin, dataUser, refetchStep } = this.props;
    const { answers } = this.state;

    try {
      const response = await fetch({
        url: '/answer/save',
        method: 'post',
        headers: {
          'Authorization': `Bearer ${cookieLogin}`
        },
        data: {
          answers: answers,
          TunnelId: dataUser.TunnelId,
          ktpNumber: dataUser.Identity.ktpNumber,
        }
      })

      const status = (response.data.status || false)

      if (!status) {
        message.error("Gagal menyimpan Data")
      } else {
        message.success(response.data.message)
      }

    } catch (error) {
      console.log("err: ", error)
      message.error("Gagal menyimpan Data")
    }
  }

  toggleLoadButton = () => {
    this.setState(prevState => ({ isLoadButton: !prevState.isLoadButton }))
  }

  submitEvent = async () => {
    const { answers } = this.state;
    const { cookieLogin, dataUser, refetchStep } = this.props;

    try {
      const response = await fetch({
        url: '/summary/update-final-submit',
        method: 'post',
        headers: {
          'Authorization': `Bearer ${cookieLogin}`
        },
        data: {
          TunnelId: dataUser.TunnelId,
          ktpNumber: dataUser.Identity.ktpNumber,
        }
      })

      const status = (response.data.status || false)

      if (!status) {
        message.error("Gagal menyimpan Data")
      } else {
        message.success(response.data.message)
        refetchStep()
      }

    } catch (error) {
      message.error("Gagal menyimpan Data")
      
    }

    //TODO: Hit Final Submit

    // try {
      
    // } catch (error) {
      
    // }
  }

  showConfirm = () => {
    confirm({
      title: 'Kamu yakin akan mengirimkan data ini?',
      content: 'Sekali kamu kirimkan, tidak akan bisa diubah!',
      onOk: () => {
        this.submitEvent()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  get buttonSubmitProps() {
    const { isLoadButton } = this.state;

    return {
      loading: isLoadButton,
      onClick: this.showConfirm,
      type: 'primary',
      size: 'large'
    }
  }

  render() {
    const { isLoadQ } = this.state;
    const { dataUser, refetchStep } = this.props;

    if (!dataUser.TunnelId) {
      return <Fragment>
        <div>Anda Belum Milih Jalur</div>
        <div><Button onClick={() => { refetchStep() }} type="primary">Refresh</Button></div>
      </Fragment>
    }

    return (<Fragment>
      {isLoadQ ? <Skeleton active /> : this.renderContent()}
      <Button {...this.buttonSubmitProps} >
        Submit
      </Button>
    </Fragment>)
  }
}

export default Question;