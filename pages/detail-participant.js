import React from 'react';
import { withRouter } from 'next/router';
import { Result, Icon, Button, Divider, List, Avatar, Carousel, Table, message } from 'antd';
import { fetch } from '@helper/fetch';
import PenilaianCard from '../components/Recruiter/ListCardRecruiter/PenilaianCard';



class DetailParticipant extends React.Component {

    
    static async getInitialProps({ query }) {
        console.log('SLUG initial Bagus', query);
        return {};
      }
    
    fetchDetailData = async () =>{
        const payload = {
            ktpNumber: this.props.router.query.slug,
            tunnelId: this.props.router.query.tunnel
        }

        // setIsLoading(true);
        const { cookieLogin, refetchStep } = this.props;
        try {
            const response = await fetch({
                url: '/recruiter/participant/detail',
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
                console.log(response.data.data)           
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
            <h1>Menampilkan Data {query.slug} |  {query.tunnel}</h1>
            <div>


            <PenilaianCard/>
            </div>

            <style jsx>{`
                    
                `}</style>
            </>
        )
    }
}

export default withRouter(DetailParticipant);