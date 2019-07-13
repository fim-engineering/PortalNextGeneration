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

    this.props.dataUser.tunnelId && this.fetchList()
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
          tunnelId: dataUser.tunnelId,
          ktpNumber: dataUser.Identity.ktpNumber,
        }
      })

      const status = (response.data.status || false)
      const data = response.data.data || []

      if (status && data.length > 0) {

        const newData = data.map(x => {
          return {
            questionId: x.questionId,
            answer: JSON.parse(x.answer),
          }
        })

        const newAnswer = answers.map(answer => {
          const findingData = newData.find(data => data.questionId === answer.questionId)
          
          if (findingData) {
            return {
              ...answer,
              ...findingData,
              formCount:findingData.answer.length
            }
          } else {
            return {
              answer
            }
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
              answer: item.isMany == 1 ? [JSON.parse(item.header)] : JSON.parse(item.header),
              isMany: item.isMany,
              formCount: 1
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
      if (object.questionId === id) {
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

 

  handleArrayChange = async (event, id, header,key,index,headerQuestion) => {
    event.preventDefault()
    const { value } = event.target;
    const { answers } = this.state;

    // ambil object array yang sekarang
    let currentArray = answers[key].answer;    
    
    // berapa index (tambah) yang terdeteksi ?
    if(answers[key].answer[index] == undefined){
      currentArray.push(headerQuestion)
    }

    // ubah array index yang dipilih jadi baru nilainya
    const newObject = {
      ...answers[key].answer[index],
      [header[0]]:value
    }

    // Update array dengan pasang ke array target dengan membuat array baruu dengan menyelipkan newObject pada array yang dituju
    const barugaes = [];    
    const newArray = await currentArray.map((value,indexnya)=>{     
     
      // kika index sama dengan indexnya update object baru
      if(index == indexnya){
        currentArray[index]= newObject;
      }    
    })

    const newAnswer = answers.map(object => {
      if (object.questionId === id) {       
        return {
          ...object,
          answer: currentArray
        }
      }
      return object
    })

    this.setState({
      answers: newAnswer
    })

  }

  addFormHandler = (e, idQuestion, key) => {
    e.preventDefault();
    const { answers } = this.state;
    const { formCount } = this.state.answers[key];
    const newCount = formCount + 1;


    const newAnswer = answers.map(object => {
      if (object.questionId === idQuestion) {
        return {
          ...object,
          formCount: newCount
        }
      }
      return object
    })

    this.setState({
      answers: newAnswer
    })

  }

  renderQuestion = (question, key) => {
    const { answers } = this.state;

    const headerQuestion = JSON.parse(question.header)
    const entriesQ = Object.entries(headerQuestion)

    const findAnswer = answers.find(answer => answer.questionId === question.id)

    let form = null;

    if (question.isMany == 0) {
      form = <div style={{margin: '20px 0px' }}>
        {entriesQ.map((q, idx) => {
          return (<Fragment key={idx}>
            <div style={{ fontWeight: 'bold' }} >{q[0]}</div>
            <Input
              // type={headerQuestion[q[0]]}
              value={findAnswer.answer[q[0]]}
              onChange={(e) => this.handleChange(e, question.id, q)}
            />
          </Fragment>)
        })}
        {/*<Input onChange={(e) => { this.handleChange(e, question.id, headerQuestion) }} />*/}
      </div>
    } else {
      const arrayForm = [];
      for (let index = 0; index < this.state.answers[key].formCount; index++) {
        arrayForm.push(
          <div style={{ background: 'yellow', margin: '20px 0px' }}>
            {entriesQ.map((q, idx) => {
              return (<Fragment key={idx}>
                <div style={{ fontWeight: 'bold' }} >{q[0]}</div>
                <Input
                  // type={headerQuestion[q[0]]}
                  value={this.state.answers[key].answer[index]? this.state.answers[key].answer[index][q[0]] : 'null'}
                  onChange={(e) => this.handleArrayChange(e, question.id, q, key, index, headerQuestion)}
                />
              </Fragment>)
            })}
            {/*<Input onChange={(e) => { this.handleChange(e, question.id, headerQuestion) }} />*/}
          </div>
        )
      }

      form = arrayForm.map((value,index)=>(value));
    }

    return <Fragment key={question.id}>
      <div>{question.question}</div>

      {form}


      {question.isMany ? <Button onClick={(e) => { this.addFormHandler(e, question.id, key) }}>Tambah</Button> : null}
      <br />
    </Fragment>
  }

  renderContent = () => {
    const { dataQuestion, currentTunnel } = this.state;

    // console.log(dataQuestion);

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
          tunnelId: dataUser.tunnelId,
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
      message.error("Gagal menyimpan Data")
    }
  }

  toggleLoadButton = () => {
    this.setState(prevState => ({ isLoadButton: !prevState.isLoadButton }))
  }

  submitEvent = () => {
    const { answers } = this.state;

    console.log("answers: ", answers)

    //TODO: Hit Final Submit

    // try {

    // } catch (error) {

    // }
  }

  showConfirm = () => {
    confirm({
      title: 'Kamu Yakin akan mengirimkan data ini ?',
      content: 'Sekali anda mensubmit, tidak akan bisa diubah!',
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

    if (!dataUser.tunnelId) {
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