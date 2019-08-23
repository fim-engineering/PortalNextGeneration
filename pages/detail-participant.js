import React from 'react';
import { withRouter } from 'next/router';

class DetailParticipant extends React.Component {

    
    static async getInitialProps({ query }) {
        console.log('SLUG initial Bagus', query.slug);
        return {};
      }
    
    fetchDetailData = async () =>{
        const payload = {
            ktpNumber: this.props.router.query.slug
        }

        // setIsLoading(true);
        const { cookieLogin, refetchStep } = props;
        try {
            const response = await fetch({
                url: 'recruiter/assign',
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
                // message.success(response.data.message)
                fetchAllParticipantTersisa();
                fetchAllParticipantAssign();
                // setAllParticipantAvailable(response.data.data)
            }

        } catch (error) {
            message.error("Server Error")
            // setIsLoading(false);
        }
    }

    componentDidMount(){
        this.fetchDetailData();
    }
    
    render(){
       
        const { router: { query } } = this.props
        return(
            <>
            <h1>Menampilkan Data {query.slug}</h1>
            </>
        )
    }
}

export default withRouter(DetailParticipant);