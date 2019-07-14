import React, { useEffect, useState } from 'react';
import requireLogin from '@HoC/requireLogin';
import {auth} from '@HoC/withAuth';
import {newAuth} from '@HoC/withNewAuth';
import Container from '@components/FIM21';
import { Skeleton } from 'antd';

function fim21(props) {
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')
  const [step, setStep] = useState(-1)

  useEffect(() => {
    const fetchToken = async () => {
      const { token_FIM, step } = await newAuth(props.cookieLogin);

      setToken(token_FIM)
      setStep(step)
    }

    fetchToken();
    setLoading(false)
  }, [])

  return loading ? <Skeleton /> : <Container {...props} />
}

// fim21.getInitialProps = async ctx => {
//   // Check user's session
//   const { token_FIM, step } = await auth(ctx);

//   return { token_FIM, step }
// }

export default fim21;