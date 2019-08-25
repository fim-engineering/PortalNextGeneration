import React from 'react';
import { withRouter } from 'next/router';
import { Result, Icon, Button, Divider, List, Avatar, Carousel, Table, Input, message } from 'antd';
import { fetch } from '@helper/fetch';



class PenilaianCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scoreDataDiri: this.props.scoreUpdated ? this.props.scoreUpdated.scoreDataDiri : "" ,
            scoreAktivitas: this.props.scoreUpdated ? this.props.scoreUpdated.scoreAktivitas : "" ,
            scoreProject: this.props.scoreUpdated ? this.props.scoreUpdated.scoreProject : "" ,
            scoreOther: this.props.scoreUpdated ? this.props.scoreUpdated.scoreOther : "" ,
            notes: this.props.scoreUpdated ? this.props.scoreUpdated.notes : "" ,
            TunnelId: this.props.TunnelId,
            ktpNumber: this.props.ktpNumber,
        }
    }
    // static async getInitialProps({ query }) {
    //     console.log('SLUG initial Bagus', query);
    //     return {};
    // }

    submitScore = async () => {
        const payload = {
            ...this.state
        }

        // setIsLoading(true);
        const { cookieLogin, refetchStep } = this.props;
        try {
            const response = await fetch({
                url: '/recruiter/participant/update/score',
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${cookieLogin}`,
                }, data: {
                    ...payload
                }
            })

            const status = (response.data.status || false)

            if (!status) {
                message.error(response.data.message)
                // setIsLoading(false);
            } else {
                message.success(response.data.message)               
            }

        } catch (error) {
            message.error("Server Error")

            // setIsLoading(false);
        }
    }
    

    onSubmitScoreHandler(e) {
        e.preventDefault();
        this.submitScore();
    }

    // componentDidMount(){
    //     this.setState({
    //         scoreDataDiri : this.props.scoreUpdated !== null ? this.props.scoreUpdated.scoreDataDiri : "",
    //         scoreAktivitas : this.props.scoreUpdated !== null ? this.props.scoreUpdated.scoreAktivitas : "",
    //         scoreProject : this.props.scoreUpdated !== null ? this.props.scoreUpdated.scoreProject : "",
    //         scoreOther : this.props.scoreUpdated !== null ? this.props.scoreUpdated.scoreOther : "",
    //         notes : this.props.scoreUpdated !== null ? this.props.scoreUpdated.notes : ""
    //     });
    // }

    render() {              
        const { router: { query } } = this.props
        return (
            <>
                <div className="penilaian-wrapper">
                    <h1 style={{ marginRight: '20px' }} >Penilaian</h1>
                    <div className="score-wrapper">
                        <label>Data Diri</label>
                        <Input value={this.state.scoreDataDiri} onChange={(e) => { this.setState({ scoreDataDiri: e.target.value }) }} type="number" min="0" placeholder="Score"></Input>
                    </div>
                    <div className="score-wrapper">
                        <label>Aktivitas</label>
                        <Input value={this.state.scoreAktivitas} onChange={(e) => { this.setState({ scoreAktivitas: e.target.value }) }} type="number" min="0" placeholder="Score"></Input>
                    </div>
                    <div className="score-wrapper">
                        <label>Project</label>
                        <Input value={this.state.scoreProject} onChange={(e) => { this.setState({ scoreProject: e.target.value }) }} type="number" min="0" placeholder="Score"></Input>
                    </div>
                    <div className="score-wrapper">
                        <label>Other</label>
                        <Input value={this.state.scoreOther} onChange={(e) => { this.setState({ scoreOther: e.target.value }) }} type="number" min="0" placeholder="Score"></Input>
                    </div>
                    <div className="score-wrapper">
                        <label>Notes</label>
                        <Input value={this.state.notes} onChange={(e) => { this.setState({ notes: e.target.value }) }} type="text" placeholder="comment here..."></Input>
                    </div>
                    <Button type="primary" onClick={(e) => this.onSubmitScoreHandler(e)} style={{ marginTop: '20px' }}>
                        Submit
                    </Button>
                </div>


                <style jsx>{`

                .penilaian-wrapper{
                    position:fixed;
                    background:#b7b7b7;
                    width:100vw;
                    bottom:0;
                    left:0;
                    padding:20px;
                    display:flex;
                    flex-direction:row;                  
                    justify-content:center;
                    align-item:center;
                }

                .score-wrapper{
                    margin-right:10px;
                }
                    
                `}</style>
            </>
        )
    }
}

export default withRouter(PenilaianCard);